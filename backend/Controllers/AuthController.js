import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Registering a new user
export const registerUser = async (req, res) => {
    const { username, email, password, firstname, lastname } = req.body;

    // OWASP A1: Injection - Validate and sanitize all input data
    if (!username || !email || !password || !firstname || !lastname) {
        return res.status(400).json({ message: "กรุณาใส่ทุกช่องให้ครบ" });
    }
    if ([username, email, firstname, lastname].some((v) => typeof v !== 'string' || !v.trim())) {
        return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
    const safeUsername = username.trim();
    const safeEmail = email.trim().toLowerCase();
    const safeFirstname = firstname.trim();
    const safeLastname = lastname.trim();

    try {
        // OWASP A2: Auth failure protection - rate limit / block brute-force ไม่ implement ในตัวอย่างนี้ แต่ต้องใส่ใน production
        const existingUsername = await UserModel.findOne({ username: safeUsername });
        const existingEmail = await UserModel.findOne({ email: safeEmail });
        if (existingUsername || existingEmail) {
            return res.status(400).json({ message: "Username หรือ Email ถูกใช้ไปแล้ว" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            username: safeUsername,
            email: safeEmail,
            password: hashedPass,
            firstname: safeFirstname,
            lastname: safeLastname
        });

        const user = await newUser.save();
        const { password: pass, ...otherDetails } = user._doc;

        // OWASP A3: Sensitive Data Exposure - do not send password in response
        if (!process.env.JWT_KEY) {
            return res.status(500).json({ message: 'JWT_KEY is missing in server configuration' });
        }

        const token = jwt.sign(
            { id: user._id, username: safeUsername, isAdmin: user.isAdmin },
            process.env.JWT_KEY,
            { expiresIn: '2h' }
        );

        res.status(201).json({ user: otherDetails, token });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field} ถูกใช้งานแล้ว` });
        }
        res.status(500).json({ message: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "กรุณาใส่ username/email และ password" });
    }

    try {
        const lookup = username.trim();
        const user = await UserModel.findOne({
            $or: [
                { username: { $regex: new RegExp(`^${lookup}$`, 'i') } },
                { email: lookup.toLowerCase() }
            ]
        });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const validity = await bcrypt.compare(password, user.password);

        if (!validity) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const { password: pass, ...otherDetails } = user._doc;
        if (!process.env.JWT_KEY) {
            return res.status(500).json({ message: 'JWT_KEY is missing in server configuration' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_KEY,
            { expiresIn: '2h' }
        );

        // OWASP A5: Security misconfiguration - should use HTTPS and secure cookie
        res.status(200).json({ user: otherDetails, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// forgot password
export const forgotPassword = async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    try {
        const user = await UserModel.findOne({ username: username.trim() });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // NOTE: in production, send email with URL: `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        res.status(200).json({ message: 'Reset token generated', resetToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// reset password
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });

    try {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};