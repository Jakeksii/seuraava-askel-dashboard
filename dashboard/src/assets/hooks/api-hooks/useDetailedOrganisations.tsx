import axios from "axios";
import { useQuery } from "react-query";
import { Organization } from "../../types";

interface Props {
    organization_id: string,
    token: string
}

export default function useDetailedOrganizations(props: Props) {
    return useQuery({
        queryKey: ['detailedorganization', props.organization_id, props.token],
        staleTime: 1000 * 60,
        queryFn: async () => {
            // await wait(2000)        //loading testausta varten
            const  { data}  = await axios.get('/api/organizations/' + props.organization_id + "/detailed", {headers:{"Authorization":props.token}})
            return data as Organization         // ^tähän api url
        },
        onError(error){
            console.error("Error when fetching detailed organization: ", error)
        },
        onSuccess(data) {
            console.log("Succesfully fetched detailed organization: ", data)
        },
    })
}


