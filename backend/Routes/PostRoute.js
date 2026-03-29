import express from "express";
import { createPost ,getPost, updatePost,deletePost, likePost,getTimelinePosts} from "../Controllers/PostController.js";
const router = express.Router(); // Register Route

router.post('/', createPost); // เส้นทางสำหรับสร้างโพสต์ใหม่
router.get('/:id', getPost); // เส้นทางสำหรับดึงข้อมูลโพสต์ตาม ID 
router.put('/:id', updatePost); // เส้นทางสำหรับอัปเดตโพสต์ตาม ID 
router.delete('/:id', deletePost); // เส้นทางสำหรับลบโพสต์ตาม ID 
router.put('/:id/like', likePost); // เส้นทางสำหรับกดไลค์โพสต์ตาม ID 
router.get('/:id/timeline', getTimelinePosts); // เส้นทางสำหรับดึงโพสต์ในไทม์ไลน์ของผู้ใช้ตาม ID 

export default router; // Export the router