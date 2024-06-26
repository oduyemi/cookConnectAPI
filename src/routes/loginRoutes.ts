import express from "express";
import { loginUser } from "../controllers/userController";
import { loginValidationRules, validate } from "../middlewares/validators";

const router = express.Router();

router.post("/login", loginValidationRules(), validate, loginUser);

export default router;