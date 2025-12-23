import { FiEye, FiEyeOff } from 'react-icons/fi';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';
import { clearOrders } from '../redux/features/products/productsSlice';
import { fetchCart } from '../redux/features/cart/cartSlice';

const Login = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        dispatch(clearOrders());

        try {
            const response = await loginUser({ email, password }).unwrap();
            const token = response.token || response.accessToken; 
            const refreshToken = response.refreshToken;
            const user = response.user;

            if (!token) {
                setMessage("Login failed: no token returned from server.");
                return;
            }

            localStorage.setItem('token', token);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            dispatch(setUser({ user, token }));  
            await dispatch(fetchCart()).unwrap();
            alert("Login successful");
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            setMessage(error?.data?.message || "An error occurred. Try again.");
        }
    };

    return (
        <section className="h-screen w-full flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm border shadow-lg bg-white p-8 flex-shrink-0">
                <h2 className="text-2xl font-semibold pt-5 text-center">Login</h2>
                
                <form onSubmit={handleLogin} className="space-y-5 mt-6">
                    <div>
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            placeholder="Email Address" 
                            required
                            className="w-full bg-gray-100 px-5 py-3 focus:outline-none border border-transparent focus:border-primary transition-all"/>
                    </div>

                    <div className="relative w-full">
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            required
                            className="w-full bg-gray-100 px-5 py-3 focus:outline-none border border-transparent focus:border-primary transition-all"/>
                        
                        <div 
                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-primary transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </div>
                    </div>

                    {message && <p className="text-red-500 text-sm">{message}</p>}

                    <button type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white hover:bg-indigo-600 font-medium py-3 rounded-md transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <p className="my-5 text-sm text-center">
                    Don't have an Account? 
                    <Link to="/register" className="text-red-500 hover:text-red-700 px-1 font-medium"> Register </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;