import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/product`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="space-y-8 py-6">
            {/* Header Banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center sm:text-left shadow-sm">
                <h1 className="text-3xl font-extrabold text-gray-900">Welcome to ShopNest</h1>
                <p className="text-gray-600 mt-2 max-w-xl">
                    Discover our collection of premium quality products with secure payments and fast delivery.
                </p>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>

                {loading && (
                    <div className="text-center py-12 text-gray-500 font-medium animate-pulse">
                        Loading products...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-200">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {products.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-2xl">
                                No products found. Go to the Admin Dashboard to add products.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;