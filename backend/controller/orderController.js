const Order = require("../model/Order");
const { sendEmail } = require("../utils/sendEmail");


const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !address || !totalAmount) {
            res.status(400).json({ message: "All fields are required" })
        } else {
            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId,
            });

            const savedOrder = await order.save();
            const message = `Dear ${req.user.name}, your order has been placed successfully`;
            await sendEmail(req.user.email, "order placed", message);
            res.status(201).json(savedOrder);
        }
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }

}


const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.productId", "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
}


const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
}


const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            res.status(404).json({ message: "order not found" });
        } else {
            order.status = status;
            await order.save();
            res.status(200).json(order);
        }
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
}

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };