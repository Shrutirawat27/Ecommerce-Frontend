import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';

const Login = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password }).unwrap();

            const { token, refreshToken, user } = response;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            dispatch(setUser({ user }));

            alert("Login successful");
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            setMessage(error?.data?.message || "An error occurred. Try again.");
        }
    };

    return (
        <section className="h-screen flex items-center justify-center">
            <div className="max-w-sm border shadow bg-white mx-auto p-8">
                <h2 className="text-2xl font-semibold pt-5 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <input 
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" placeholder="Email Address" required
                        className="w-full bg-gray-100 px-5 py-3"
                    />
                    <input 
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" placeholder="Password" required
                        className="w-full bg-gray-100 px-5 py-3"
                    />
                    {message && <p className="text-red-500">{message}</p>}
                    <button type="submit"
                        className="w-full bg-primary text-white hover:bg-indigo-500 font-medium py-3 rounded-md"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="my-5 text-sm">Don't have an Account? 
                    <Link to="/register" className="text-red-500 hover:text-red-700 px-1"> Register </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
