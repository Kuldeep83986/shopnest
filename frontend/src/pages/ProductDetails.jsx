import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import { API_URL } from "../config";

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/product/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: 1 }));
        alert(`${product.name} added to cart!`);
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500 font-medium animate-pulse">Loading product details...</div>;
    }

    if (error || !product) {
        return (
            <div className="text-center py-12 space-y-4">
                <p className="text-red-500 font-semibold">{error || "Product not found"}</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
                <Link to="/" className="hover:underline">Home</Link> &gt; <span className="text-gray-800 font-medium">{product.name}</span>
            </div>

            {/* Product card container */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
                {/* Left - Image */}
                <div className="bg-gray-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-80 object-contain"
                    />
                </div>

                {/* Right - Product Details */}
                <div className="p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded">
                                {product.category}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.name}</h1>
                        </div>

                        <div>
                            <span className="text-3xl font-extrabold text-gray-900">₹{product.price?.toLocaleString()}</span>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-sm font-semibold text-gray-700">
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
