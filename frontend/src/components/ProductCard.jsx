import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({ ...product, qty: 1 }));
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            {/* Product Content */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase">{product.category}</span>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                            to={`/product/${product._id}`}
                            className="text-center bg-gray-100 text-gray-700 text-xs font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Details
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;