import express from "express";
import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

// create a post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body); // สร้างโพสต์ใหม่จากข้อมูลที่ส่งมาจาก client

    try {
        await newPost.save(); // บันทึกโพสต์ใหม่ลงในฐานข้อมูล
        res.status(200).json("Post created!"); // ส่งข้อมูลโพสต์ที่ถูกสร้างกลับไปยัง client
    } catch (error) {
        res.status(500).json(error); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client หากเกิดปัญหาในการสร้างโพสต์
    }
};

// get a post
export const getPost = async (req, res) => {
    const id = req.params.id; // ดึง ID ของโพสต์จากพารามิเตอร์ของ URL

    try {
        const post = await PostModel.findById(id); // ค้นหาโพสต์ในฐานข้อมูลตาม ID
        res.status(200).json(post); // ส่งข้อมูลโพสต์กลับไปยัง client
    } catch (error) 
    {
        res.status(500).json(error); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client หากเกิดปัญหาในการดึงข้อมูลโพสต์
    }
};

// update a post   
export const updatePost = async (req, res) => {
    const id = req.params.id; // ดึง ID ของโพสต์จากพารามิเตอร์ของ URL
    const { userId } = req.body; // ดึง userId ของผู้ที่พยายามอัปเดตโพสต์จากข้อมูลที่ส่งมาจาก client

    try {
        const post = await PostModel.findById(id); // ค้นหาโพสต์ในฐานข้อมูลตาม ID
        if (post.userId === userId) { // ตรวจสอบว่า userId ของผู้ที่พยายามอัปเดตโพสต์ตรงกับ userId ของโพสต์หรือไม่
            await post.updateOne({ $set: req.body }); // อัปเดตโพสต์ด้วยข้อมูลที่ส่งมาจาก client
            res.status(200).json("Post updated!"); // ส่งข้อความว่าโพสต์ถูกอัปเดตสำเร็จกลับไปยัง client
        }
        else {
            res.status(403).json("You can only update your own post!"); // ส่งข้อความว่าไม่อนุญาตให้ทำการอัปเดตโพสต์หาก userId ไม่ตรงกับ userId ของโพสต์
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// ลบโพสต์ 
export const deletePost = async (req, res) => {
    const id = req.params.id; // ดึง ID ของโพสต์จากพารามิเตอร์ของ URL
    const { userId } = req.body; // ดึง userId ของผู้ที่พยายามลบโพสต์จากข้อมูลที่ส่งมาจาก client

    try {
        
        const post = await PostModel.findById(id); 
        if (post.userId === userId) 
        {
            await post.deleteOne(); // ลบโพสต์จากฐานข้อมูล
            res.status(200).json("Post deleted successfully!"); // ส่งข้อความว่าโพสต์ถูกลบสำเร็จกลับไปยัง client
        }
        else {
            res.status(403).json("You can only delete your own post!"); // ส่งข้อความว่าไม่อนุญาตให้ทำการลบโพสต์หาก userId ไม่ตรงกับ userId ของโพสต์
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// like and dislike a post
export const likePost = async (req, res) => {
    const id = req.params.id; // ดึง ID ของโพสต์จากพารามิเตอร์ของ URL
    const { userId } = req.body; // ดึง userId ของผู้ที่พยายามกดไลค์โพสต์จากข้อมูลที่ส่งมาจาก client

    try {
        const post = await PostModel.findById(id); // ค้นหาโพสต์ในฐานข้อมูลตาม ID
        if (!post.likes.includes(userId)) // ตรวจสอบว่า userId ของผู้ที่พยายามกดไลค์โพสต์ยังไม่ได้กดไลค์โพสต์นี้มาก่อนหรือไม่
            { 
                await post.updateOne({ $push: { likes: userId } }); // เพิ่ม userId ของผู้ที่พยายามกดไลค์โพสต์ไปยังรายการ likes ของโพสต์  
                res.status(200).json("Post liked!"); // ส่งข้อความว่าโพสต์ถูกกดไลค์สำเร็จกลับไปยัง client
            }
        else {
            await post.updateOne({ $pull: { likes: userId } }); // ลบ userId ของผู้ที่พยายามกดไลค์โพสต์ออกจากรายการ likes ของโพสต์ (ถ้าผู้ใช้กดไลค์โพสต์นี้มาก่อนแล้ว)
            res.status(200).json("Post Unliked!"); // ส่งข้อความว่าโพสต์ถูกกดไม่ชอบสำเร็จกลับไปยัง client
        }
    } catch (error) {
        res.status(500).json(error);
    }
};


// get timeline posts 
export const getTimelinePosts = async (req, res) => {
        const userId = req.params.id; // ดึง ID ของผู้ใช้จากพารามิเตอร์ของ URL

        try {
            const currentUserPosts = await PostModel.find({ userId: userId }); // ค้นหาโพสต์ทั้งหมดของผู้ใช้ในฐานข้อมูล
            const followingPosts = await UserModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(userId) } 
            },
                {
                    $lookup: {
                        from: "posts", // ชื่อของคอลเลกชันโพสต์ในฐานข้อมูล MongoDB
                        localField: "following", // ชื่อของฟิลด์ในคอลเลกชันผู้ใช้ที่เก็บ ID ของผู้ที่ผู้ใช้กำลังติดตาม
                        foreignField: "userId",// ชื่อของฟิลด์ในคอลเลกชันโพสต์ที่เก็บ ID ของผู้ใช้ที่สร้างโพสต์
                        as: "followingPosts"// ชื่อของฟิลด์ที่ผลลัพธ์ของการรวมข้อมูลจะถูกเก็บไว้ในเอกสารผู้ใช้
                    }
            },
                { $project: {
                    followingPosts: 1, // เลือกเฉพาะฟิลด์ followingPosts จากผลลัพธ์ของการรวมข้อมูล
                    _id: 0 // ไม่รวมฟิลด์ _id ในผลลัพธ์
                }
            }
            ]);  
        
            res.status(200)
            .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
            .sort((a, b) => {
                return b.createdAt - a.createdAt; // เรียงโพสต์ตามวันที่สร้างจากใหม่ไปเก่า
            })
            ); 
        
            } catch (error) 
        {
            res.status(500).json(error);
        }
};