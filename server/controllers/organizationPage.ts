import { Response, Request } from "../types";
import { Organization, OrganizationPage } from "../connections/MainConnection";
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { sanitizeHTML } from "../Functions/sanitizeHTML";

export const createOrganizationPage = async (req: Request, res: Response) => {

    // Validate image
    if (!req.file) return res.status(400).end()
    const image = req.file.buffer

    // Validate user access to organization
    // Find organization by id from requesting user data
    // And test if user role is owner, admin or user in that organization
    const organization = req.user.organizations.find((organization) => organization.organization_id.equals(req.body.organization_id))
    if (!organization ||
        (organization.role !== "owner" &&
            organization.role !== "admin" &&
            organization.role !== "user")) {
        return res.status(403).end();
    }

    const page = sanitizeHTML(req.body.page)

    const newPage = new OrganizationPage({
        organization_name: organization.organization_name,
        organization_id: organization.organization_id,
        image_id: '', // Set after cloudinary upload
        page_data: page,
        created_by: req.user._id,
        updated_by: req.user._id
    })

    const validationError = newPage.validateSync();
    if (validationError) {
        return res.status(400).json({ message: validationError.message });
    }

    // Upload the image to cloudinary
    cloudinary.uploader.upload_stream({ resource_type: "image" }, uploadDone).end(image)

    async function uploadDone(error: any, result: UploadApiResponse | undefined) {
        if (error) {
            console.log("Error in cloudinary.uploader.upload_stream\n", error);
            return res.status(500).json({ error: error });
        }
        // Pass url to newPage
        newPage.image_id = result?.public_id

        try {
            // save created page to db
            const savedPage = await newPage.save()
            // return saved page to client
            return res.status(201).json(savedPage)
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }
}

export const findOrganizationPage = async (req: Request, res: Response): Promise<Response> => {
    if (!req.query.name) {
        return res.status(400).end();
    }
    const query = { organization_name: req.query.name }

    try {
        const page = await OrganizationPage.findOne(query)
        if(!page) return res.status(404).end();
        const organization = await Organization.findById(page.organization_id)

        const data = {
            organization: {
                name: organization.name,
                address: organization.address,
                contact_info: organization.contact_info_visible ? organization.contact_info : {},
                updatedAt: organization.updatedAt
            },
            image_id: page.image_id,
            data: page.page_data,
            updatedAt: page.updatedAt
        }

        return res.status(200).json(data);

    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}