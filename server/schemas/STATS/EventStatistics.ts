import { Schema, Types} from "mongoose";
import { IEventStats } from "../../types";



export default new Schema<IEventStats> ({
    title: {   // link to main/events
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15       
    },
    event_searches: {
        type: Number,
        // required: true,   
    },
    event_views: {
        type: Number,
        // required: true,   
    },
    event_unique_views: {
        type: Number,
        // required: true,
    },
    event_location_views: {
        type: Number,
        // required: true,
    },
    event_clicks: {
        type: Number,
        // required: true,   
    },
    event_unique_clicks: {
        type: Number,
        // required: true,   
    },
    event_location_clicks: [
        {
            locationType: {
                type: String,
                enum: ['Point'], // You can specify the type as "Point" for geo coordinates
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            },
        },
    ],

    createdAt: Date,
    updatedAt: Date

}, {timestamps: true});

