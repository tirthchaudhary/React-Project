import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../model/user.js";
import Resume from "../model/resume.js";
import sendEmail from '../utils/sendEmail.js';

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

// controller for user registration
// POST:/api/users/register

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing require fields" });
        }

        // check if user already exist
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        //create a new user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        // return success message
        const token = generateToken(newUser._id);


        return res.status(201).json({ message: "User created successfully", token, user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// controller for user login
// POST: /api/users/login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing require field" });
        }

        // check if user is already loggedIn?

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        if (!(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // return success message;
        const token = generateToken(user._id);


        return res.status(201).json({ message: "Login successfully", token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// controller for getting user by id
// GET: /api/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        // check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// controller for getting user resumes
// GET: /api/users/resume

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({ userId });
        return res.status(200).json({ resumes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// controller for the forgot password functionality

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please enter your email" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        
        // send email with otp
        await sendEmail({ to: email, subject: "Reset Password", text: `Your OTP is ${otp}` });
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: error.message || "Failed to send email" });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Missing require field" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.resetOTPExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOTP = '';
        user.resetOTPExpires = 0;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: error.message || "Failed to reset password" });
    }
}