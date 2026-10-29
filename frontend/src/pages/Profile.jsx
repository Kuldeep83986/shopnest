import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchMyOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders/myorders`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                if (error.response && error.response.status === 401) {
                    logout();
                    navigate('/login');
                }
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, [user, navigate, logout]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="py-6 space-y-8 max-w-4xl mx-auto">
            {/* User Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                    <p className="text-sm text-gray-600"><strong>Name:</strong> {user.name}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {user.email}</p>
                    <p className="text-sm text-gray-600"><strong>Account Type:</strong> <span className="uppercase text-blue-600 font-semibold">{user.role}</span></p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Orders History */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Order History</h3>

                {loading ? (
                    <div className="text-center py-6 text-gray-500 font-medium animate-pulse">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-xl space-y-4">
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
                                <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-3 gap-2">
                                    <div className="text-sm space-y-0.5 text-gray-600">
                                        <p><strong>Order ID:</strong> <span className="font-mono text-gray-800">{order._id}</span></p>
                                        <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Total:</strong> <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span></p>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                            ${order.status === 'Delivered' 
                                                ? 'bg-green-50 border-green-200 text-green-700' 
                                                : order.status === 'Shipped' 
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                                    : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Items list */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Items</h4>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        {order.items && order.items.map((item) => (
                                            <div key={item._id} className="flex justify-between">
                                                <span>{item.productId?.name || "Product"} (x{item.qty})</span>
                                                <span className="font-semibold text-gray-700">₹{(item.price * item.qty).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;