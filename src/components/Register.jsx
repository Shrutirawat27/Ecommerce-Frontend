import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/features/auth/authApi';

const Register = () => {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [showAdminOption, setShowAdminOption] = useState(false);

    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const navigate = useNavigate();

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic input validation
        if (!username || !email || !password) {
            setMessage("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        let data = { username, email, password };
        
        // If trying to register as admin, add the admin code
        if (showAdminOption && adminCode) {
            // The admin code is 'admin123' - this should be a secret
            if (adminCode === 'admin123') {
                data.role = 'admin';
                data.adminCode = adminCode;
            } else {
                setMessage("Invalid admin code");
                return;
            }
        }

        try {
            const response = await registerUser(data).unwrap();
            console.log('Registration successful:', response);

            alert("Registration successful!");
            navigate("/login"); // Redirect to login page after success
        } catch (error) {
            console.error("Registration error:", error);
            
            // More detailed error handling
            if (error.status === 400) {
                setMessage("Email already in use or invalid details.");
            } 
             else {
                setMessage(error.data?.message || "Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>
                
                {message && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long.</p>
                    </div>
                    
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showAdminOption}
                                onChange={() => setShowAdminOption(!showAdminOption)}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Register as Admin</span>
                        </label>
                    </div>
                    
                    {showAdminOption && (
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Admin Code</label>
                            <input
                                type="password"
                                value={adminCode}
                                onChange={(e) => setAdminCode(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                
                <div className="mt-4 text-center">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
