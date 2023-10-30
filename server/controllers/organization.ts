import { Response, Request } from "../types";
import { Organization, OrganizationPage } from "../connections/MainConnection";
import { User } from "../connections/UserConnection";

export const createOrganization = async (req:Request, res:Response):Promise<Response> => {
    try {
        const {
            name,
            business_id,
            address,
            contact_info,
            contact_info_visible } = req.body;

        const user = req.user;
        //if(user.organizations[1]) return res.status(409).json({ message: "You have already created or joined organization" })

        const newOrganization = new Organization({
            name,
            business_id, 
            address,
            contact_info,
            contact_info_visible,
            organization_users: [{
                user_id: user._id, 
                user_name: user.first_name+" "+user.last_name,
                user_email: user.email,
                role: 'owner'
            }], 
            created_by: user._id,
            updated_by: user._id })

        if(await Organization.findOne({name: name})){
            return res.status(409).json({ 
                message: "Organization with name "+name+" is already created" })
        }
            
        const validationError = newOrganization.validateSync();
        if (validationError) return res.status(400).json({ message: validationError.message });

        

        //Create organization
        const savedOrganization = await newOrganization.save();

        //Make current user owner of the newly created organization
        await User.findByIdAndUpdate(
            user._id, 
            { $push: {"organizations": {
                organization_id: savedOrganization._id, 
                organization_name: savedOrganization.name, 
                role: "owner" }} },
            { safe: true, upsert: true, new : true })

        return res.status(200).json(savedOrganization);

    } catch (error:any) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}


// GET organization
export const getOrganization = async (req:Request, res:Response):Promise<Response> => {
    try {
        const organization = await Organization.findById(req.params.id)
        if(!organization) return res.status(404).json({ message: "Organization not found by id: " +req.params.id});
        
        const sanitizedOrganization = {
            address: organization._doc.address,
            contact_info: organization._doc.contact_info_visible ? organization._doc.contact_info : null,
            _id: organization._doc._id,
            name: organization._doc.name,
        }
        return res.status(200).json(sanitizedOrganization)

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}

// GET all organizations
export const getAllOrganizations = async (req:Request, res:Response):Promise<Response> => {
    console.log("this is whats coming from front")
    try {
        const orgs = await OrganizationPage.find()
        
        console.log(orgs)
        return res.status(200).json(orgs)

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}

// GET detailed organizatio. requires auth
export const getDetailedOrganization = async (req:Request, res:Response):Promise<Response> => {
    try {
        // Find organization by id from requesting user data
        // And test if user role is owner or admin in that organization
        const user_organization = req.user.organizations.find((organization) => organization.organization_id.equals(req.params.id))
        if(!user_organization || (user_organization.role !== "owner" && user_organization.role !== "admin")) return res.status(403).end();

        // Get asked organization from database
        const organization = await Organization.findById(req.params.id)
        if(!organization) return res.status(404).json({ message: "Organization not found by id: " + req.params.id });

        // Return full organization details
        return res.status(200).json(organization._doc)

    } catch (error:any) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}

// DELETE organization. Needs verification. User needs to be owner
export const deleteOrganization = async (req:Request, res:Response):Promise<Response> => {
    try {
        // Find organization by id from requesting user data
        // And test if user role is owner in that organization
        const user_organization = req.user.organizations.find((organization) => organization.organization_id.equals(req.params.id))
        if(!user_organization || (user_organization.role !== "owner")) return res.status(403).end();

        // Delete organization from database
        await Organization.findByIdAndDelete(req.params.id)

        //Remove organization from every user
        const updatedUsers = (await User.updateMany({ $pull: { "organizations": { organization_id: req.params.id } } })).modifiedCount
        
        return res.status(200).json({ organizationsDeleted: 1, usersUpdated: updatedUsers })
        
    } catch (error:any) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}