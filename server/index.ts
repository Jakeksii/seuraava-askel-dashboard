import { v2 as cloudinary } from 'cloudinary';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import morgan from "morgan";

import MainConn from "./connections/MainConnection";
import UserConn from "./connections/UserConnection";
import StatsConn from "./connections/StatsConnection";

import authRoutes from "./routes/auth";
import emailRoutes from './routes/email';
import eventRoutes from "./routes/event";
import invitationRoutes from "./routes/invitation";
import organizationRoutes from "./routes/organization";
import organizationPageRoutes from "./routes/organizationPage";
import userRoutes from "./routes/user";
import { DummyDataRouter } from './schemas/dummy_data/Create';

import statsRoutes from "./routes/statistics"

// CONFIGURATIONS
dotenv.config();
const app = express();
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 150, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const helmetOptions = {
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'img-src': ["'self'", "data:", "https://res.cloudinary.com"]
        }
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(cors())
app.use(express.json({ limit: '10kb' }))
app.use(helmet(helmetOptions))
app.use(morgan("common"))

// ROUTES 
app.use("/api/dummydata", DummyDataRouter)

app.use("/api/statistics", statsRoutes)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/organizations", organizationRoutes)
app.use("/api/invitations", invitationRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/organization-pages", organizationPageRoutes)
app.use("/api/email", emailRoutes)
app.use("/", express.static(process.env.DASHBOARD ? 'public_dashboard' : 'public'))

const connect = async () => {
    await MainConn.asPromise().then(result => {
        console.log('Connected to Main database at: ' + result.host + ":" + result.port)
    }).catch(error => {
        console.error('Error connecting to Main database: ', error)
    })

    await UserConn.asPromise().then(result => {
        console.log('Connected to User database at: ' + result.host + ":" + result.port)
    }).catch(error => {
        console.error('Error connecting to User database: ', error)
    })

    await StatsConn.asPromise().then(result => {
        console.log('Connected to Stats database at: ' + result.host + ":" + result.port)
    }).catch(error => {
        console.error('Error connecting to Stats database: ', error)
    })

    try {
        const PORT = process.env.PORT || 6001;
        app.listen(PORT, () => console.log(`Server running in Port: ${PORT}`))
    } catch (error) {
        console.error("Error when starting server: ", error);
    }
}
connect()