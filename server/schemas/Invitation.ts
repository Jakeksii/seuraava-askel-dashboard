import { Schema, Types } from "mongoose";
import validator from "validator";
import { IInvitation } from "../types";

export default new Schema<IInvitation>({
    user_email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        validate: {
            validator: function (value: string) {
                return validator.isEmail(value);
            },
            message: 'Invalid email address'
        }
    },
    organization: {
        organization_id: { type: Types.ObjectId, required: true, ref: "Organization" },
        organization_name: { type: String, required: true }
    },
    created_by: Types.ObjectId,
    updated_by: Types.ObjectId
}, { timestamps: true, expires: 604800 }); //adds createdAt, updatedAt, 604800 = 1 week