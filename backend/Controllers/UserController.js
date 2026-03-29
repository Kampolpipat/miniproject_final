import e from "express";
import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
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


// update a User
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus, password} = req.body; // แยก currentUserId และ currentUserAdminStatus ออกจากข้อมูลที่เหลือ

    // ตรวจสอบว่า ID ที่ส่งมาเป็นของผู้ใช้ที่กำลังทำการอัปเดตหรือผู้ดูแลระบบ
    if (id === currentUserId || currentUserAdminStatus) {
        try {
            
            if (password) 
            {
                const salt = await bcrypt.genSalt(10); // สร้าง salt สำหรับการเข้ารหัส
                req.body.password = await bcrypt.hash(password, salt); // เข้ารหัส password ก่อนอัปเดต
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true }); // อัปเดตข้อมูลผู้ใช้และส่งข้อมูลที่อัปเดตกลับไป
            res.status(200).json(user); // ส่งข้อมูลผู้ใช้ที่อัปเดตกลับไปยัง client
        } catch (error) {
            res.status(500).json(error);
        }

    }else { 
        res.status(403).json({ message: "Access Denied! You can only update your own profile." }); // ส่งข้อความว่าไม่อนุญาตให้ทำการอัปเดตหากไม่ใช่ผู้ใช้ที่กำลังทำการอัปเดตหรือผู้ดูแลระบบ
    }
};

// ลบผู้ใช้ (ยังไม่เสร็จสมบูรณ์)
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    
    const {currentUserId, currentUserAdminStatus} = req.body; // แยก currentUserId และ currentUserAdminStatus ออกจากข้อมูลที่เหลือ

    if (id === currentUserId || currentUserAdminStatus) 
    { 
        try {
        await UserModel.findByIdAndDelete(id); // ลบผู้ใช้จากฐานข้อมูล
        res.status(200).json({ message: "User deleted successfully." }); // ส่งข้อความว่าลบผู้ใช้สำเร็จ
    } catch (error) {
        res.status(500).json(error);
    }
    }
        else 
            {
        res.status(403).json({ message: "Access Denied! You can only delete your own profile." }); // ส่งข้อความว่าไม่อนุญาตให้ทำการลบหากไม่ใช่ผู้ใช้ที่กำลังทำการลบหรือผู้ดูแลระบบ
        }
}

//follow a user 
export const followUser = async (req, res) => {
    const id = req.params.id; // ID ของผู้ใช้ที่ต้องการติดตาม
    
    const { currentUserId } = req.body; // ID ของผู้ใช้ที่กำลังทำการติดตาม

    if (currentUserId === id) {
        res.status(403).json({ message: "You cannot follow yourself." }); // ส่งข้อความว่าไม่สามารถติดตามตัวเองได้
    }
    else {
        try {
            
            const followUser = await UserModel.findById(id); // ค้นหาผู้ใช้ที่ต้องการติดตามในฐานข้อมูล
            const followingUser = await UserModel.findById(currentUserId); // ค้นหาผู้ใช้ที่กำลังทำการติดตามในฐานข้อมูล
            
            if (!followUser.followers.includes(currentUserId)) // ตรวจสอบว่าผู้ใช้ที่ต้องการติดตามยังไม่ได้ถูกติดตามโดยผู้ใช้ที่กำลังทำการติดตาม
             {
                await followUser.updateOne({ $push: { followers: currentUserId } }); // เพิ่ม ID ของผู้ใช้ที่กำลังทำการติดตามไปยังรายการ followers ของผู้ใช้ที่ต้องการติดตาม
                await followingUser.updateOne({ $push: { following: id } }); // เพิ่ม ID ของผู้ใช้ที่ต้องการติดตามไปยังรายการ following ของผู้ใช้ที่กำลังทำการติดตาม
                res.status(200).json({ message: "User followed successfully." }); // ส่งข้อความว่าติดตามผู้ใช้สำเร็จ
            }
            else {
                res.status(403).json("User is already followed by you."); // ส่งข้อความว่าไม่สามารถติดตามผู้ใช้ได้เนื่องจากผู้ใช้ที่ต้องการติดตามถูกติดตามแล้วโดยผู้ใช้ที่กำลังทำการติดตาม
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
// unfollow a user (ยังไม่เสร็จสมบูรณ์)
export const UnfollowUser = async (req, res) => {
    const id = req.params.id; // ID ของผู้ใช้ที่ต้องการติดตาม
    
    const { currentUserId } = req.body; // ID ของผู้ใช้ที่กำลังทำการติดตาม

    if (currentUserId === id) {
        res.status(403).json({ message: "You cannot follow yourself." }); // ส่งข้อความว่าไม่สามารถติดตามตัวเองได้
    }
    else {
        try {
            
            const followUser = await UserModel.findById(id); // ค้นหาผู้ใช้ที่ต้องการติดตามในฐานข้อมูล
            const followingUser = await UserModel.findById(currentUserId); // ค้นหาผู้ใช้ที่กำลังทำการติดตามในฐานข้อมูล
            
            if (followUser.followers.includes(currentUserId)) // ตรวจสอบว่าผู้ใช้ที่ต้องการติดตามยังไม่ได้ถูกติดตามโดยผู้ใช้ที่กำลังทำการติดตาม
             {
                await followUser.updateOne({ $pull: { followers: currentUserId } }); // ลบ ID ของผู้ใช้ที่กำลังทำการติดตามออกจากรายการ followers ของผู้ใช้ที่ต้องการติดตาม
                await followingUser.updateOne({ $pull: { following: id } }); // ลบ ID ของผู้ใช้ที่ต้องการติดตามออกจากรายการ following ของผู้ใช้ที่กำลังทำการติดตาม
                res.status(200).json("User unfollowed successfully." ); // ส่งข้อความว่าทำการเลิกติดตามผู้ใช้สำเร็จ
            }
            else {
                res.status(403).json("User is not followed by you."); // ส่งข้อความว่าไม่สามารถติดตามผู้ใช้ได้เนื่องจากผู้ใช้ที่ต้องการติดตามถูกติดตามแล้วโดยผู้ใช้ที่กำลังทำการติดตาม
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}