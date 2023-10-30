import { CircularProgress } from '@mui/material'
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ThemeProvider from './Theme'
import MainNav from './assets/components/MainNav'
import { useAppContext } from './assets/context/appContext'

// Pages
import Header from './assets/components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
const ChooseOrganization = lazy(() => import('./pages/ChooseOrganization'))
const CreateOrganization = lazy(() => import('./pages/CreateOrganization'))
const Dasboard = lazy(() => import('./pages/Dashboard'))

const Events = lazy(() => import('./pages/Events'))
const Organization = lazy(() => import('./pages/Organization'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Subscription = lazy(() => import('./pages/Subscription'))

const loading = (
  <div className='h-[100vh] m-auto flex justify-center items-center text-white'>
    <CircularProgress color="inherit" size={50} />
  </div>
)

function App() {
  const appContext = useAppContext()
  const isAuthenticated = appContext.user ? true : false

  // If we are not authenticated we have only login and register page available
  return (
    <ThemeProvider>
      <Header text={appContext.organization?.name ?? "Seuraava askel"}/>
      <Routes>
        {
          isAuthenticated
            ? (
              <>
                <Route path='/' element={<Suspense fallback={loading}><ChooseOrganization /></Suspense>} />
                <Route path='/create' element={<Suspense fallback={loading}><CreateOrganization /></Suspense>} />
                <Route path='/:organization_id' element={<Suspense fallback={loading}><Dasboard /></Suspense>} />
                <Route path='/:organization_id/events' element={<Suspense fallback={loading}><Events /></Suspense>} />
                <Route path='/:organization_id/organization' element={<Suspense fallback={loading}><Organization /></Suspense>} />
                <Route path='/:organization_id/analytics' element={<Suspense fallback={loading}><Analytics /></Suspense>} />
                <Route path='/:organization_id/subscription' element={<Suspense fallback={loading}><Subscription /></Suspense>} />
                <Route path='*' element={<Navigate to="/" />} />
              </>
            )
            : (
              <>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<Navigate to="/" />} />
              </>
            )
        }
      </Routes>
      {isAuthenticated && <MainNav />}
    </ThemeProvider>
  )
}
export default App
