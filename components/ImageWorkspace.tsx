import React, { useRef, ChangeEvent } from 'react';
import { STYLE_OPTIONS } from '../constants';
import UploadIcon from './icons/UploadIcon';
import MagicWandIcon from './icons/MagicWandIcon';
import TrashIcon from './icons/TrashIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ImageWorkspaceProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  statusText: string;
  isImageLoaded: boolean;
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  onEnhance: () => void;
  onReset: () => void;
  onDownload: () => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  isEnhanceDisabled: boolean;
}

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  onImageUpload,
  imageUrl,
  isLoading,
  error,
  statusText,
  isImageLoaded,
  selectedStyle,
  onStyleChange,
  onEnhance,
  onReset,
  onDownload,
  customPrompt,
  onCustomPromptChange,
  isEnhanceDisabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden">
        {!isImageLoaded ? (
          <div className="text-center p-4">
            <button
              onClick={handleUploadClick}
              className="flex flex-col items-center justify-center text-gray-400 hover:text-orange-400 transition-colors p-8 rounded-lg"
              aria-label="Upload a photo"
            >
              <UploadIcon className="w-12 h-12 md:w-16 md:h-16 mb-4" />
              <span className="text-md md:text-lg font-semibold">Click to Upload Photo</span>
              <span className="text-xs md:text-sm">PNG, JPG, or WEBP</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
          </div>
        ) : (
          <img
            src={imageUrl || ''}
            alt="Workspace"
            className="object-contain w-full h-full"
          />
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center space-y-4 z-10 backdrop-blur-sm p-4">
            <div className="w-12 h-12 border-4 border-t-orange-500 border-gray-600 rounded-full animate-spin"></div>
            <p className="text-lg text-white font-semibold">Enhancing your masterpiece...</p>
            <p className="text-sm text-gray-300">This can take a moment.</p>
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl text-center p-2 rounded-md min-h-[48px] flex items-center justify-center">
        {error ? (
          <p className="text-red-400 font-semibold">{error}</p>
        ) : (
          <p className="text-gray-300 text-sm md:text-base">{statusText}</p>
        )}
      </div>

      {isImageLoaded && (
        <div className="w-full max-w-4xl mt-6 space-y-6">
          {/* Style Options */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Choose Style</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onStyleChange(option.id)}
                  className={`text-left p-3 rounded-lg transition-colors text-sm font-medium ${
                    selectedStyle === option.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>

            {selectedStyle === 'custom' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Custom Styling</h3>
                <textarea
                  value={customPrompt}
                  onChange={(e) => onCustomPromptChange(e.target.value)}
                  placeholder="e.g., Make the background black and white..."
                  rows={4}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-200 text-sm placeholder-gray-400 focus:outline-none transition-all duration-200 ring-2 ring-orange-500 border-none"
                  aria-label="Custom styling prompt"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={onEnhance}
              disabled={isEnhanceDisabled}
              className="bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-500 transition-colors disabled:bg-orange-900/50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <MagicWandIcon className="w-5 h-5" />
              <span>{isLoading ? 'Enhancing...' : 'Enhance'}</span>
            </button>
            <button
              onClick={onDownload}
              disabled={!isImageLoaded}
              className="bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-500 transition-colors disabled:bg-gray-700/50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </button>
            <button
              onClick={onReset}
              disabled={!isImageLoaded}
              className="text-gray-400 font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed border border-gray-600"
            >
              <TrashIcon className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWorkspace;
