import users from '../models/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (email, id) => {
    return jwt.sign(
        { email, id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

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
        const token = generateToken(newUser.email, newUser._id);

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
        const token = generateToken(existingUser.email, existingUser._id);

        res.status(200).json({ message: "✅ Login successful!", result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "❌ Something went wrong during login!", error: error.message });
    }
};

export const googleAuth = async (req, res) => {
    const { name, email, picture } = req.body;

    try {
        // Check if user already exists
        let existingUser = await users.findOne({ email });

        if (!existingUser) {
            // Create new user if doesn't exist
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 12);

            existingUser = await users.create({
                name,
                email,
                password: hashedPassword,
                picture
            });
        }

        // Generate JWT token
        const token = generateToken(existingUser.email, existingUser._id);

        res.status(200).json({ message: "✅ Google authentication successful!", result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "❌ Something went wrong during Google authentication!", error: error.message });
    }
};
