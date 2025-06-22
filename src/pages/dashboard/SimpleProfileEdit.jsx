import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBaseUrl } from '../../utils/baseURL';

const SimpleProfileEdit = () => {
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setProfileImageUrl(user.profileImage || '');
      setProfession(user.profession || '');
      setBio(user.bio || '');
    }
  }, [user]);
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('username', username);
      formData.append('profession', profession);
      formData.append('bio', bio);
      
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      } else if (profileImageUrl) {
        formData.append('profileImageUrl', profileImageUrl);
      }
      
      console.log('Submitting profile update:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${getBaseUrl()}/api/user/edit-profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok) {
        alert('Profile updated successfully!');
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setUsername(user?.username || '');
    setProfileImageUrl(user?.profileImage || '');
    setProfession(user?.profession || '');
    setBio(user?.bio || '');
    setSelectedFile(null);
    setError('');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center">
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : (user?.profileImage || '/user-placeholder.png')}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 mb-4"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-blue-600 text-sm font-medium"
              >
                Change Profile Picture
              </button>
              
              <div className="text-xs text-center text-gray-500 mt-2">
                Recommended: Square JPG, PNG<br />
                300x300px or larger
              </div>
            </div>
            
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Profile Image URL (Optional)</label>
                  <input
                    type="text"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can either upload an image or enter a URL</p>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded mr-3"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileEdit; 