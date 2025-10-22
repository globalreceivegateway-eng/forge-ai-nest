import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ImageWorkspace from './components/ImageWorkspace';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SandAnimation from './components/SandAnimation';
import { editImageWithAI } from './services/imageEditService';
import { STYLE_OPTIONS } from './constants';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_OPTIONS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Upload an image to get started.');
  const [isWorkspace, setIsWorkspace] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setEditedImageUrl(url); // Show original image initially in workspace
    setError(null);
    setStatusText('Select a style and click "Enhance" to begin.');
    setSelectedStyle(STYLE_OPTIONS[0].id);
    setCustomPrompt('');
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    if (style !== 'custom') {
      setCustomPrompt('');
    }
  };

  const handleCustomPromptChange = (prompt: string) => {
    setCustomPrompt(prompt);
    setSelectedStyle('custom');
  };

  const handleEnhance = async () => {
    if (!originalImageFile || !editedImageUrl) return;

    setIsLoading(true);
    setError(null);
    setStatusText('Enhancing your image...');

    try {
      const editedBase64 = await editImageWithAI(
        editedImageUrl,
        selectedStyle,
        customPrompt
      );

      setEditedImageUrl(editedBase64);
      setStatusText('Enhancement complete! Download or edit again.');
    } catch (err) {
      console.error('Enhancement error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while enhancing the image.';
      setError(errorMessage);
      setStatusText('Enhancement failed. Please try again.');
      
      // Show user-friendly error for rate limits
      if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else if (errorMessage.includes('Payment') || errorMessage.includes('402')) {
        setError('AI credits exhausted. Please add credits in Settings > Workspace > Usage.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setEditedImageUrl(null);
    setError(null);
    setIsLoading(false);
    setStatusText('Upload an image to get started.');
    setSelectedStyle(STYLE_OPTIONS[0].id);
    setCustomPrompt('');
    if (isSidebarOpen) setIsSidebarOpen(false);
  };
  
  const handleDownload = () => {
    if (!editedImageUrl || !originalImageFile) return;
    const link = document.createElement('a');
    link.href = editedImageUrl;
    link.download = `edited-${originalImageFile.name.split('.')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleEnterEditor = () => {
    setIsWorkspace(true);
  }

  if (!isWorkspace) {
    return <HomePage onEnterEditor={handleEnterEditor} />;
  }

  const isEnhanceDisabled = !originalImageFile || isLoading || (selectedStyle === 'custom' && !customPrompt.trim());

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <SandAnimation />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleChange}
            onEnhance={handleEnhance}
            onReset={handleReset}
            onDownload={handleDownload}
            isImageUploaded={!!originalImageFile}
            isLoading={isLoading}
            customPrompt={customPrompt}
            onCustomPromptChange={handleCustomPromptChange}
            isEnhanceDisabled={isEnhanceDisabled}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 p-4 md:p-6 bg-background/50 overflow-auto">
            <ImageWorkspace
              onImageUpload={handleImageUpload}
              imageUrl={editedImageUrl}
              isLoading={isLoading}
              error={error}
              statusText={statusText}
              isImageLoaded={!!originalImageUrl}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
