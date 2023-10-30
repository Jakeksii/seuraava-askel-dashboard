import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Types } from "mongoose";
import { EmailVerification, User } from "../connections/UserConnection";
import { NextFunction, Request, Response } from "../types";


/* REGISTER USER */
export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            first_name,
            last_name,
            email,
            password
        } = req.body;

        //salt and hash
        const salt = await genSalt();
        const passwordHash = await hash(password, salt);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: passwordHash,
        });

        const validationError = newUser.validateSync();
        if (validationError) return res.status(400).json({ message: validationError.message });

        // We search for user with provided email and if we find one we return conflict
        if (await User.findOne({ email: email })) return res.status(409).json({ message: "Email already in use" })
        // Save user to db
        await newUser.save();
        
        return res.status(201).end();
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

/* LOGGING IN Gives user jwt token that expires in 10 minutes*/
export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        //Check if credintials are valid and user exist
        const { email, password } = req.body;
        var user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        //Create token
        const secret: string = process.env.JWT_SECRET ?? ""
        const token = sign({ _id: user._id as Types.ObjectId }, secret, { expiresIn: '1d' });

        //Send token and user info to front
        var user = { ...user._doc };
        delete user.password;
        return res.status(200).json({ token: token, user: user });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const secret: string = process.env.JWT_SECRET ?? ""
        const token = sign({ _id: req.user._id }, secret, { expiresIn: '1d' });

        return res.status(200).json({ token: token });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}