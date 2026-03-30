import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (image) => {
  if (!image) return image;
  if (typeof image !== 'string' || !image.startsWith('data:')) return image; // already URL

  const { secure_url } = await cloudinary.uploader.upload(image, {
    folder: 'social_app_profiles',
    overwrite: true,
  });
  return secure_url;
};

// get a User
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (user) 
            {

                const { password, ...otherDetails } = user._doc; // แยก password ออกจากข้อมูลผู้ใช้
                res.status(200).json(otherDetails); // ส่งข้อมูลผู้ใช้ที่ไม่รวม password กลับไปยัง client
            }
            else {
                res.status(404).json({ message: "User not found" }); // ส่งข้อความว่าไม่พบผู้ใช้หากไม่มีข้อมูลในฐานข้อมูล
            }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get follower list
export const getFollowers = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const followers = await UserModel.find({ _id: { $in: user.followers } }).select('username firstname lastname profilePicture');
        res.status(200).json({ followers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get following list
export const getFollowing = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const following = await UserModel.find({ _id: { $in: user.following } }).select('username firstname lastname profilePicture');
        res.status(200).json({ following });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update a User
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const requesterId = req.user?.id;
    const requesterAdmin = req.user?.isAdmin;

    if (!requesterId || (id !== requesterId && !requesterAdmin)) {
        return res.status(403).json({ message: "Access Denied! You can only update your own profile." });
    }

    try {
        const { password, profilePicture, coverPicture, email, username, ...others } = req.body;
        const updatedData = { ...others };

        if (username) updatedData.username = username.trim();
        if (email) updatedData.email = email.trim().toLowerCase();

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

        if (profilePicture) {
            updatedData.profilePicture = await uploadImage(profilePicture);
        }

        if (coverPicture) {
            updatedData.coverPicture = await uploadImage(coverPicture);
        }

        const user = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: pwd, ...otherDetails } = user._doc;
        res.status(200).json(otherDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// change password
export const changePassword = async (req, res) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const requesterId = req.user?.id;
    const requesterAdmin = req.user?.isAdmin;

    if (!requesterId || (id !== requesterId && !requesterAdmin)) {
        return res.status(403).json({ message: "Access Denied! You can only delete your own profile." });
    }

    try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//follow a user 
export const followUser = async (req, res) => {
    const id = req.params.id; 
    const currentUserId = req.user?.id;

    if (!currentUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (currentUserId === id) {
        return res.status(403).json({ message: "You cannot follow yourself." });
    }

    try {
        // ลบ try ชั้นนอกที่เกินมาออก เพื่อให้โครงสร้างถูกต้อง
        const followUser = await UserModel.findById(id); 
        const followingUser = await UserModel.findById(currentUserId); 
        
        if (!followUser.followers.includes(currentUserId)) {
            await followUser.updateOne({ $push: { followers: currentUserId } }); 
            await followingUser.updateOne({ $push: { following: id } }); 
            res.status(200).json({ message: "User followed successfully." }); 
        }
        else {
            res.status(403).json("User is already followed by you."); 
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// unfollow a user
export const UnfollowUser = async (req, res) => {
    const id = req.params.id; 
    const currentUserId = req.user?.id;

    if (!currentUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (currentUserId === id) {
        return res.status(403).json({ message: "You cannot follow yourself." });
    }

    try {
        // ลบ try ชั้นนอกที่เกินมาออกเช่นกัน
        const followUser = await UserModel.findById(id); 
        const followingUser = await UserModel.findById(currentUserId); 
        
        if (followUser.followers.includes(currentUserId)) {
            await followUser.updateOne({ $pull: { followers: currentUserId } }); 
            await followingUser.updateOne({ $pull: { following: id } }); 
            res.status(200).json("User unfollowed successfully." ); 
        }
        else {
            res.status(403).json("User is not followed by you."); 
        }
    } catch (error) {
        res.status(500).json(error);
    }
}