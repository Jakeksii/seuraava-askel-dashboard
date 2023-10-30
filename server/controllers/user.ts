import { Organization } from "../connections/MainConnection";
import { User } from "../connections/UserConnection";
import { Request, Response, IUser } from "../types";

/* READ */
export const getCurrentUser = async (req:Request, res:Response):Promise<Response> => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ message: "User not found" })

        const sanitizedUser:IUser = { ...user._doc }
        delete sanitizedUser.password;
        return res.status(200).json(sanitizedUser);
    } catch (error:any) {
        return res.status(500).json({ error: error.message });
    }
}

// DELETE user. Needs verification.
export const deleteUser = async (req:Request, res:Response):Promise<Response> => {
    try {
        //Find and Delete user from DB
        const deletedUser:IUser | null = await User.findByIdAndDelete(req.user._id);
        if(!deletedUser) return res.status(404).json({ message: "User not found" })

        // Find all organizations that user was owner in
        const userOrganizations = req.user.organizations.filter((organization) => organization.role === "owner")
        if(!userOrganizations) return res.status(200).json({ usersDeleted: 1, organizationsDeleted: 0 })

        // Map ids to use in deletion functions
        const organizationIds = userOrganizations.map((organization) => organization.organization_id);

        //Remove those organizations that user owns
        const deletedOrganizations = (await Organization.deleteMany({ _id: { $in: organizationIds}})).deletedCount

        //Remove organization from every users info
        const updatedUsers = (await User.updateMany({ $pull: { "organizations": { organization_id: req.params.id } } })).modifiedCount
        
        return res.status(200).json({ usersDeleted: 1, organizationsDeleted: deletedOrganizations, usersUpdated: updatedUsers })

    } catch (error:any) {
        return res.status(500).json({ error: error.message })
    }
}