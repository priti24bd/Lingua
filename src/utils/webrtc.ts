// WebRTC Peer-to-Peer Connection Manager with STUN and Signaling

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'candidate' | 'join' | 'ready';
  roomId: string;
  senderId: string;
  senderName: string;
  payload?: any;
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onConnectionStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private roomId: string;
  private localUserId: string;
  private localUserName: string;

  constructor(roomId: string, userId: string, userName: string) {
    this.roomId = roomId;
    this.localUserId = userId;
    this.localUserName = userName;

    try {
      this.broadcastChannel = new BroadcastChannel(`lc_room_${roomId}`);
      this.broadcastChannel.onmessage = (event) => this.handleSignalingMessage(event.data);
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    // Also listen to window storage events for multi-tab signaling fallback
    window.addEventListener('storage', this.handleStorageSignal);
  }

  public setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    if (this.peerConnection) {
      stream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, stream);
      });
    }
  }

  public onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
  }

  public onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
    this.onConnectionStateChangeCallback = callback;
  }

  public initConnection(isInitiator: boolean) {
    this.peerConnection = new RTCPeerConnection(RTC_CONFIG);

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.onRemoteStreamCallback?.(event.streams[0]);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        this.onConnectionStateChangeCallback?.(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: 'candidate',
          roomId: this.roomId,
          senderId: this.localUserId,
          senderName: this.localUserName,
          payload: event.candidate
        });
      }
    };

    if (isInitiator) {
      this.createOffer();
    } else {
      this.sendSignal({
        type: 'ready',
        roomId: this.roomId,
        senderId: this.localUserId,
        senderName: this.localUserName
      });
    }
  }

  private async createOffer() {
    if (!this.peerConnection) return;
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.sendSignal({
        type: 'offer',
        roomId: this.roomId,
        senderId: this.localUserId,
        senderName: this.localUserName,
        payload: offer
      });
    } catch (err) {
      console.error('Failed to create WebRTC offer', err);
    }
  }

  private async handleSignalingMessage(msg: SignalingMessage) {
    if (msg.roomId !== this.roomId || msg.senderId === this.localUserId) return;

    if (msg.type === 'ready') {
      this.createOffer();
    } else if (msg.type === 'offer') {
      if (!this.peerConnection) {
        this.initConnection(false);
      }
      try {
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(msg.payload));
        const answer = await this.peerConnection?.createAnswer();
        if (answer) {
          await this.peerConnection?.setLocalDescription(answer);
          this.sendSignal({
            type: 'answer',
            roomId: this.roomId,
            senderId: this.localUserId,
            senderName: this.localUserName,
            payload: answer
          });
        }
      } catch (err) {
        console.error('Error handling offer', err);
      }
    } else if (msg.type === 'answer') {
      try {
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(msg.payload));
      } catch (err) {
        console.error('Error handling answer', err);
      }
    } else if (msg.type === 'candidate') {
      try {
        await this.peerConnection?.addIceCandidate(new RTCIceCandidate(msg.payload));
      } catch (err) {
        console.error('Error handling candidate', err);
      }
    }
  }

  private handleStorageSignal = (event: StorageEvent) => {
    if (event.key === `lc_sig_${this.roomId}` && event.newValue) {
      try {
        const msg = JSON.parse(event.newValue) as SignalingMessage;
        this.handleSignalingMessage(msg);
      } catch {
        // ignore
      }
    }
  };

  private sendSignal(msg: SignalingMessage) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(msg);
    }
    // Storage fallback for cross-tab signaling
    try {
      localStorage.setItem(`lc_sig_${this.roomId}`, JSON.stringify(msg));
    } catch {
      // ignore
    }
  }

  public destroy() {
    window.removeEventListener('storage', this.handleStorageSignal);
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}
