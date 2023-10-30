import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';
import { ERROR_DEFAULT } from "../constants";
import { useAppContext } from "../context/appContext";
import useDetailedOrganizations from "../hooks/api-hooks/useDetailedOrganisations";


export default function OrganizationUsers() {
    const { organization_id } = useParams() // We take org_id from URL so that you can always come back to organization with link
    const appContext = useAppContext()
    const { data, isLoading, isError } = useDetailedOrganizations({ organization_id: organization_id ?? "", token: appContext.user?.token ?? "" })

    if (isLoading) {
        return <CircularProgress color='info' />
    }

    if (isError) {
        return <p>{ERROR_DEFAULT}</p>
    }

    return (
        <section>
            <h3>Organisaation käyttäjät</h3>
            <ul>
                {data?.organization_users.map((user, index) => (
                    <li key={index}> {user.user_name} | {user.user_email} | {user.role}</li>
                ))}
            </ul>
        </section>
    )
}

