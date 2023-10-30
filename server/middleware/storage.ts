import multer from 'multer';
import { NextFunction, Request, Response } from "../types";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

export const uploadImage =  async (req: Request, res: Response, next: NextFunction) => {

    upload.single('image') (req, res, async (error: any) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Image upload successful
        next(); // Continue executing request
    });
}

