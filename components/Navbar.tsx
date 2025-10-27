import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import logo from '../src/assets/logo.png';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 fixed w-full top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center cursor-pointer group">
            <img src={logo} alt="SparkFrameAI" className="h-8 w-auto group-hover:scale-105 transition-transform duration-300" />
          </a>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('packages')}
              className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Packages
            </button>
            {user ? (
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-md hover:from-[#c2410c] hover:to-[#ea580c] transition-all duration-300 text-sm font-medium font-['Poppins'] transform hover:scale-105 shadow-lg hover:shadow-[#ea580c]/50"
              >
                Logout
              </button>
            ) : (
              <>
                <a
                  href="/auth"
                  className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Sign In
                </a>
                <button 
                  onClick={() => onNavigate?.('editor')}
                  className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-md hover:from-[#c2410c] hover:to-[#ea580c] transition-all duration-300 text-sm font-medium font-['Poppins'] transform hover:scale-105 shadow-lg hover:shadow-[#ea580c]/50"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;