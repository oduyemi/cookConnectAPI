import express from 'express';
import { verifyOTP } from '../controllers/otpController';

const router = express.Router();

router.post('/verify', verifyOTP);

export default router;
