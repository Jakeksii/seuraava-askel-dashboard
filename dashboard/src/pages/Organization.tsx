import { useParams } from "react-router-dom";
import OrganizationPreview from "../assets/components/OrganizationPreview";
import { useAppContext } from "../assets/context/appContext";
import useDetailedOrganizations from "../assets/hooks/api-hooks/useDetailedOrganisations";

export default function Organization() {
  // we use these 3 const on every page. we always want to display fresh data.
  const { organization_id } = useParams()
  const { user } = useAppContext()
  const { data } = useDetailedOrganizations({ organization_id: organization_id ?? "", token: user?.token ?? "" })

  return (
    <main className="w-full m-auto mt-6 text-center">
      <OrganizationPreview
        name={data?.name} />
    </main>
  )
}