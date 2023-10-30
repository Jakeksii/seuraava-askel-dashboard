import dotenv from "dotenv";
import mongoose from "mongoose";

import EmailVerificationSchema from "../schemas/EmailVerification";
import UserSchema from "../schemas/User";

dotenv.config();
const url:string = process.env.USING_PUBLIC_DB ? (process.env.MONGO_URL_USER ?? "") : (process.env.MONGO_URL_USER_LOCAL ?? "")
const UserConn = mongoose.createConnection(url)

UserConn.model("User", UserSchema)
UserConn.model("EmailVerification", EmailVerificationSchema)

export const User = UserConn.models.User
export const EmailVerification = UserConn.models.EmailVerification

export default UserConn
