import exp from "constants";
import mongoose, {Schema, Document}from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({  // giving message as type scheme wo bhi message wala schema that has been declarded above
    content: {
        type: String,
        requried: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]  // message type ka array
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required:[true,"email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'please usa a valid email address'],  // first is regit and other is message regit means it will comparre with the regit one the input email
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verify code  expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        defaule: true,
    },
    messages: [MessageSchema] // data type of message will be given by messageschema
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))   // exporting in typescript

export default UserModel; 