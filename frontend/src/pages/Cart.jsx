import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart, clearCart } from '../redux/cartSlice';

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleUpdateQty = (item, qty) => {
        if (qty > 0) {
            dispatch(addToCart({ ...item, qty }));
        }
    };

    const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
                    <p className="text-sm text-gray-500 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
                </div>
                {cartItems.length > 0 && (
                    <button
                        onClick={() => dispatch(clearCart())}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl space-y-4">
                    <p className="text-gray-500">Your cart is currently empty.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                                {/* Thumbnail */}
                                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-gray-100 flex-shrink-0">
                                    <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                        <button
                                            onClick={() => handleRemove(item._id)}
                                            className="text-gray-400 hover:text-red-500 text-sm font-bold pl-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>

                                    <div className="flex justify-between items-center mt-3">
                                        {/* Qty edit buttons */}
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => item.qty > 1 ? handleUpdateQty(item, item.qty - 1) : handleRemove(item._id)}
                                                className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="px-3 text-sm font-bold text-gray-800">{item.qty || 1}</span>
                                            <button
                                                onClick={() => handleUpdateQty(item, (item.qty || 1) + 1)}
                                                className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span className="text-sm font-bold text-gray-900">
                                            ₹{(item.price * (item.qty || 1)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit space-y-4 shadow-sm">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Order Summary</h3>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className={totalPrice >= 499 ? 'text-green-600 font-semibold' : ''}>
                                    {totalPrice >= 499 ? 'Free' : '₹49'}
                                </span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                                <span>Total</span>
                                <span>₹{(totalPrice + (totalPrice >= 499 ? 0 : 49)).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;