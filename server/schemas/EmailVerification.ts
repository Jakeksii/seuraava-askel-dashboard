import { Schema, Types } from "mongoose";
import { IEmailVerification } from "../types";

export default new Schema<IEmailVerification>({
    user_id: {type: Types.ObjectId, required: true},
}, { timestamps: true, expires: 86400 }); //adds createdAt, updatedAt, 86400 = 1 day