import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/src/App.css';
import { useDispatch, useSelector } from 'react-redux';
import CartModal from '../pages/shop/CartModal';
import avatarImg from '../assets/avatar.png';
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    // Dropdown state
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for dropdown container

    const handleDropDownToggle = () => {
        setIsDropDownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropDownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // User dropdown menus
    const userDropDownMenus = [
        { label: "My Profile", path: "/dashboard/profile" },
        { label: "Orders", path: "/dashboard/order" },
    ];

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };
    
    // Determine if user is admin to apply different spacing
    const isAdmin = user?.role === 'admin';

    return (
        <header className="fixed-nav-bar w-full bg-white shadow-sm py-3 border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <div className="nav__logo">
                    <Link to="/">
                        <img src="/Logo.png" alt="Logo" className="h-12 w-auto" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className={`flex ${isAdmin ? 'justify-center' : 'justify-evenly'} flex-1 px-4`}>
                    <ul className={`flex items-center ${isAdmin ? 'space-x-8' : 'w-full justify-evenly'}`}>
                        <li className="nav-item">
                            <Link to="/" className="font-medium text-gray-800 hover:text-primary transition-colors">HOME</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/shop" className="font-medium text-gray-800 hover:text-primary transition-colors">SHOP</Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link to="/list-items" className="font-medium text-gray-800 hover:text-primary transition-colors">LIST ITEMS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/orders-admin" className="font-medium text-gray-800 hover:text-primary transition-colors">ORDERS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/add" className="font-medium text-gray-800 hover:text-primary transition-colors">ADD NEW</Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <Link to="/about" className="font-medium text-gray-800 hover:text-primary transition-colors">ABOUT</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="font-medium text-gray-800 hover:text-primary transition-colors">CONTACT</Link>
                        </li>
                    </ul>
                </div>

                {/* Icons Section */}
                <div className="flex items-center space-x-6">
                    {/* Search Icon */}
                    <Link to="/search" className="nav-icon">
                        <img src="/search-b.png" alt="Search" className="h-5 w-5 transform hover:scale-110 transition-transform" />
                    </Link>

                    {/* Shopping Cart */}
                    <div className="relative">
                        <button onClick={() => setIsCartOpen(!isCartOpen)} className="nav-icon">
                            <img src="/shopping-bag.png" alt="Shopping Cart" className="h-6 w-6 transform hover:scale-110 transition-transform" />
                            {products.length > 0 && (
                                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-primary rounded-full">
                                    {products.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* User Profile & Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        {user ? (
                            <>
                                <button onClick={handleDropDownToggle} className="flex items-center">
                                    <img
                                        src={user?.profileImage || avatarImg}
                                        alt="User Profile"
                                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                    />
                                </button>

                                {isDropDownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                        {user?.role !== 'admin' && userDropDownMenus.map((menu, index) => (
                                            <Link
                                                key={index}
                                                onClick={() => setIsDropDownOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                to={menu.path}
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
                            <Link to="/login" className="nav-icon">
                                <img src="/profile.png" alt="Profile" className="h-6 w-6 transform hover:scale-110 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Shopping Cart Modal */}
            {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
        </header>
    );
};

export default Navbar;
