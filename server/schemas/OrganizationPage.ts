import { Schema, Types } from "mongoose";
import { IOrganizationPage } from "../types";

export default new Schema<IOrganizationPage>({
    organization_name: {type: String, unique: true, index: true},
    organization_id: Types.ObjectId,
    image_id: String,
    page_data: String,
    created_by: Types.ObjectId,
    updated_by: Types.ObjectId

}, {timestamps: true}); //adds createdAt, updatedAt