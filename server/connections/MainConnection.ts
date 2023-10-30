import dotenv from "dotenv";
import mongoose from "mongoose";
import EventSchema from "../schemas/Event";
import InvitationSchema from "../schemas/Invitation";
import OrganizationSchema from "../schemas/Organization";
import OrganizationPageSchema from "../schemas/OrganizationPage";

dotenv.config();
const url:string = process.env.USING_PUBLIC_DB ? (process.env.MONGO_URL_MAIN ?? "") : (process.env.MONGO_URL_MAIN_LOCAL ?? "")
const MainConn = mongoose.createConnection(url)

MainConn.model("Event", EventSchema)
MainConn.model("Invitation", InvitationSchema)
MainConn.model("Organization", OrganizationSchema)
MainConn.model("OrganizationPage", OrganizationPageSchema)

export const Event = MainConn.models.Event
export const Invitation = MainConn.models.Invitation
export const Organization = MainConn.models.Organization
export const OrganizationPage = MainConn.models.OrganizationPage

export default MainConn
