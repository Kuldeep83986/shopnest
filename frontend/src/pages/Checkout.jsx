import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { API_URL } from '../config';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        fullName: '', street: '', city: '', postalCode: '', country: ''
    });

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
    const shipping = totalPrice >= 499 ? 0 : 49;
    const grandTotal = totalPrice + shipping;

    const handlePayment = async () => {
        setLoading(true);
        try {
            const orderRes = await fetch(`${API_URL}/payments/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: grandTotal })
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                const fallback = window.confirm("Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?");
                if (fallback) {
                    return bypassPayment();
                } else {
                    setLoading(false);
                    return alert("Payment failed to initialize");
                }
            }

            const options = {
                key: 'rzp_test_dummykey123',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'ShopNest',
                description: 'Test Transaction',
                order_id: orderData.id,
                handler: async function (response) {
                    const verifyRes = await fetch(`${API_URL}/payments/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response)
                    });
                    if (verifyRes.ok) {
                        const saveOrderRes = await fetch(`${API_URL}/orders`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${user.token}`
                            },
                            body: JSON.stringify({
                                items: cartItems.map(item => ({
                                    productId: item._id,
                                    qty: item.qty || 1,
                                    price: item.price
                                })),
                                totalAmount: grandTotal,
                                address,
                                paymentId: response.razorpay_payment_id
                            })
                        });
                        if (saveOrderRes.ok) {
                            alert('Payment successful! Order placed.');
                            dispatch(clearCart());
                            navigate('/ordersuccess');
                        } else {
                            alert('Order saving failed');
                        }
                    } else {
                        alert('Payment verification failed');
                    }
                    setLoading(false);
                },
                prefill: {
                    name: address.fullName,
                    email: user?.email,
                    contact: '9999999999'
                },
                theme: { color: '#2563eb' }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const bypassPayment = async () => {
        try {
            const saveOrderRes = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item._id,
                        qty: item.qty || 1,
                        price: item.price
                    })),
                    totalAmount: grandTotal,
                    address,
                    paymentId: 'bypass_txn_' + Date.now()
                })
            });
            if (saveOrderRes.ok) {
                alert('Payment successful! Order placed in Student Bypass Mode.');
                dispatch(clearCart());
                navigate('/ordersuccess');
            } else {
                const errData = await saveOrderRes.json();
                alert(`Order placement failed: ${errData.message || 'Server error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first");
            navigate('/login');
            return;
        }
        handlePayment();
    };

    if (cartItems.length === 0) {
        return (
            <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <p className="text-gray-500">Your cart is empty. Add items to checkout.</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping address form */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Shipping Address</h3>
                    <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={address.fullName}
                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Street Address</label>
                            <input
                                type="text"
                                required
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                placeholder="123 Main St"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    placeholder="New Delhi"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    required
                                    value={address.postalCode}
                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                    placeholder="110001"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Country</label>
                            <input
                                type="text"
                                required
                                value={address.country}
                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                placeholder="India"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </form>
                </div>

                {/* Summary Panel */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit space-y-4 shadow-sm">
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Order Summary</h3>

                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 pr-1">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between items-center py-2 text-xs text-gray-600">
                                <span>{item.name} (x{item.qty})</span>
                                <span className="font-bold text-gray-800">₹{(item.price * (item.qty || 1)).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                            <span>Total</span>
                            <span>₹{grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm"
                    >
                        {loading ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;