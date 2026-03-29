import express from "express";
import { deleteUser,followUser, getUser,UnfollowUser,updateUser,} from "../Controllers/UserController.js";



const router = express.Router(); // Register Route

router.get('/:id', getUser); // เส้นทางสำหรับดึงข้อมูลผู้ใช้ตาม ID
router.put('/:id', updateUser); // เส้นทางสำหรับอัปเดตข้อมูลผู้ใช้ตาม ID
router.delete('/:id', deleteUser); // เส้นทางสำหรับลบผู้ใช้ตาม ID 
router.put('/:id/follow', followUser); // เส้นทางสำหรับติดตามผู้ใช้ตาม ID 
router.put('/:id/unfollow', UnfollowUser); // เส้นทางสำหรับเลิกติดตามผู้ใช้ตาม ID (ยังไม่เสร็จสมบูรณ์)

export default router; // Export the router