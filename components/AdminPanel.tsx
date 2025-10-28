import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

interface UserImage {
  id: string;
  user_id: string;
  original_image_url: string;
  edited_image_url: string;
  style_used: string;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [selectedTab, setSelectedTab] = useState<'users' | 'images' | 'analytics'>('users');
  const [creditAmount, setCreditAmount] = useState<{ [key: string]: number }>({});
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedProfile, setSearchedProfile] = useState<Profile | null>(null);
  const [addCreditAmount, setAddCreditAmount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
        return;
      }

      if (data) {
        setIsAdmin(true);
        loadAdminData();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      // Load all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profilesError && profilesData) {
        setProfiles(profilesData);
      }

      // Load all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (!rolesError && rolesData) {
        setUserRoles(rolesData);
      }

      // Load all user images
      const { data: imagesData, error: imagesError } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!imagesError && imagesData) {
        setUserImages(imagesData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const updateUserCredits = async (userId: string, newCredits: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (error) {
        alert('Error updating credits: ' + error.message);
      } else {
        alert('Credits updated successfully!');
        loadAdminData();
        setCreditAmount({ ...creditAmount, [userId]: 0 });
      }
    } catch (error) {
      console.error('Error updating credits:', error);
      alert('Error updating credits');
    }
  };

  const searchUserByEmail = async () => {
    if (!searchEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', searchEmail.trim())
        .single();

      if (error || !data) {
        alert('User not found');
        setSearchedProfile(null);
      } else {
        setSearchedProfile(data);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      alert('Error searching user');
    }
  };

  const addCreditsToSearchedUser = async () => {
    if (!searchedProfile || !addCreditAmount || addCreditAmount <= 0) {
      alert('Please enter a valid credit amount');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: searchedProfile.credits + addCreditAmount })
        .eq('id', searchedProfile.id);

      if (error) {
        alert('Error adding credits: ' + error.message);
      } else {
        alert(`Successfully added ${addCreditAmount} credits to ${searchedProfile.email}!`);
        setSearchedProfile({ ...searchedProfile, credits: searchedProfile.credits + addCreditAmount });
        setAddCreditAmount(0);
        loadAdminData();
      }
    } catch (error) {
      console.error('Error adding credits:', error);
      alert('Error adding credits');
    }
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-['Poppins']">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 font-['Playfair_Display']">
              Admin Panel
            </h1>
            <p className="text-gray-400 font-['Poppins']">
              Manage users, credits, and monitor platform activity
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-6 py-3 font-semibold font-['Poppins'] transition-colors border-b-2 ${
                selectedTab === 'users'
                  ? 'text-[#ea580c] border-[#ea580c]'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setSelectedTab('images')}
              className={`px-6 py-3 font-semibold font-['Poppins'] transition-colors border-b-2 ${
                selectedTab === 'images'
                  ? 'text-[#ea580c] border-[#ea580c]'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`px-6 py-3 font-semibold font-['Poppins'] transition-colors border-b-2 ${
                selectedTab === 'analytics'
                  ? 'text-[#ea580c] border-[#ea580c]'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="space-y-6">
              {/* Search User by Email Section */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
                  Add Credits by Email
                </h2>
                <div className="flex gap-3 mb-4">
                  <input
                    type="email"
                    placeholder="Enter user email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white font-['Poppins'] focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    onClick={searchUserByEmail}
                    className="px-6 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded font-['Poppins'] font-semibold transition-colors"
                  >
                    Search
                  </button>
                </div>

                {searchedProfile && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm font-['Poppins']">Email</p>
                        <p className="text-white font-['Poppins']">{searchedProfile.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-['Poppins']">Current Credits</p>
                        <p className="text-white font-['Poppins'] font-semibold">{searchedProfile.credits}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-['Poppins']">Name</p>
                        <p className="text-white font-['Poppins']">{searchedProfile.full_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-['Poppins']">Role</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          getUserRole(searchedProfile.id) === 'admin'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {getUserRole(searchedProfile.id)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Credits to add"
                        value={addCreditAmount || ''}
                        onChange={(e) => setAddCreditAmount(parseInt(e.target.value) || 0)}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white font-['Poppins'] focus:outline-none focus:border-[#ea580c]"
                      />
                      <button
                        onClick={addCreditsToSearchedUser}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-['Poppins'] font-semibold transition-colors"
                      >
                        Add Credits
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* All Users Table */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">
                  User Management
                </h2>
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-['Poppins'] text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-['Poppins'] text-sm">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-['Poppins'] text-sm">Role</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-['Poppins'] text-sm">Credits</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-['Poppins'] text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-4 text-white font-['Poppins'] text-sm">
                          {profile.email}
                        </td>
                        <td className="py-4 px-4 text-gray-300 font-['Poppins'] text-sm">
                          {profile.full_name || '-'}
                        </td>
                        <td className="py-4 px-4 font-['Poppins'] text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getUserRole(profile.id) === 'admin'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {getUserRole(profile.id)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white font-['Poppins'] text-sm font-semibold">
                          {profile.credits}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              placeholder="Amount"
                              value={creditAmount[profile.id] || ''}
                              onChange={(e) => setCreditAmount({
                                ...creditAmount,
                                [profile.id]: parseInt(e.target.value) || 0
                              })}
                              className="w-24 px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white font-['Poppins'] text-sm focus:outline-none focus:border-[#ea580c]"
                            />
                            <button
                              onClick={() => {
                                const amount = creditAmount[profile.id];
                                if (amount && amount > 0) {
                                  updateUserCredits(profile.id, profile.credits + amount);
                                }
                              }}
                              className="px-3 py-1 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-sm font-['Poppins'] transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          )}

          {/* Images Tab */}
          {selectedTab === 'images' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">
                Recent Image Edits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userImages.map((image) => {
                  const userProfile = profiles.find(p => p.id === image.user_id);
                  return (
                    <div key={image.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <img
                        src={image.edited_image_url}
                        alt="Edited"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <div className="space-y-2">
                        <p className="text-white font-['Poppins'] text-sm">
                          <span className="text-gray-400">User:</span> {userProfile?.email}
                        </p>
                        <p className="text-white font-['Poppins'] text-sm">
                          <span className="text-gray-400">Style:</span> {image.style_used}
                        </p>
                        <p className="text-gray-400 font-['Poppins'] text-xs">
                          {new Date(image.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#ea580c] to-[#f97316] rounded-xl p-6 border-2 border-gray-800 shadow-lg">
                  <h3 className="text-white font-['Poppins'] text-sm mb-2 opacity-90">Total Users</h3>
                  <p className="text-4xl font-bold text-white font-['Playfair_Display']">
                    {profiles.length}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border-2 border-gray-800 shadow-lg">
                  <h3 className="text-white font-['Poppins'] text-sm mb-2 opacity-90">Total Images</h3>
                  <p className="text-4xl font-bold text-white font-['Playfair_Display']">
                    {userImages.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border-2 border-gray-800 shadow-lg">
                  <h3 className="text-white font-['Poppins'] text-sm mb-2 opacity-90">Total Credits</h3>
                  <p className="text-4xl font-bold text-white font-['Playfair_Display']">
                    {profiles.reduce((sum, p) => sum + p.credits, 0)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 font-['Playfair_Display']">
                  User Activity Overview
                </h3>
                <div className="space-y-3">
                  {profiles.slice(0, 10).map((profile) => {
                    const imageCount = userImages.filter(img => img.user_id === profile.id).length;
                    return (
                      <div key={profile.id} className="flex justify-between items-center py-3 border-b border-gray-800">
                        <div>
                          <p className="text-white font-['Poppins'] text-sm">{profile.email}</p>
                          <p className="text-gray-400 font-['Poppins'] text-xs">
                            Joined {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-['Poppins'] text-sm font-semibold">
                            {imageCount} images
                          </p>
                          <p className="text-gray-400 font-['Poppins'] text-xs">
                            {profile.credits} credits
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
