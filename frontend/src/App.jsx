import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';

// Admin pages
import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import EditProduct from './admin/EditProduct';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <Navbar />
        <div className="flex-1 max-w-7xl w-full mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ordersuccess" element={<OrderSuccess />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
