import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo / Title */}
                <Link to="/" className="text-xl font-bold text-blue-600 tracking-wide">
                    ShopNest
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    
                    <Link to="/cart" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        Cart 
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)}
                        </span>
                    </Link>

                    {/* Authentication Links */}
                    {user ? (
                        <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                            <Link to="/profile" className="hover:text-blue-600 transition-colors font-semibold text-gray-800">
                                My Account ({user.name})
                            </Link>
                            {user.role === "admin" && (
                                <Link to="/admin" className="text-orange-600 hover:text-orange-700 font-semibold">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                            <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;