import mongoose, { Document, Schema } from "mongoose";


export interface ITemporaryUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string;
    otpExpires: Date;
}

const temporaryUserSchema: Schema<ITemporaryUser> = new Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    otp: { 
        type: String, 
        required: true 
    },
    otpExpires: { 
        type: Date, 
        required: true 
    }
});

const TemporaryUser = mongoose.model<ITemporaryUser>("TemporaryUser", temporaryUserSchema);
export default TemporaryUser;

