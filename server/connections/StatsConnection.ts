import dotenv from "dotenv";
import mongoose from "mongoose";

import EventSchema from "../schemas/STATS/EventStatistics";

dotenv.config();

const url:string = (process.env.USING_PUBLIC_DB ? process.env.MONGO_URL_STATS : process.env.MONGO_URL_STATS_LOCAL) ?? ""
const StatsConn = mongoose.createConnection(url)

StatsConn.model("EventStats", EventSchema)


export const EventStats = StatsConn.models.EventStats

export default StatsConn