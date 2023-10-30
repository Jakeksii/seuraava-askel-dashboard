import { verify } from "jsonwebtoken";
import { User } from "../connections/UserConnection";
import { IUser, NextFunction, Request, Response } from "../types";

export const verifyToken = async (req:Request, res:Response, next:NextFunction):Promise<Response|void> => {
    try {
        let token = req.header("Authorization");

        if (!token) return res.status(401).send({ message: "Access Denied: No authorization token" });

        try {
            const secret:string = process.env.JWT_SECRET ?? ""
            const verified = verify(token, secret) as string

            //Test if user can be found with _id that was provided by token
            const user:IUser | null = await User.findById(verified)
            if(!user) return res.status(401).send({ message: "Access Denied: Bad authorization token" });

            req.user = user;
            return next();

        } catch (error:any) {
            return res.status(401).send({ message: "Access Denied: Bad authorization token" });
        }

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}