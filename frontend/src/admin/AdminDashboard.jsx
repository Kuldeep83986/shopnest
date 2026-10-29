import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/analytics`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="py-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}. Overview of ShopNest statistics.</p>
            </div>

            {/* Metrics cards */}
            {loading ? (
                <div className="text-center py-6 text-gray-500">Loading dashboard metrics...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase">Total Revenue</h4>
                        <p className="text-2xl font-bold text-green-600 mt-2">₹{stats?.totalRevenue?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase">Total Orders</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats?.totalOrders}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase">Total Products</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats?.totalProducts}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase">Total Users</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{stats?.totalUsers}</p>
                    </div>
                </div>
            )}

            {/* Admin actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">Administrative Tasks</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/admin/add-product')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        + Add Product
                    </button>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        📦 Manage Products
                    </button>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        🚚 Manage Orders
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        👥 User Directory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;