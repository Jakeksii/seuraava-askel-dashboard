import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import DragDropFiles from '../assets/components/DragDropFiles';
import { useAppContext } from '../assets/context/appContext';
import { SendOrganization } from '../assets/types';

export default function CreateOrganization() {
    // LAITA NÄÄ STATET YHTEEN STATE OBJEKTIIN { ... }
    const [nomination, setNomination] = useState('');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [leader, setLeader] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [country, setCountry] = useState("");
    const [businessId, setBusinessId] = useState("");


    // const [coordinates, setCoordinates] = useState([0, 0])
    // Set coordinates to be [0,0] for now. In handleSubmit just hardvalues for now

    const { user } = useAppContext()
    // Get current user and send it as organization owner

    const [contact_info_visible] = useState(true)
    // const [visible, setVisible] = useState(true)
    // Send Contact info visible and visible as true for now



    // TODO:
    // Make state for organization
    // Update info in to state
    // Send state to backend
    // Recieve data in backend
    // create a new organization to db
    // respond with alls gucci


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const token = user?.token

        // test
        console.log(nomination)

        // Compile to the organization type
        const newOrganization: SendOrganization = {
            address: {
                street: street,
                city: city,
                state: state,
                zipcode: zipcode,
                country: country,
                coordinates: [12.34, 56.78]
            },
            contact_info: {
                email: email,
                phone: phone
            },
            name: name,
            business_id: businessId,
            contact_info_visible: contact_info_visible,
        };

        console.log(user?.token)


        // send to backend
        const response = await fetch("api/organizations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(newOrganization)
        })
        const json = await response.json()

        console.log("this comes through", json)

    };


    return (
        <main>
            <Container component="section" maxWidth="xs" className='mt-6'>
                <div className='flex flex-col items-center p-2'>
                    <Box component="form" onSubmit={handleSubmit}>

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Seurakunnan nimi"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="nomination"
                            label="Kirkkokunta"
                            type="text"
                            id="nomination"
                            value={nomination}
                            onChange={(e) => setNomination(e.target.value)}

                        />

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Sähköposti"
                            type='email'
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="phone-number"
                            label="Puhelin numero"
                            type="text"
                            id="phone-number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />


                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="leader"
                            label="Johtaja"
                            type="text"
                            id="leader"
                            value={leader}
                            onChange={(e) => setLeader(e.target.value)}
                        />

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="street"
                            label="Katu"
                            type="street"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="city"
                            label="Kaupunki"
                            type="city"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="state"
                            label="Maakunta"
                            type="state"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />


                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="zipcode"
                            label="Postinumero"
                            type="zipcode"
                            id="zipcode"
                            value={zipcode}
                            onChange={(e) => setZipcode(e.target.value)}
                        />

                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="country"
                            label="Maa"
                            type="country"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />

                        <h2> koordinaatit pitäis nappaa</h2>


                        <TextField
                            color='info'
                            margin="normal"
                            required
                            fullWidth
                            name="business-id"
                            label="Y-tunnus"
                            type="text"
                            id="business-id"
                            value={businessId}
                            onChange={(e) => setBusinessId(e.target.value)}
                        />

                        <div className='drag-container'>
                            <h3>Lataa kuva seurakunnasta</h3>
                            <DragDropFiles />
                        </div>


                        <Button
                            type="submit"
                            color="primary"
                            fullWidth
                            variant="contained"

                            sx={{ mt: 3, mb: 2 }}
                        >
                            Luo seurakunta
                        </Button>

                    </Box>
                </div>
            </Container>
        </main>
    )
}