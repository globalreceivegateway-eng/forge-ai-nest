import React, { useRef, ChangeEvent } from 'react';
import UploadIcon from './icons/UploadIcon';
import AdjustmentsIcon from './icons/AdjustmentsIcon';

interface ImageWorkspaceProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  statusText: string;
  isImageLoaded: boolean;
  onOpenSidebar: () => void;
}

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  onImageUpload,
  imageUrl,
  isLoading,
  error,
  statusText,
  isImageLoaded,
  onOpenSidebar,
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
      <div className="relative w-full max-w-4xl aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden">
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
         <div className="w-full max-w-4xl mt-4 lg:hidden">
            <button
                onClick={onOpenSidebar}
                className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-500 transition-colors"
            >
                <AdjustmentsIcon className="w-5 h-5" />
                <span>Edit Styles</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default ImageWorkspace;
