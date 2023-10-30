import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ERROR_BAD_RESPONSE, ERROR_DEFAULT, ERROR_NETWORK } from '../assets/constants';
import { useAppContext } from '../assets/context/appContext';
import { useLogin, useRegister } from '../assets/hooks/api-hooks/useAuthenticate';

function getErrorMessage(error: AxiosError): string {
    switch (error.code) {
        case 'ERR_NETWORK': // Network error
            return ERROR_NETWORK
        case 'ERR_BAD_RESPONSE': // server did not answer
            return ERROR_BAD_RESPONSE
        case 'ERR_BAD_REQUEST': // conflict
            return "Syöttämäsi sähköposti on jo rekisteröity. Kirjaudu sisään"
        default:
            return ERROR_DEFAULT
    }
}

export default function Register() {
    const appContext = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate: register, isLoading: isLoadingRegister, error: registerError, variables: registerVariables } = useRegister()
    const { mutate: login, isLoading: isLoadingLogin, error: loginError } = useLogin()
    const [isRegistered, setRegistered] = useState(false)

    const typedRegisterError = registerError ? registerError as AxiosError : undefined
    const typedLoginError = loginError ? loginError as AxiosError : undefined

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        register({
            first_name: formData.get('first_name')?.toString(),
            last_name: formData.get('last_name')?.toString(),
            email: formData.get('email')?.toString(),
            password: formData.get('password')?.toString()
        },
            {
                onSuccess() {
                    setRegistered(true)
                },
                onError(error) {
                    console.error(error)
                },
            })
    };

    const handleLogin = () => {
        const data = {
            email: registerVariables?.email,
            password: registerVariables?.password
        }
        login({
            email: data.email,
            password: data.password
        },
            {
                onSuccess(data) {
                    appContext.setUser(data)
                    sessionStorage.setItem('user_data', JSON.stringify(data))
                    location.state?.from ? navigate(location.state.from, { replace: true }) : navigate('/dashboard', { replace: true })
                }
            }
        )
    }

    const registerSuccessElement = (
        <>
            <h2 className='text-center mt-6'>Hei, {registerVariables?.first_name} rekisteröinti onnistui</h2>
            <div className='m-4 text-error-main text-center'>
                {
                    typedLoginError
                        ? <p>{getErrorMessage(typedLoginError)}</p>
                        : undefined
                }
            </div>
            <Button variant='contained' fullWidth onClick={handleLogin}>
                {isLoadingLogin ? <CircularProgress color='info' /> : "Kirjaudu sisään"}
            </Button>
        </>
    )
    const registerElement = (
        <>
            <div className='m-4 text-error-main text-center'>
                {
                    typedRegisterError
                        ? <p>{getErrorMessage(typedRegisterError)}</p>
                        : undefined
                }
            </div>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container gap={2}>
                    <Grid item xs>
                        <TextField
                            color='info'
                            autoComplete="given-name"
                            name="first_name"
                            required
                            fullWidth
                            id="first_name"
                            label="First Name"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            color='info'
                            required
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            autoComplete="family-name"
                        />
                    </Grid>
                </Grid>
                <TextField
                    color='info'
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Sähköposti"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    color='info'
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Salasana"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size='large'
                    sx={{ mt: 3, mb: 2 }}
                >
                    {isLoadingRegister ? <CircularProgress color='info' /> : "Rekisteröidy"}
                </Button>
                <div className='text-center'>
                    <Link to="/login" replace className='text-info-main'>
                        Onko jo tili olemassa? Kirjaudu sisään.
                    </Link>
                </div>
            </Box>
        </>
    )

    return (
        <main>
            <Container component="section" maxWidth="xs" className='mt-6'>
                <div className='flex flex-col items-center p-2'>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.dark' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    {isRegistered ? registerSuccessElement : registerElement}
                </div>
            </Container>
        </main>
    );
}