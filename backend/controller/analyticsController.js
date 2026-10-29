const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");


const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});

        const orders = await Order.find({})

        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenueData
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
}

module.exports = {
    getAdminStats
};