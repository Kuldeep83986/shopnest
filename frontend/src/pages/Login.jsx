import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../config";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });
            login(response.data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                    <h1 className="text-xl font-bold text-gray-800">Login to ShopNest</h1>
                    <p className="text-xs text-gray-500">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors text-sm"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
