import { Button, Modal, Paper } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import EventTable from "../assets/components/EventTable";


export default function Events() {
    const { organization_id } = useParams() // We take org_id from URL so that you can always come back to organization with link
    console.log(organization_id)

    // Nyt pitää luoda useQuery hookki jolla haetaan organizaation tapahtumat tähän sivulle.
    // voidaa kopsaa se käytännös clientin puolelta
    // const { data } = useGetEvents({organization_id: organization_id})

    const [modalOpen, setModalOpen] = useState(false)

    return (

        <main className="w-full m-auto mb-6 text-center">
            <section className="pt-6">
                <h2 className="text-center p-2">Tapahtumat listattuna tähän</h2>
            </section>
            <section className="pt-6">
                <Button onClick={() => setModalOpen(true)} color='info' variant='contained'><h3>Luo uusi tapahtuma </h3></Button>
                
                <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="flex justify-center h-full">
                    <Paper elevation={3} className="m-auto p-6">
                        <h2>Luo uusi tapahtuma</h2>
                        <p>Laitetaan tähän tapahtuman luonti sivu popup modaalina eikä omana sivunaan 
                            <br/> on sitte helpompaa käyttää samaa componenttia vaikka tapahtuman muokkaamiseen
                            <br/>
                            <br/> en importaa benkun tekemää create event komponenttia koska se heittää parhaillaan erroria niin etten saa buildattua dashboardia
                            </p>
                    </Paper>
                </Modal>
                
                
            </section>
            <section className="mr-32 ml-32 pt-6">
                <h4 className="text-center p-2">Tapahtuma lista...</h4>
                <EventTable />
            </section>
        </main>
    )
}