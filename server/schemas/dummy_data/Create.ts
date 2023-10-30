import { Router } from "express";
import { Event, Organization } from "../../connections/MainConnection";
import { verifyToken } from "../../middleware/auth";
import { IEvent, IOrganization, Request, Response } from "../../types";
import images from "./images.json";
import meta from "./meta.json";
import organization from "./organizations.json";
import FI from "../../lang/FI.json";

const router: Router = Router();
router.post("/create", verifyToken as any, CreateDummyData as any)
export { router as DummyDataRouter };

export async function CreateDummyData(req: Request, res: Response) {
    let orgDocs = new Array
    let eventDocs = new Array

    organization.forEach((org) => {
        const organizationDoc = new Organization<IOrganization>({
            name: org.name,
            business_id: "0468712-9",
            address: {
                street: org.address.street,
                city: org.address.city,
                state: org.address.state,
                zipcode: org.address.zipcode,
                country: org.address.country,
                coordinates: [org.address.coordinates[0], org.address.coordinates[1]]
            },
            contact_info: {
                email: "info@seurakunta.fi",
                phone: "0445455831"
            },
            contact_info_visible: true,
            visible: true,
            organization_users: [{
                user_id: req.user._id,
                user_name: req.user.first_name + " " + req.user.last_name,
                user_email: req.user.email,
                role: "owner"
            }],
            created_by: req.user._id,
            updated_by: req.user._id
        })

        orgDocs.push(organizationDoc)

        org.events.forEach((event) => {
            const [start_date, end_date] = generateRandomDates();
            const EventDoc = new Event<IEvent>({
                start_date: start_date,
                end_date: end_date,
                title: event.name,
                extract: event.extract ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada volutpat justo, non suscipit lacus consectetur a.",
                description: GetDescription(),
                visible: true,
                address: {
                    ...org.address,
                    coordinates: [org.address.coordinates[0], org.address.coordinates[1]]
                },
                image_id: GetImage(),
                meta: {
                    types: event.types,
                    size: GetSize(),
                    language: "Suomi",
                    price: 0,
                    online: false,
                },
                organization: {
                    organization_id: organizationDoc._id,
                    organization_name: organizationDoc.name
                },
                created_by: req.user._id,
                updated_by: req.user._id
            })

            eventDocs.push(EventDoc)
        })
    })

    await Organization.bulkSave(orgDocs)
    await Event.bulkSave(eventDocs)

    return res.status(201).json({orgs: orgDocs, events: eventDocs})
}

function generateRandomDates(): [Date, Date] {
    const now = new Date();
    const sameDateProbability = Math.random();

    // Start date can be up to one month in the future
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + Math.random() * 30);

    // 90% chance that the dates are on the same day
    const endDate = new Date(startDate);
    if (sameDateProbability < 0.9) {
        endDate.setHours(startDate.getHours() + Math.random() * 24);
    } else {
        // Dates can be up to two days apart
        endDate.setDate(startDate.getDate() + Math.random() * 2);
    }

    return [startDate, endDate];
}

function GetDescription() {
    const lorem = "<h2>Labore magna magna nostrud aliqua</h2><p>Labore magna magna nostrud aliqua culpa deserunt aliquip laborum dolor in. Nisi adipisicing eiusmod officia cupidatat laborum reprehenderit ut adipisicing ex eu magna adipisicing reprehenderit velit. Magna irure culpa voluptate sit velit id non fugiat. Voluptate do elit occaecat sit amet nostrud labore velit laboris non laborum magna excepteur. Sit aliqua ex duis labore excepteur. Voluptate anim culpa dolor ipsum et aliqua adipisicing.</p><br /><p>Commodo veniam sit aliqua et ullamco excepteur eu. Labore est cillum veniam labore est consectetur laborum reprehenderit do irure tempor ea esse labore. Minim ea nostrud non elit in exercitation sit culpa. Minim ea ullamco minim esse anim. Commodo incididunt ipsum excepteur ad reprehenderit laboris laboris commodo. Id dolor commodo irure quis laboris fugiat deserunt.</p><br/><p>Reprehenderit exercitation occaecat id aliquip nisi ullamco deserunt ut. Amet tempor adipisicing et dolor eiusmod id. Laboris pariatur id laboris mollit ad.</p><br/><p>Est consectetur exercitation minim sint ipsum incididunt. Labore in reprehenderit laborum est duis adipisicing amet do mollit sit in elit. Qui culpa ad veniam elit consequat elit est id irure culpa adipisicing adipisicing. Deserunt consectetur culpa officia deserunt ullamco elit et do eiusmod.</p><br/><p>Laborum et reprehenderit fugiat magna consequat laboris officia elit tempor elit irure. Non sint eiusmod consequat non occaecat reprehenderit quis dolor anim laborum eiusmod consectetur aliquip consequat. Id cupidatat ullamco minim excepteur et cillum voluptate mollit. Ut esse tempor laborum non incididunt qui. Eiusmod proident non laboris commodo commodo adipisicing proident esse sit dolor in culpa mollit. Eu id tempor occaecat aliquip irure Lorem duis culpa. Proident aliquip deserunt consectetur minim nostrud officia mollit consequat incididunt in.</p><br/><p>Sint ipsum ipsum nulla velit incididunt pariatur non. In ea elit pariatur commodo aute. Do ullamco sint in laboris id laborum. Labore ipsum dolor velit eiusmod reprehenderit id cillum. Veniam fugiat enim culpa id esse duis culpa. Fugiat dolor culpa exercitation consequat labore. Aliquip sint proident ullamco ut fugiat est incididunt commodo minim magna ex officia ex Lorem.</p>"
    const noLoremProbability = Math.random();
    if (noLoremProbability < 0.9){
        return undefined
    }
    return lorem
}

function GetImage() {
    return images[Math.floor(Math.random() * images.length)];
}
function GetSize() {
    return meta.size[Math.floor(Math.random() * meta.size.length)];
}