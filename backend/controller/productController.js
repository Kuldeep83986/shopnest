const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");


// desc   GET all products
// route  GET /api/product
// access Private/Public


const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
};

// desc create a new product
// route POST /api/product
// access Private/Admin

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = "";
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            imageUrl = uploadResult.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
};

// desc GET product by id
// route GET /api/product/:id
// access Private/Public

const getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
};

// desc UPDATE a product
// route PUT /api/product/:id
// access Private/Admin

const updateProducts = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (req.file) {
                const uploadResult = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = uploadResult.secure_url;
            }
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);

        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
};

// desc DELETE a product
// route DELETE /api/product/:id
// access Private/Admin

const deleteProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.status(200).json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
};

module.exports = { getProducts, createProduct, getProductsById, updateProducts, deleteProducts };