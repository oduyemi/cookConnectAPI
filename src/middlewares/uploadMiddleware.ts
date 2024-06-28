import multer from 'multer';
import { Request } from 'express';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destination called:', 'uploads/');
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log('Filename called:', Date.now() + '-' + file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log('File filter called:', file.originalname);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        const error: any = new Error('Only image files are allowed!') as Error;
        cb(error, false); 
    } else {
        cb(null, true);
    }
};



const upload = multer({ storage: storage });




export default upload;
