import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
            <div className="max-w-7xl mx-auto px-4">
                <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;