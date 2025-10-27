import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { Download, Trash2, Image as ImageIcon } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

interface UserImage {
  id: string;
  edited_image_url: string;
  original_image_url: string;
  style_used: string;
  created_at: string;
}

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, imageId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sparkframe-${imageId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans pt-16">
      <Navbar onNavigate={() => {}} />
      
      <main className="flex-grow py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            My Gallery
          </h1>
          <p className="text-slate-400 text-center mb-12">
            View, download, and manage your edited images
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-20 h-20 text-slate-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-300 mb-2">No images yet</h2>
              <p className="text-slate-400">Start creating amazing images to see them here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div 
                  key={image.id}
                  className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.edited_image_url}
                      alt={`Edited with ${image.style_used}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary capitalize">
                        {image.style_used}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(image.edited_image_url, image.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GalleryPage;