import { Request, Response } from "../types";
import nodemailer from 'nodemailer'
import { readFile } from "fs";
import { EmailVerification, User } from "../connections/UserConnection";

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

export const sendVerificationEmail = async (req:Request, res:Response):Promise<Response> => {
    try {
        // Create and save emailVerificationObject
        const emailVerification = new EmailVerification({ user_id: req.user._id })
        const { _id: emailVerification_id } = await emailVerification.save()

        console.warn("Remember to change emailverification link")
        const href = `href="http://localhost:3001/api/email/verify/${emailVerification_id}"`

        readFile('email_templates\\verify_email.html', 'utf-8', (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            const mailOptions = {
                from: 'Seuraava Askel <no-reply@seuraava-askel.fi>',
                to: req.user.email,
                subject: 'Sähköpostin vahvistus',
                html: data.trim().replace('href="#verify-email-link"', href)
            }
    
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        })

        return res.status(200).end()
    } catch (error:any) {
        return res.status(500).end()
    }
}

export const verifyEmail = async (req:Request, res:Response):Promise<Response> => {
    try {
        const _id = req.params._id
        if(!_id) return res.status(400).end()

        // get verification object with id provided by url
        const verfication = await EmailVerification.findByIdAndDelete(_id)
        if(!verfication) return res.status(404).end() // return not found
        // get user with id provided by verification object and update that user to be verified
        await User.findByIdAndUpdate(verfication.user_id, {verified: true})

        return res.status(200).end()
    } catch (error:any) {
        console.log(error)
        return res.status(500).end()
    }
}