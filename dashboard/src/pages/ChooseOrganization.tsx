import { Button } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../assets/context/appContext";

export default function CreateOrganization() {
  const { user, organization, setOrganization } = useAppContext()
  const organization_list = user?.user?.organizations
  const navigate = useNavigate();

  // CLEAR ORGANIZATION once page is loaded
  useEffect(() => {
    setOrganization({})
  }, [])


  function chooseOrganization(index: number) {
    if (organization_list === undefined) return // if organization list is empty we wont run this func

    const _id = organization_list[index].organization_id
    const name = organization_list[index].organization_name

    // we save choosed organization _id and name to appContext so we can use it across our app.
    // we wont store organization data in appContext because we use useQuery that stores organization data and handles data caching.
    setOrganization({
      ...organization,
      _id: _id,
      name: name
    })

    navigate("/" + _id) // We navigate to organization dashboard, "domain.fi/organization_id"
  }

  return (
    <main className="w-full m-auto mb-6 text-center">
      <section className='pt-6 text-white'>
        <h2>Valitse Seurakunta</h2>
      </section>
      <section className='pt-6'>
        <List
          dense
          sx={{ width: 'fit-content', margin: 'auto' }}>
          {organization_list?.map((value, index) => {
            return (
              <ListItem
                key={value.organization_id}
              >
                <Button color='info' fullWidth variant='contained' onClick={() => chooseOrganization(index)}><h3>{value.organization_name}</h3></Button>
              </ListItem>
            );
          })}
        </List>
      </section>
      <section className="pt-6 flex flex-col w-fit m-auto justify-center gap-2">
        <Button color='info' variant='outlined' component={Link} to="/create"><h3>Luo uusi seurakunta</h3></Button>
      </section>
      <section className="pt-6 flex flex-col w-fit m-auto justify-center gap-2">
        <h3><u>Kutsut</u></h3>
        <p>Tänne voisi listata kaikki käyttäjälle tulleet kutsut ja <br /> kutsujen viereen <u>Hyväksy</u> / <u>Hylkää</u> nappulat</p>
      </section>
    </main>
  )
}