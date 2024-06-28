import express from 'express';
import { getIndex, loginUser, getUserProfile, getAllUsers, getUserById } from '../controllers/userController';
import { registerUser } from '../controllers/registerController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get("/", getIndex);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', getAllUsers);
router.get('/users/user/:id', getUserById);

export default router;
