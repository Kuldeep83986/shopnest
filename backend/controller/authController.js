const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const message = `Welcome to shopnest ${name}, Your otp for shopnest is ${otp} Do not share it with anyone.`

            await sendEmail(email, "welcome to shopnest", message);
            res.status(201).json(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            )
        } else {
            res.status(400).json({ message: "Failed to create user" });
        }
    } catch (error) {
        res.status(500).json({ message: "error in server side" });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "invalid email or password" })
        }

    } catch (error) {
        res.status(500).json({ message: "error in server side" })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "error in server side" })
    }
}

module.exports = { registerUser, loginUser, getUsers }