// @ts-nocheck
// Tää kommentti tekee niin ettei Typescript compiler tarkasta tätä tiedostoa. ota pois kun muokkaat tätä lisäsin sen jotta voin buildata dashboardin
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';


import Header from "../assets/components/Header";

import DragDropFiles from '../assets/components/DragDropFiles';

import * as React from 'react';
import { useState } from 'react';
import { IEvent } from '../assets/types';
import { useAppContext } from '../assets/context/appContext';



export default function CreateEvent() {

    const { user } = useAppContext()

    const [event, setEvent] = useState<IEvent>({
        _id: user?.user._id,
        start_date: new Date(),
        end_date: new Date(),
        title: '',
        description: '',
        contactinfo: {
            email: "",
            phone: "",
        },
        extract: '',
        visible: false,
        address: {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
          coordinates: [0, 0],
        },
        image_id: '',
        event_meta: {
          speaker: '',
          music: '',
          presenter: '',
        },
        event_page_url: '',
        organization: {
          organization_id: '',
          organization_name: '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });


      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", event.title);
        formData.append("description", event.description);
        formData.append("start_date", event.start_date.toISOString()); // Convert to a suitable date format
        formData.append("end_date", event.end_date.toISOString()); // Convert to a suitable date format
        formData.append("contactinfo[email]", event.contactinfo.email);
        formData.append("contactinfo[phone]", event.contactinfo.phone);
        formData.append("extract", event.extract);
        formData.append("visible", String(event.visible));
        formData.append("address[street]", event.address.street);
        formData.append("address[city]", event.address.city);
        formData.append("address[state]", event.address.state);
        formData.append("address[zipcode]", event.address.zipcode);
        formData.append("address[country]", event.address.country);
        formData.append("address[coordinates][0]", String(event.address.coordinates[0]));
        formData.append("address[coordinates][1]", String(event.address.coordinates[1]));
        formData.append("event_meta[speaker]", event.event_meta.speaker);
        formData.append("event_meta[music]", event.event_meta.music);
        formData.append("event_meta[presenter]", event.event_meta.presenter);
        formData.append("event_page_url", event.event_page_url);
        formData.append("organization[organization_id]", event.organization.organization_id);
        formData.append("organization[organization_name]", event.organization.organization_name);
      
        formData.append("image_id", event.image_id);


        const eventData: IEvent = {
            _id: user?.user._id || undefined,
            start_date: event.start_date,
            end_date: event.end_date,
            title: event.title,
            description: event.description,
            contactinfo: {
              email: event.contactinfo.email,
              phone: event.contactinfo.phone,
            },
            extract: event.extract,
            visible: event.visible,
            address: {
              street: event.address.street,
              city: event.address.city,
              state: event.address.state,
              zipcode: event.address.zipcode,
              country: event.address.country,
              coordinates: event.address.coordinates,
            },
            image_id: event.image_id,
            event_meta: {
              speaker: event.event_meta.speaker,
              music: event.event_meta.music,
              presenter: event.event_meta.presenter,
            },
            event_page_url: event.event_page_url,
            organization: {
              organization_id: event.organization.organization_id,
              organization_name: event.organization.organization_name,
            },
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };

      
        try {
          const response = await fetch("http://localhost:3001/api/events/create", {
            method: "POST",
            headers: {
                "Authorization": user?.token || ""
            },
            body: formData,
        });
        if (!response.ok) {
          throw new Error("Not working yet");
        }

        const data = await response.json();

        console.log("Event created successfully:", data);

        } catch (error) {
          // Handle any errors that occurred during the fetch
          console.error("Error creating event:", error);
        }
      };
      

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
      
        setEvent((prevEvent) => {
          if (name.startsWith("contactinfo.")) {
            return {
              ...prevEvent,
              contactinfo: {
                ...prevEvent.contactinfo,
                [name.split(".")[1]]: value,
              },
            };
          } else if (name.startsWith("address.")) {
            return {
              ...prevEvent,
              address: {
                ...prevEvent.address,
                [name.split(".")[1]]: value,
              },
            };
          } else if (name.startsWith("event_meta.")) {
            return {
              ...prevEvent,
              event_meta: {
                ...prevEvent.event_meta,
                [name.split(".")[1]]: value,
              },
            };
          } else if (name === "event_page_url") {
            return {
              ...prevEvent,
              event_page_url: value,
            };
          } else {
            return {
              ...prevEvent,
              [name]: value,
            };
          }
        });
      };
      
      



    return (
        <>
        <Header />
        
        <main>

                <Container component="section" maxWidth="xs" className='mt-6'>
                    <div className='flex flex-col items-center p-2'>
                        <Box component="form" onSubmit={handleSubmit}>

                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Tapahtuman nimi"
                                name="title"
                                autoFocus
                                value={event.title}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                id="description"
                                label="Tapahtuman kuvaus"
                                name="description"
                                autoFocus
                                value={event.description}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            {/* https://mui.com/x/react-date-pickers/date-range-picker/#uncontrolled-vs-controlled-value */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                    <DemoItem label="Uncontrolled picker" component="DateRangePicker">
                                    <DateRangePicker
                                        defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
                                    />
                                    </DemoItem>

                                </DemoContainer>
                                </LocalizationProvider>

                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="contactinfo.phone"
                                label="Puhelin numero"
                                type="text"
                                id="phone"             
                                value={event.contactinfo.phone}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />


                            <TextField

                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                id="leader"
                                label="Johtaja"
                                name="event_meta.presenter"
                                autoFocus

                                value={event.event_meta.presenter}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            <h2> Osoite </h2>
                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="address.street"
                                label="Katu"
                                type="street"
                                id="street"
                                value={event.address.street}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />
                            
                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="address.city"
                                label="Kaupunki"
                                type="city"
                                id="city"
                                value={event.address.city}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />
                            
                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="address.state"
                                label="Maakunta"
                                type="state"
                                id="state"
                                value={event.address.state}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            
                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="address.zipcode"
                                label="Postinumero"
                                type="zipcode"
                                id="zipcode"
                                value={event.address.zipcode}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="address.country"
                                label="Maa"
                                type="country"
                                id="country"
                                value={event.address.country}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />
                            
                            <h2> koordinaatit pitäis nappaa</h2>

                            
                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="event_meta.speaker"
                                label="Puhuja"
                                type="text"
                                id="speaker"
                                value={event.event_meta.speaker}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="event_meta.music"
                                label="Ylistys"
                                type="text"
                                id="music"    
                                value={event.event_meta.music}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            <TextField
                                color='info'
                                margin="normal"
                                required
                                fullWidth
                                name="event_page_url"
                                label="Linkki"
                                type="url"
                                id="page-url"    
                                value={event.event_page_url}
                                onChange={handleFieldChange} // Handle input changes and update title property
                              />

                            <div className='drag-container'>
                                <h3>Lataa kuva tapahtumasta</h3>
                                <DragDropFiles />
                            </div>
                           
                                          
                            <Button
                                type="submit"
                                color="primary"
                                fullWidth
                                variant="contained"
                                
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Luo tapahtuma
                            </Button>
                            
                        </Box>
                    </div>
                </Container>
            </main>
        </>
    )
}