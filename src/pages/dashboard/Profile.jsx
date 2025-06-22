import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import avatarImg from '../../assets/avatar.png';
import { useEditProfileMutation } from '../../redux/features/auth/authApi';
import { setUser } from '../../redux/features/auth/authSlice';
import { getBaseUrl } from '../../utils/baseURL';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editProfile] = useEditProfileMutation();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    profileImage: user?.profileImage || '',
    profession: user?.profession || '',
    bio: user?.bio || ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profileImage: user.profileImage || '',
        profession: user.profession || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
      // Create a simple FormData object
      const updateData = new FormData();
      updateData.append('userId', user._id);
      updateData.append('username', formData.username);
      updateData.append('profession', formData.profession);
      updateData.append('bio', formData.bio);
      
      if (selectedFile) {
        updateData.append('profileImage', selectedFile);
      } else if (formData.profileImage) {
        updateData.append('profileImageUrl', formData.profileImage);
      }

      // Log all form data entries
      console.log('Submitting profile update:');
      for (let pair of updateData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? 
          `[File: ${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes]` : 
          pair[1]);
      }
      
      // Use direct fetch instead of RTK Query for debugging
      const token = localStorage.getItem('token');
      const response = await fetch(`${getBaseUrl()}/api/user/edit-profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: updateData
      });
      
      const data = await response.json();
      console.log('Profile update response:', data);
      
      if (response.ok && data.user) {
        dispatch(setUser({ user: data.user }));
        alert('Profile updated successfully!');
        window.location.reload(); // Force reload to show updated image
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <img 
              src={selectedFile ? URL.createObjectURL(selectedFile) : (user?.profileImage || avatarImg)} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover"
            />
            
            <button 
              type="button"
              onClick={triggerFileInput}
              className="mt-4 text-blue-600 text-sm font-medium"
            >
              Change Profile Picture
            </button>
            
            <div className="text-xs text-center text-gray-500 mt-2">
              Recommended: Square JPG, PNG<br />
              300x300px or larger
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Profile Image URL (Optional)</label>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
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
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded mr-3"
                  onClick={() => {
                    setSelectedFile(null);
                    // Reset form data to original user values
                    setFormData({
                      username: user?.username || '',
                      profileImage: user?.profileImage || '',
                      profession: user?.profession || '',
                      bio: user?.bio || ''
                    });
                    setError('');
                  }}
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
  );
};

export default Profile; 