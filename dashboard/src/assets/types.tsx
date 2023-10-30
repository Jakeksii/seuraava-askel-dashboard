import { SEARCH_TYPE_CITY, SEARCH_TYPE_ORGANIZATION, SEARCH_TYPE_TITLE } from "./constants"

// Sub types
interface Address {
    street: string
    city: string
    state: string
    zipcode: string
    country: string
    coordinates: [number, number]
}
interface ContactInfo {
    email: string,
    phone: string
}

// EVENT
export interface IEvent {
    _id: string | undefined
    start_date: Date
    end_date: Date
    title: string
    description: string
    contactinfo: ContactInfo
    extract: string
    visible: boolean
    address: Address
    image_id: string
    event_meta: {
        speaker: string
        music: string
        presenter: string
    }
    event_page_url: string
    organization: {
        organization_id: string,
        organization_name: string,
    }
    createdAt: Date,
    updatedAt: Date,
}

// SEARCH
export type SearchResult = {
    type:
    typeof SEARCH_TYPE_CITY |
    typeof SEARCH_TYPE_ORGANIZATION |
    typeof SEARCH_TYPE_TITLE
    data: string
}
export type SearchResults = {
    results: SearchResult[]
    error?: string
}

// Organization
export interface OrganizationPage {
    organization: {
        name: string,
        address: Address,
        contact_info: ContactInfo,
        updatedAt: Date
    },
    image_id: string
    data: string
    updatedAt: Date
}
export interface Organization {
    address: Address,
	contact_info: ContactInfo,
	_id: string,
	name: string,
	business_id: string,
	contact_info_visible: boolean,
	visible: boolean,
	organization_users: [
		{
			user_id?: string
			user_name: string | undefined,
			user_email: string | undefined,
			role: "user" | "admin" | "owner",
			_id: string | undefined
		}
	],
	created_by: string | undefined,
	updated_by: string | undefined,
	createdAt: Date,
	updatedAt: Date,
	__v: number
}

export interface SendOrganization {
    address: Address,
	contact_info: ContactInfo,
	name: string,
	business_id: string,
	contact_info_visible: boolean,
}


export interface User {
    token: string,
    user: {
        _id: string,
        first_name: string,
        last_name: string,
        email: string,
        verified: boolean,
        organizations?: [
            {
                organization_id: string,
                organization_name: string,
                role: "user" | "admin" | "owner",
                _id: string
            }
        ]
    }
}

export interface EventStats {
    title: string
    event_searches: number
    event_views: number
    event_unique_views: number
    event_location_views: number
    event_clicks: number
    event_unique_clicks: number
    event_location_clicks: [
        {
            locationType: {
                type: string,
                enum: ['Point'], // You can specify the type as "Point" for geo coordinates
            },
            coordinates: {
                type: [number], // [longitude, latitude]
            },
        },
    ],
}