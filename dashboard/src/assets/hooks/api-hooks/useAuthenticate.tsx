import axios from "axios";
import { useMutation } from "react-query";
import { User } from "../../types";

export function useLogin() {
    return useMutation({
        mutationFn: async (variables: {email?: string, password?: string}) => {
            const { data } = await axios.post('/api/auth/login', {email: variables.email, password: variables.password})
            return data as User
        }
    })
}
interface RegisterVariables {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
}
export function useRegister() {
    return useMutation({
        mutationFn: async (variables: RegisterVariables) => {
            const body = {
                first_name: variables.first_name,
                last_name: variables.last_name,
                email: variables.email,
                password: variables.password
            }
            // we dont need to destructure data from this function because api returns only status and no body
            await axios.post('/api/auth/register', body)
        },
    })
}