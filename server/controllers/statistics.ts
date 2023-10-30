import { Response, Request } from "../types";

import { EventStats } from "../connections/StatsConnection"


// GET Test
export const getTest = async (req:Request, res:Response):Promise<Response> => {
    
    try {

        const stats = await EventStats.find()

        if(!stats) return res.status(404).json({ message: "Stats not found"});


        return res.status(200).json(stats)

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}

export const createEventStats = async (req:Request, res:Response):Promise<Response> => {
    
    try {

        const newStatsData = req.body;

        const stats = new EventStats(newStatsData);
        
        await stats.save();

        if(!stats) return res.status(404).json({ message: "Stats not found"});


        return res.status(200).json(stats)

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}

export const updateEventStats = async (req:Request, res:Response):Promise<Response> => {
    
    const _id = req.params.id

    try {

        const stats = await EventStats.findByIdAndUpdate(_id, req.body, {new: true})

        if(!stats) return res.status(404).json({ message: "Stats not found"});


        return res.status(200).json(stats)

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}

