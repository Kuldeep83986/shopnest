import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const EditProduct = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/product/${id}`);
                const data = res.data;
                setFormData({ 
                    name: data.name || '', 
                    description: data.description || '', 
                    price: data.price || '', 
                    category: data.category || '', 
                    stock: data.stock || '' 
                });
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Failed to load product details");
                navigate('/admin/products');
            } finally {
                setFetching(false);
            }
        };
        fetchProduct();
    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        if (image) data.append('image', image);

        try {
            const res = await axios.put(`${API_URL}/product/${id}`, data, {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                alert('Product updated successfully!');
                navigate('/admin/products');
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert(error.response?.data?.message || 'Error updating product');
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="max-w-xl mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Edit Product</h1>
                    <p className="text-xs text-gray-500">Update product information or replace image.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200"
                >
                    Back to List
                </button>
            </div>

            {/* Form Card */}
            {fetching ? (
                <div className="text-center py-6 text-gray-500 animate-pulse">Loading product info...</div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Stock</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                            <label className="block text-xs font-semibold text-gray-500 mb-2">Replace Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EditProduct;