import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from "@mui/material/CircularProgress";
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AxiosError } from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ERROR_BAD_RESPONSE, ERROR_DEFAULT, ERROR_NETWORK } from '../assets/constants';
import { useAppContext } from '../assets/context/appContext';
import { useLogin } from '../assets/hooks/api-hooks/useAuthenticate';

function getErrorMessage(error: AxiosError): string {
    switch (error.code) {
        case 'ERR_NETWORK': // Network error
            return ERROR_NETWORK
        case 'ERR_BAD_RESPONSE': // server did not answer
            return ERROR_BAD_RESPONSE
        default:
            return ERROR_DEFAULT
    }
}


export default function Login() {
    const appContext = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate, isLoading, error } = useLogin()
    const typedError = error as AxiosError

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        mutate({
            email: formData.get('email')?.toString(),
            password: formData.get('password')?.toString()
        },
            {
                onSuccess(data) {
                    // lisää organisaatio sessioStorageen
                    appContext.setUser(data)
                    sessionStorage.setItem('user_data', JSON.stringify(data))
                    location.state?.from ? navigate(location.state.from, { replace: true }) : navigate('/', { replace: true })
                    console.log(data)
                },
            }
        )
    };

    return (
        <main>
            <Container component="section" maxWidth="xs" className='mt-6'>
                <div className='flex flex-col items-center p-2'>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.dark' }}>
                        <LockOutlinedIcon />
                    </Avatar >
                    <div className='m-4 text-error-main text-center'>
                        {
                            typedError
                                ? <p>{getErrorMessage(typedError)}</p>
                                : undefined
                        }
                    </div>
                    <Box component="form" onSubmit={handleSubmit}>
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="info" />}
                            label="Muista minut"
                        />
                        <Button
                            type="submit"
                            color="primary"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading ? <CircularProgress size={'26px'} color='info' /> : <p>Kirjaudu sisään</p>}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="#" className='text-info-main'>
                                    Unohtuiko salasana?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/register" className='text-info-main'>
                                    {"Ei tiliä? Rekisteröidy."}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </Container>
        </main>
    );
}