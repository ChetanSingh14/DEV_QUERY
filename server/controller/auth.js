import users from '../models/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "⚠️ User already exists! Please log in." });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "✅ Signup successful!", result: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "❌ Something went wrong during signup!", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "⚠️ User does not exist! Please sign up." });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "❌ Invalid credentials! Please try again." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "✅ Login successful!", result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "❌ Something went wrong during login!", error: error.message });
    }
};
