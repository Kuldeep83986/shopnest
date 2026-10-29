import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="py-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Order Success!</h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Thank you! Your order has been successfully placed. You can view details in your profile page.
                </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
                <Link to="/profile" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">
                    View Orders
                </Link>
                <Link to="/" className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
