import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { Types } from 'mongoose'
import { Event } from "../connections/MainConnection"
import { IEvent, Request, Response } from '../types'
import { EventStats } from '../connections/StatsConnection'

// USE ZOD VALIDATOR

export const createEvent = async (req: Request, res: Response) => {

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
    //deleteImageFile(imagePath)
    return res.status(403).end();
  }

  // VALIDATE event
  const event = JSON.parse(req.body.event)

  // Create event object
  const newEvent = new Event({
    start_date: event.start_date,
    end_date: event.end_date,
    title: event.title,
    extract: event.extract,
    description: event?.description,
    visible: event.visible,
    address: event.address,
    image_id: "", // Set after the image is uploaded to cloudinary
    meta: event?.meta,
    organization: {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name
    },
    created_by: req.user._id,
    updated_by: req.user._id
  })

  // Create eventstats object
  const newEventStats = new EventStats( {
    title: event.title,
    event_searches: 0,
    event_views: 0,
    event_unique_views: 0,
    event_location_views: 0,
    event_clicks: 0,
    event_unique_clicks: 0,
    event_location_clicks: [
      {
          locationType: 'Point',
          coordinates: [0, 0],
      },
  ],
  })

  // validate event object
  const validationError = newEvent.validateSync();
  if (validationError) {
    //deleteImageFile(imagePath)
    return res.status(400).json({ message: validationError.message });
  }

  // Upload the image to cloudinary
  cloudinary.uploader.upload_stream({ resource_type: "image" }, uploadDone).end(image)

  async function uploadDone(error: any, result: UploadApiResponse | undefined) {
    if (error) {
      console.log("Error in cloudinary.uploader.upload_stream\n", error);
      return res.status(500).json({ error: error });
    }
    // Pass url to newEvent
    newEvent.image_id = result?.public_id

    try {
      // save created event to db
      const savedEvent = await newEvent.save()
      // save created eventstats to db
      const savedEventStats = await newEventStats.save()
      // return saved event to client
      return res.status(201).json(savedEvent)
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

export const getFilters = async (req: Request, res: Response) => {
  const filters = req.body.filters

  const availableFilters = await Event.aggregate([
    {
      $match: filters, // Apply your initial filters
    },
    {
      $facet: {
        denomination: [
          { $group: { _id: '$meta.denomination' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
        types: [
          {
            $unwind: '$meta.types' // Split the array into individual documents
          },
          { $group: { _id: '$meta.types' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
        size: [
          { $group: { _id: '$meta.size' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
        language: [
          { $group: { _id: '$meta.language' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
        price: [
          { $group: { _id: '$meta.price' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
        online: [
          { $group: { _id: '$meta.online' } },
          { $project: { _id: 0, value: '$_id' } },
        ],
      },
    },
  ]).exec();

  return res.status(200).json(availableFilters[0])
}

export const getEvents = async (req: Request, res: Response) => {
  const location = req.body.location
  const search = req.body.search as [
    {"address.city": string},
    {"organization.organization_name": string},
    {"title": string}
  ]
  const filters = req.body.filters ?? {}

  // PAGINATE
  const page = parseInt(req.query.page as string) || 1; // Current page number
  const limit = parseInt(req.query.limit as string) || 3; // Number of items per page
  const skip = (page - 1) * limit

  try {

    let events: IEvent[]

    if (location) {
      const { latitude, longitude } = location;
      events = await Event.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            distanceField: 'distance',
            spherical: true,
          },
        },
        {
          $match: filters
        },
        {
          $sort: {
            distance: 1,  // Sort by distance in ascending order (closest first)
            start_date: 1, // Then sort by start_date in ascending order
          },
        },
        // Additional stages if needed
      ]).skip(skip).limit(limit).exec();
    } else {
      events = await Event.find({ ...filters, $or: search }).skip(skip).limit(limit).sort({ start_date: 1 }).exec()
    }

    const data = events.map((event: IEvent) => {
      return {
        _id: event._id,
        start_date: event.start_date,
        end_date: event.end_date,
        title: event.title,
        extract: event.extract,
        address: event.address,
        image_id: event.image_id,
        meta: event.meta,
        organization: event.organization,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }
    })

    return res.status(200).json(data)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'An error occurred while fetching events' })
  }
}

export const searchEvents = async (req: Request, res: Response) => {
  const search = req.query.s as string;
  const searchTerm = search.toLowerCase();
  if (searchTerm.length < 3) return res.status(400).json({ message: "search term needs to be atleast 3 char long" })

  const regex = { $regex: searchTerm, $options: 'i' };
  const endDateFilter = { end_date: { $gte: new Date() } }
  const cityFilter = { 'address.city': regex }
  const organizationFilter = { 'organization.organization_name': regex }
  const titleFilter = { title: regex }
  try {
    const [distinctCities, distinctOrgNames, distinctTitles] = await Promise.all([
      Event.find({ $and: [cityFilter, endDateFilter] }).distinct('address.city').exec(),
      Event.find({ $and: [organizationFilter, endDateFilter] }).distinct('organization.organization_name').exec(),
      Event.find({ $and: [titleFilter, endDateFilter] }).distinct('title').exec(),
    ]);
    const cities = distinctCities.map((data) => ({ type: 'city', data: data }))
    const organizations = distinctOrgNames.map((data) => ({ type: 'organization', data: data }))
    const titles = distinctTitles.map((data) => ({ type: 'title', data: data }))

    const results = [...cities, ...organizations, ...titles]

    return res.status(200).json(results);

  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'An error occurred while fetching events' });
  }
}

// Event page
export const getEventPage = async (req: Request, res: Response) => {
  const { _id } = req.params
  if (!Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid Id" });
  }

  try {
    const event: IEvent | null = await Event.findById(_id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const data = {
      _id: event._id,
      start_date: event.start_date,
      end_date: event.end_date,
      title: event.title,
      extract: event.extract,
      description: event.description,
      address: event.address,
      image_id: event.image_id,
      meta: event.meta,
      organization: event.organization,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}