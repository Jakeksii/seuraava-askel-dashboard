import { Invitation } from "../connections/MainConnection";
import { Request, Response } from "../types";

export const accept = async (req:Request, res:Response) => {
    //Deletes invitation
}

export const decline = async (req:Request, res:Response) => {
    //Deletes invitation
}

export const check = async (req:Request, res:Response) => {
    //Checks if there is invitations
}

export const create = async (req:Request, res:Response) => {
    try {
        if(!req.body.organization_id ||
            !req.body.user_email) return res.status(400).end()

        const organization = req.user.organizations.find(
            (organization) => organization.organization_id.equals(
                req.body.organization_id))
        
        // If user organizations returned undefined
        // then user has no acces to that organization
        if(!organization) return res.status(403).end()

        //Check if invitation already exists then delete it and create new
        const query = { user_email: req.body.user_email, "organization.organization_id": organization.organization_id }
        await Invitation.findOneAndDelete(query)

        const newInvitation = new Invitation ({
            user_email: req.body.user_email,
            organization: {
                organization_id: organization.organization_id,
                organization_name: organization.organization_name
            },
            created_by: req.user._id
        })

        const invitation = await newInvitation.save()
        return res.status(201).json(invitation)
    } 
    
    catch (error:any) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}