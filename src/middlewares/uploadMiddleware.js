"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destination called:', 'uploads/');
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log('Filename called:', Date.now() + '-' + file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    console.log('File filter called:', file.originalname);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        const error = new Error('Only image files are allowed!');
        cb(error, false);
    }
    else {
        cb(null, true);
    }
};
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
