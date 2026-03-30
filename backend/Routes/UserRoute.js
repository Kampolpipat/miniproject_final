import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { deleteUser, followUser, getUser, UnfollowUser, updateUser, changePassword, getFollowers, getFollowing } from "../Controllers/UserController.js";

const router = express.Router(); // Register Route

router.get('/:id', verifyToken, getUser); // get user info
router.get('/:id/followers', verifyToken, getFollowers); // get follower list
router.get('/:id/following', verifyToken, getFollowing);
router.put('/:id', verifyToken, updateUser); // update profile
router.put('/:id/change-password', verifyToken, changePassword);
router.delete('/:id', verifyToken, deleteUser); // delete user
router.put('/:id/follow', verifyToken, followUser); // follow user
router.put('/:id/unfollow', verifyToken, UnfollowUser); // unfollow

export default router; // Export the router