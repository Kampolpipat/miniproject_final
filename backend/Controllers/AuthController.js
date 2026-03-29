import UserModel from "../Models/userModel.js";    
import bcrypt from 'bcrypt';

// Registering a new user
export const registerUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    try {
        // เช็กก่อนว่ามี username นี้ในระบบหรือยัง
        const oldUser = await UserModel.findOne({ username });
        if (oldUser) {
            return res.status(400).json({ message: "Username is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            username,
            password: hashedPass,
            firstname,
            lastname
        });

        const user = await newUser.save();
        
        // ไม่ส่ง password กลับไป
        const { password: pass, ...otherDetails } = user._doc;
        res.status(200).json(otherDetails);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username });
        
        if (user) {
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json("Wrong password");
            } else {
                const { password: pass, ...otherDetails } = user._doc;
                res.status(200).json(otherDetails);
            }
        } else {
            res.status(404).json("User does not exist");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};