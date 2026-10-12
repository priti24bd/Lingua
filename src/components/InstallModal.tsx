import React from 'react';
import { X, Smartphone, Laptop, WifiOff } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        <div className="p-6 bg-stone-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-white text-stone-900 rounded-xl flex items-center justify-center font-bold text-sm mb-2">
            LC
          </div>
          <h2 className="text-xl font-bold">Install LinguaConnect</h2>
          <p className="text-xs text-stone-300 mt-1">
            Access your 1-on-1 English calls from phone, tablet, or laptop.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {/* Android */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
              <div className="p-2 bg-stone-200 text-stone-800 rounded-lg shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-stone-900 mb-0.5">
                  Android and Google Play
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Open LinguaConnect in Chrome on your phone, tap the browser menu on the top right, and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </p>
              </div>
            </div>

            {/* iOS */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
              <div className="p-2 bg-stone-200 text-stone-800 rounded-lg shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-stone-900 mb-0.5">
                  Apple iPhone and iPad (Safari)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Open this website in Safari, tap the Share button at the bottom of the screen, and select <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>

            {/* Laptop */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
              <div className="p-2 bg-stone-200 text-stone-800 rounded-lg shrink-0 mt-0.5">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-stone-900 mb-0.5">
                  Laptop and Desktop (Chrome and Edge)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Click the install icon in the address bar on the right to install LinguaConnect as a desktop application.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-100 rounded-xl text-stone-700 text-xs flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-stone-500 shrink-0" />
            <span>Includes offline sync: past contacts, notes, and metrics remain accessible without internet.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
