import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/src/App.css';
import { useDispatch, useSelector } from 'react-redux';
import CartModal from '../pages/shop/CartModal';
import avatarImg from '../assets/avatar.png';
import { FiSearch } from "react-icons/fi";
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';
    const handleDropDownToggle = () => {
        setIsDropDownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropDownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    const userDropDownMenus = [
        { label: "MY PROFILE", path: "/dashboard/profile" },
        { label: "ORDERS", path: "/dashboard/order" },
    ];
    
    // Define a standard size for all icons/avatars to ensure consistent alignment
    const ICON_SIZE_CLASS = "h-7 w-7"; 

    return (
        <header className="fixed w-full bg-white shadow-sm py-3 border-b border-gray-100 z-50">
            <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img src="/Logo.png" alt="Logo" className="h-12 w-auto" />
                </Link>

                {/* Nav Links */}
                <div className={`hidden lg:flex flex-1 px-4 ${isAdmin ? 'justify-center' : 'justify-evenly'}`}>
                    <ul className={`flex items-center gap-6`}>
                        <li><Link to="/" className="font-medium text-gray-800 hover:text-primary">HOME</Link></li>
                        <li><Link to="/shop" className="font-medium text-gray-800 hover:text-primary">SHOP</Link></li>
                        {isAdmin && (
                            <>
                                <li><Link to="/list-items" className="font-medium text-gray-800 hover:text-primary">LIST ITEMS</Link></li>
                                <li><Link to="/orders-admin" className="font-medium text-gray-800 hover:text-primary">ORDERS</Link></li>
                                <li><Link to="/add" className="font-medium text-gray-800 hover:text-primary">ADD NEW</Link></li>
                            </>
                        )}
                        <li><Link to="/about" className="font-medium text-gray-800 hover:text-primary">ABOUT</Link></li>
                        <li><Link to="/contact" className="font-medium text-gray-800 hover:text-primary">CONTACT</Link></li>
                    </ul>
                </div>

                {/* Icons - ADDED 'gap-5' for slight spacing adjustment for better look */}
                <div className="flex items-center space-x-6">
                    {/* Search Icon */}
                    <Link to="/search">
                        {/* FiSearch is an SVG/Icon, setting the size via text-2xl is fine, but h/w ensures consistency */}
                        <FiSearch className={`${ICON_SIZE_CLASS} text-gray-800 hover:scale-110 transition-transform`} />
                    </Link>

                    {/* Cart Icon */}
                    <div className="relative">
                        <button onClick={() => setIsCartOpen(!isCartOpen)} className="flex items-center">
                            {/* Standardized size: h-7 w-7 */}
                            <img src="/shopping-bag.png" alt="Cart" className={`${ICON_SIZE_CLASS} hover:scale-110 transition-transform`} />
                            {products.length > 0 && (
                                <span className="absolute -top-2 -right-2 h-5 w-5 text-xs text-white font-bold bg-primary rounded-full flex items-center justify-center">
                                    {products.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* User Avatar/Login Icon */}
                    <div ref={dropdownRef} className="relative">
                        {user ? (
                            <>
                                <button onClick={handleDropDownToggle} className="flex items-center">
                                    <img
                                        src={user?.profileImage || avatarImg}
                                        alt="User"
                                        // Standardized size (h-7 w-7) for alignment, rounded for avatar style
                                        className={`h-8 w-8 rounded-full object-cover border hover:scale-105 transition-transform`}
                                    />
                                </button>
                                {isDropDownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md py-1 z-50 border">
                                        {!isAdmin && userDropDownMenus.map((menu, index) => (
                                            <Link
                                                key={index}
                                                to={menu.path}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDropDownOpen(false)}
                                            >
                                                {menu.label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className="flex items-center">
                                {/* Standardized size: h-7 w-7 */}
                                <img src="/profile.png" alt="Login" className={`${ICON_SIZE_CLASS} hover:scale-110 transition-transform`} />
                            </Link>
                        )}
                    </div>

                    {/* Hamburger Button - mobile only */}
                    <button
                        className="lg:hidden text-gray-800"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {/* Standardize SVG size to match ICON_SIZE_CLASS or h-6 w-6 */}
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12" />
                            </svg>
                               ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Links (Remaining the same) */}
            {isMobileMenuOpen && (
                <div className="lg:hidden px-4 mt-2 pb-3 bg-white shadow-sm border-t">
                    <ul className="flex flex-col gap-3">
                        <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link></li>
                        <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link></li>
                        {isAdmin && (
                            <>
                                <li><Link to="/list-items" onClick={() => setIsMobileMenuOpen(false)}>LIST ITEMS</Link></li>
                                <li><Link to="/orders-admin" onClick={() => setIsMobileMenuOpen(false)}>ORDERS</Link></li>
                                <li><Link to="/add" onClick={() => setIsMobileMenuOpen(false)}>ADD NEW</Link></li>
                            </>
                        )}
                        <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link></li>
                        <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link></li>
                        {!isAdmin && user && userDropDownMenus.map((menu, i) => (
                            <li key={i}><Link to={menu.path} onClick={() => setIsMobileMenuOpen(false)}>{menu.label}</Link></li>
                        ))}
                        {user ? (
                            <li><button onClick={handleLogout} className="text-left w-full">LOGOUT</button></li>
                        ) : (
                            <li><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>LOGIN</Link></li>
                        )}
                    </ul>
                </div>
            )}

            {/* Cart Modal */}
            {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
        </header>
    );
};

export default Navbar;