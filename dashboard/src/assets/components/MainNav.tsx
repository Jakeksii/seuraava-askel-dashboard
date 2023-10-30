import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Drawer, Fab } from "@mui/material";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

export default function MainNav() {

  const appContext = useAppContext()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  //const organization_id = appContext.organization?._id
  const organization_id = appContext.organization?._id
  const nav = (
    organization_id
      ? <nav className="h-[100%] p-5 flex flex-col justify-center gap-2">
        <Button color='info' variant='contained' fullWidth component={Link} to={"/"+organization_id}><p>Ohjauspaneeli</p></Button>
        <Button color='info' variant='contained' fullWidth component={Link} to={"/"+organization_id+"/events"}><p>Tapahtumat</p></Button>
        <Button color='info' variant='contained' fullWidth component={Link} to={"/"+organization_id+"/organization"}><p>Seurakunta</p></Button>
        <Button color='info' variant='contained' fullWidth component={Link} to={"/"+organization_id+"/analytics"}><p>Analytiikka</p></Button>
        <Button color='info' variant='contained' fullWidth component={Link} to={"/"+organization_id+"/subscription"}><p>Tiimi & Tilaus</p></Button>
        <br />
        <Button color='info' variant='outlined' fullWidth component={Link} to="/"><p>Vaihda seurakuntaasi</p></Button>
        <Button color='info' variant='text' component={Link} to="/" onClick={() => { appContext.logOut() }}><p>Kirjaudu ulos</p></Button>
      </nav>
      : <nav className="h-[100%] p-5 flex flex-col justify-center gap-2">
        <Button color='info' variant='contained' fullWidth disabled aria-disabled><p>Ohjauspaneeli</p></Button>
        <Button color='info' variant='contained' fullWidth disabled aria-disabled><p>Tapahtumat</p></Button>
        <Button color='info' variant='contained' fullWidth disabled aria-disabled><p>Seurakunta</p></Button>
        <Button color='info' variant='contained' fullWidth disabled aria-disabled><p>Analytiikka</p></Button>
        <Button color='info' variant='contained' fullWidth disabled aria-disabled><p>Tiimi & Tilaus</p></Button>
        <br />
        <Button color='info' variant='outlined' fullWidth component={Link} to="/"><p>Valitse hallittava seurakunta</p></Button>
        <Button color='info' variant='text' component={Link} to="/" onClick={() => { appContext.logOut() }}><p>Kirjaudu ulos</p></Button>
      </nav>
  )

  return (
    <div>
      <Drawer
        anchor={'left'}
        open={drawerOpen}
        onClose={closeDrawer}
        
      >
        <section className='h-[100%] flex flex-col bg-secondary-main'>
          {nav}
          <div className=' self-center mb-10'>
            <Fab color='primary' aria-label="menu-close" onClick={() => setDrawerOpen(false)} >
              <CloseIcon />
            </Fab>
          </div>
        </section>
      </Drawer>
      <div className='fixed bottom-5 left-5 md:bottom-10 md:left-10'>
        <Fab color='primary' aria-label="menu-open" onClick={() => setDrawerOpen(true)} >
          <MenuIcon />
        </Fab>
      </div>
    </div>
  )
}