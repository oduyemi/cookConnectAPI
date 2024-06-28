"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const registerController_1 = require("../controllers/registerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", userController_1.getIndex);
router.post('/register', registerController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/profile', authMiddleware_1.protect, userController_1.getUserProfile);
router.get('/users', userController_1.getAllUsers);
router.get('/users/user/:id', userController_1.getUserById);
exports.default = router;
