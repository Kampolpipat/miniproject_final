import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost, getPost, updatePost, deletePost, likePost, commentPost, getTimelinePosts } from "../Controllers/PostController.js";
const router = express.Router(); // Register Route

router.post('/', verifyToken, createPost); // create post
router.get('/:id', verifyToken, getPost); // get post
router.put('/:id', verifyToken, updatePost); // update post
router.delete('/:id', verifyToken, deletePost); // delete post
router.put('/:id/like', verifyToken, likePost); // like post
router.put('/:id/comment', verifyToken, commentPost); // comment post
router.get('/:id/timeline', verifyToken, getTimelinePosts); // timeline

export default router; // Export the router