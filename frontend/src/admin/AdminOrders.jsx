import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const AdminOrders = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate]);

    const updateStatus = async (id, status) => {
        try {
            const res = await axios.put(`${API_URL}/orders/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.status === 200) {
                setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
                alert(`Order status updated to ${status}`);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update status");
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
                    <p className="text-xs text-gray-500">Update shipping and delivery states.</p>
                </div>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200"
                >
                    Back to Admin
                </button>
            </div>

            {/* Table container */}
            {loading ? (
                <div className="text-center py-6 text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-gray-500">
                    No orders recorded yet.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total Amount</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-mono text-xs font-semibold text-gray-400">
                                            {order._id}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {order.user?.name || 'Deleted User'}
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">
                                            ₹{order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 px-2.5 py-1.5 focus:outline-none focus:border-blue-600 cursor-pointer"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;