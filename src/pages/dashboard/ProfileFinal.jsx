import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBaseUrl } from '../../utils/baseURL';
import avatarImg from '../../assets/avatar.png'; // Import default avatar

const ProfileFinal = () => {
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    profileImageUrl: '',
    profession: '',
    bio: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profileImageUrl: user.profileImage || '',
        profession: user.profession || '',
        bio: user.bio || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      profileImageUrl: user?.profileImage || '',
      profession: user?.profession || '',
      bio: user?.bio || ''
    });
    setSelectedFile(null);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!user || !user._id) {
        throw new Error('User information is missing. Please log in again.');
      }
      
      // Create form data manually
      const formDataObj = new FormData();
      formDataObj.append('userId', user._id);
      formDataObj.append('username', formData.username);
      formDataObj.append('profession', formData.profession || '');
      formDataObj.append('bio', formData.bio || '');
      
      if (selectedFile) {
        formDataObj.append('profileImage', selectedFile);
      } else if (formData.profileImageUrl) {
        formDataObj.append('profileImageUrl', formData.profileImageUrl);
      }
      
      // Log the FormData contents
      console.log('Submitting profile update:');
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value instanceof File ? 
          `[File: ${value.name}, Size: ${value.size} bytes]` : value);
      }
      
      // Send request directly with fetch
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      const response = await fetch(`${getBaseUrl()}/api/user/edit-profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });
      
      const data = await response.json();
      console.log('Profile update response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      alert('Profile updated successfully!');
      
      // Store updated user in localStorage to ensure it's available on refresh
      if (data.user) {
        const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...currentUserData,
          ...data.user
        }));
      }
      
      // Force reload to show updated data
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">Please log in to view your profile</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left side - Image */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 relative rounded-full overflow-hidden mb-4">
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : 
                  (formData.profileImageUrl || avatarImg)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div 
              onClick={handleFileSelect}
              className="text-blue-600 text-sm font-medium cursor-pointer mb-2"
            >
              Change Profile Picture
            </div>
            
            <div className="text-xs text-center text-gray-500">
              Recommended: Square JPG, PNG<br />
              300x300px or larger
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {/* Right side - Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Profile Image URL (Optional)</label>
                <input
                  type="text"
                  name="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">You can either upload an image or enter a URL</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFinal; 