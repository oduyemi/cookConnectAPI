"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validators_1 = require("../middlewares/validators");
const router = express_1.default.Router();
router.post("/login", (0, validators_1.loginValidationRules)(), validators_1.validate, userController_1.loginUser);
exports.default = router;
