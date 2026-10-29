import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const AdminProducts = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/product`);
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you strictly sure you want to delete this product?')) {
            try {
                const res = await axios.delete(`${API_URL}/product/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.status === 200) {
                    setProducts(products.filter(p => p._id !== id));
                    alert('Product deleted successfully');
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert('Failed to delete product');
            }
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Manage Products</h1>
                    <p className="text-xs text-gray-500">Edit or delete catalog items.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/add-product"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                        + Add Product
                    </Link>
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200"
                    >
                        Back to Admin
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-6 text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-gray-500">
                    No products added yet.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                                    <th className="p-4">Thumbnail</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-0.5 border border-gray-100">
                                                <img src={p.imageUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                                        <td className="p-4 font-bold text-gray-900">₹{p.price?.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">{p.stock}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link
                                                to={`/admin/edit-product/${p._id}`}
                                                className="inline-block bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-blue-100"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-100"
                                            >
                                                Delete
                                            </button>
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

export default AdminProducts;