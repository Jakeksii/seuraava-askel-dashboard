import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../assets/context/appContext";
import useDetailedOrganizations from "../assets/hooks/api-hooks/useDetailedOrganisations";

export default function Dasboard() {
    const { organization_id } = useParams() // We take org_id from URL so that you can always come back to organization with link
    const appContext = useAppContext()
    const { data } = useDetailedOrganizations({ organization_id: organization_id ?? "", token: appContext.user?.token ?? "" })

    return (
        <main className="w-full m-auto mb-6 text-center">
            <section className="pt-6">
                <p>Tähän vois laittaa joskus jonkun hienon lyhyen analytiikka previewin ja vaikka seurakunnan kuvan. 
                    <br/> kuvaa ei välttis viellä ole ellei oo luonu organization pagea
                    <br/> tähän haettu data sisältää vaan organizaation tiedot, esim sijainnin:
                    <br/> {JSON.stringify(data?.address)}
                    <br/> pitäs hakee backendistä organizaatio page jos haluu kuvan
                </p>
                
            </section>
            <section className="pt-6 flex flex-col w-fit m-auto justify-center gap-2">
                <Button color='info' variant='contained' component={Link} to={"/" + organization_id + "/events"}><h3>Tapahtumat</h3></Button>
                <Button color='info' variant='contained' component={Link} to={"/" + organization_id + "/organization"}><h3>Kotisivut</h3></Button>
                <Button color='info' variant='contained' component={Link} to={"/" + organization_id + "/organization"}><h3>Organisaatio</h3></Button>
                <Button color='info' variant='contained' component={Link} to={"/" + organization_id + "/analytics"}><h3>Analytiikka</h3></Button>
                <Button color='info' variant='contained' component={Link} to={"/" + organization_id + "/subscription"}><h3>Tiimi & Tilaus</h3></Button>
                <br />
                <Button color='info' variant='outlined' component={Link} to="/"><h3>Vaihda seurakuntaasi</h3></Button>
            </section>
        </main>
    )
}