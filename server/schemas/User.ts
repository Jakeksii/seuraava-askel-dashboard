import { Schema, Types} from "mongoose";
import validator from "validator";
import { IUser } from "../types";

export default new Schema<IUser>({
    first_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    last_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value:string) {
                return validator.isEmail(value);
            },
            message: 'Invalid email address'
        }
    },
    password: { //Normally would have more configurations
        type: String,
        required: true,
        minlength: 5
    },
    organizations: [{
        organization_id: { type: Types.ObjectId, ref: 'Organization' },
        organization_name: { type: String },
        role: String,
    }],
    verified: {type: Boolean, default: false}

}, {timestamps: true}); //adds createdAt, updatedAt