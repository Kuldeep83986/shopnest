import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/auth/users`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setUsers(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">User Directory</h1>
                    <p className="text-xs text-gray-500">List of all registered ShopNest users.</p>
                </div>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200"
                >
                    Back to Admin
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-6 text-gray-500">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-gray-500">
                    No users registered yet.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                                    <th className="p-4">User ID</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-right">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-mono text-xs font-semibold text-gray-400">
                                            {u._id}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-900">{u.name}</td>
                                        <td className="p-4 text-gray-600">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border
                                                ${u.role === 'admin'
                                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                    : 'bg-green-50 border-green-200 text-green-700'
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-right">
                                            {new Date(u.createdAt).toLocaleDateString()}
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

export default AdminUsers;