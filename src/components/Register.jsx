import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/features/auth/authApi';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setMessage("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await registerUser({ username, email, password }).unwrap();
            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            if (error.status === 400) {
                setMessage("Email already in use or invalid details.");
            } else {
                setMessage(error.data?.message || "Registration failed. Please try again.");
            }
        }
    };

    return (
        <section className="h-screen w-full flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm border shadow-lg bg-white mx-auto p-8 flex-shrink-0">
                <h2 className="text-2xl font-semibold pt-5 text-center">Register</h2>
                
                <form onSubmit={handleRegister} className="space-y-5 mt-6">
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Username"
                        required
                        className="w-full bg-gray-100 px-5 py-3 focus:outline-none border border-transparent focus:border-primary transition-all"
                    />
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full bg-gray-100 px-5 py-3 focus:outline-none border border-transparent focus:border-primary transition-all"
                    />
                    
                    <div className="relative w-full">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            className="w-full bg-gray-100 px-5 py-3 focus:outline-none border border-transparent focus:border-primary transition-all"
                        />

                        <div 
                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-primary transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </div>
                    </div>

                    {message && <p className="text-red-500 text-sm">{message}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white hover:bg-indigo-600 font-medium py-3 rounded-md transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="my-5 text-sm text-center">
                    Already have an Account?
                    <Link to="/login" className="text-red-500 hover:text-red-700 px-1 font-medium">Login</Link>
                </p>
            </div>
        </section>
    );
};

export default Register;