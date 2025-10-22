import React from 'react';
import { STYLE_OPTIONS } from '../constants';
import MagicWandIcon from './icons/MagicWandIcon';
import TrashIcon from './icons/TrashIcon';
import DownloadIcon from './icons/DownloadIcon';
import XIcon from './icons/XIcon';

interface SidebarProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  onEnhance: () => void;
  onReset: () => void;
  onDownload: () => void;
  isImageUploaded: boolean;
  isLoading: boolean;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  isEnhanceDisabled: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarContent: React.FC<Omit<SidebarProps, 'isOpen' | 'onClose'>> = ({
  selectedStyle,
  onStyleChange,
  onEnhance,
  onReset,
  onDownload,
  isImageUploaded,
  isLoading,
  customPrompt,
  onCustomPromptChange,
  isEnhanceDisabled,
}) => (
  <>
    <div className="px-6 pt-6 lg:pt-0">
      <h2 className="text-xl font-bold text-foreground mb-4">Choose Style</h2>
      <div className="space-y-2">
        {STYLE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onStyleChange(option.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
              selectedStyle === option.id
                ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(14_100%_57%/0.3)]'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>

      {selectedStyle === 'custom' && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-3">Custom Styling</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            placeholder="e.g., Make the background black and white..."
            rows={4}
            className="w-full p-3 rounded-lg bg-input text-foreground text-sm placeholder-muted-foreground focus:outline-none transition-all duration-200 ring-2 ring-primary border-none"
            aria-label="Custom styling prompt"
          />
        </div>
      )}
    </div>

    <div className="flex-grow"></div>

    <div className="space-y-3 p-6 lg:p-0 lg:pb-6 lg:px-6">
      <button
        onClick={onEnhance}
        disabled={isEnhanceDisabled}
        className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
      >
        <MagicWandIcon className="w-5 h-5" />
        <span>{isLoading ? 'Enhancing...' : 'Enhance'}</span>
      </button>
      <button
        onClick={onDownload}
        disabled={!isImageUploaded}
        className="w-full bg-secondary text-secondary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border"
      >
        <DownloadIcon className="w-5 h-5" />
        <span>Download</span>
      </button>
      <button
        onClick={onReset}
        disabled={!isImageUploaded}
        className="w-full text-muted-foreground font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TrashIcon className="w-5 h-5" />
        <span>Reset</span>
      </button>
    </div>
  </>
);

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { isOpen, onClose } = props;

  return (
    <>
      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-2xl shadow-2xl transition-transform transform-gpu duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 id="sidebar-title" className="text-lg font-bold text-foreground">Edit Styles</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <XIcon className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="flex flex-col h-[70vh] max-h-[70vh] overflow-y-auto">
          <SidebarContent {...props} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 glass-card p-6 flex-col space-y-8 border-r border-border">
        <SidebarContent {...props} />
      </aside>
    </>
  );
};

export default Sidebar;
