import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageWorkspace from './components/ImageWorkspace';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import { editImageWithAI } from './services/imageEditService';
import { STYLE_OPTIONS } from './constants';
import { supabase } from './src/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_OPTIONS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Upload an image to get started.');
  const [isWorkspace, setIsWorkspace] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check authentication and fetch credits
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCredits(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchCredits(session.user.id);
        }, 0);
      } else {
        setCredits(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time updates for credits when profile changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-credits-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔄 Real-time credits update:', payload);
          if (payload.new && 'credits' in payload.new) {
            setCredits((payload.new as any).credits);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setCredits(data.credits);
    }
  };

  const handleImageUpload = (file: File) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      setError('Please create an account first');
      return;
    }

    setOriginalImageFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setEditedImageUrl(url);
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

    // Check if user has enough credits
    if (credits < 5) {
      setError('Free credits finished, please upgrade your plan.');
      return;
    }

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
      
      // Refresh credits after successful enhancement
      if (user) {
        await fetchCredits(user.id);
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while enhancing the image.';
      setError(errorMessage);
      setStatusText('Enhancement failed. Please try again.');
      
      // Show user-friendly error messages
      if (errorMessage.includes('Insufficient credits')) {
        setError('Free credits finished, please upgrade your plan.');
      } else if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else if (errorMessage.includes('logged in')) {
        setError('Please create an account first');
        setShowAuthModal(true);
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

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleGoToSignup = () => {
    navigate('/auth');
  };

  if (!isWorkspace) {
    return <HomePage onEnterEditor={handleEnterEditor} />;
  }

  const isEnhanceDisabled = !originalImageFile || isLoading || (selectedStyle === 'custom' && !customPrompt.trim()) || credits < 5;

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white font-sans">
      <Navbar />
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Account Required</h2>
            <p className="text-gray-300 mb-6">
              Please create an account first to start editing images. You'll get 10 free credits (2 images) when you sign up!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGoToSignup}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={handleCloseAuthModal}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 bg-gray-900 overflow-auto">
        {/* Credits Display */}
        {user && (
          <div className="mb-4 flex justify-end">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <span className="text-gray-400 text-sm">Credits: </span>
              <span className={`font-bold text-lg ${credits < 5 ? 'text-red-500' : 'text-orange-500'}`}>
                {credits}
              </span>
              <span className="text-gray-500 text-xs ml-2">({Math.floor(credits / 5)} images left)</span>
            </div>
          </div>
        )}
        
        <ImageWorkspace
          onImageUpload={handleImageUpload}
          imageUrl={editedImageUrl}
          isLoading={isLoading}
          error={error}
          statusText={statusText}
          isImageLoaded={!!originalImageUrl}
          selectedStyle={selectedStyle}
          onStyleChange={handleStyleChange}
          onEnhance={handleEnhance}
          onReset={handleReset}
          onDownload={handleDownload}
          customPrompt={customPrompt}
          onCustomPromptChange={handleCustomPromptChange}
          isEnhanceDisabled={isEnhanceDisabled}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
