import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import logo from '../src/assets/logo.png';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

interface ProfileData {
  credits: number;
  avatar_url: string | null;
  full_name: string | null;
  plan: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time updates for profile changes (credits & plan)
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          setProfile(payload.new as ProfileData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits, avatar_url, full_name, plan')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate there first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
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
            <img src={logo} alt="SparkFrameAI" className="h-12 sm:h-16 w-auto group-hover:scale-105 transition-transform duration-300" />
          </a>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <button 
              onClick={() => window.location.href = '/gallery'}
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
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Contact
            </button>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#ea580c]/20 to-[#f97316]/20 border border-[#ea580c]/50 text-white px-4 py-2 rounded-lg hover:from-[#ea580c]/30 hover:to-[#f97316]/30 transition-all duration-300 font-['Poppins'] font-semibold"
                >
                  {/* Credits Display */}
                  <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 text-[#ea580c]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white font-bold text-sm">
                      {profile?.credits || 0}
                    </span>
                  </div>

                  {/* Plan Badge */}
                  {profile?.plan && (
                    <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {profile.plan}
                    </span>
                  )}

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Dropdown Arrow */}
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <p className="text-white font-semibold font-['Poppins'] mb-1">
                        {profile?.full_name || user.email}
                      </p>
                      <p className="text-gray-400 text-sm font-['Poppins']">{user.email}</p>
                    </div>
                    
                    <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-[#ea580c]/10 to-[#f97316]/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-['Poppins']">Credits</span>
                        <span className="text-[#ea580c] font-bold text-lg font-['Playfair_Display']">
                          {profile?.credits || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#ea580c] to-[#f97316] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((profile?.credits || 0) / 10 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        scrollToSection('packages');
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors font-['Poppins'] flex items-center gap-2"
                    >
                      <svg className="w-5 h-5 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Plans
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors font-['Poppins'] flex items-center gap-2 border-t border-gray-700"
                    >
                      <svg className="w-5 h-5 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/auth"
                  className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Sign In
                </a>
                <a
                  href="/auth"
                  className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-md hover:from-[#c2410c] hover:to-[#ea580c] transition-all duration-300 text-sm font-medium font-['Poppins'] transform hover:scale-105 shadow-lg hover:shadow-[#ea580c]/50"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 text-white text-xs bg-black/50 px-2 py-1 rounded-full border border-gray-700">
                <svg className="w-3 h-3 text-[#ea580c]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">{profile?.credits || 0}</span>
              </div>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black/98">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => {
                  window.location.href = '/gallery';
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 font-['Poppins']"
              >
                Gallery
              </button>
              <button 
                onClick={() => {
                  scrollToSection('packages');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 font-['Poppins']"
              >
                Packages
              </button>
              <button 
                onClick={() => {
                  scrollToSection('contact');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 font-['Poppins']"
              >
                Contact
              </button>
              
              {user ? (
                <>
                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold">
                            {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold font-['Poppins'] text-sm">
                          {profile?.full_name || user.email}
                        </p>
                        {profile?.plan && (
                          <span className="text-[#ea580c] text-xs font-bold">{profile.plan}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        scrollToSection('packages');
                      }}
                      className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 font-['Poppins']"
                    >
                      View Plans
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 font-['Poppins']"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <a
                    href="/auth"
                    className="block text-center text-gray-300 hover:text-white transition-colors py-2 font-['Poppins']"
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth"
                    className="block text-center bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-md hover:from-[#c2410c] hover:to-[#ea580c] transition-all duration-300 font-['Poppins']"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;