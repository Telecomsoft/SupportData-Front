import axios from 'axios'
import { logout } from '@utility/session'

let installed = false

/**
 * The server answers HTTP 401 when the token is missing, expired (it lives 1 day, the login cookie 15) or invalid.
 * Without this the user stays on a screen that fails to load anything; now they go back to the login page.
 * Business errors ("no permission", "not enough stock") are HTTP 200 with { error != 0 } and stay with each screen.
 */
export const setupAxios = () => {
    if (installed) return
    installed = true

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            const isLoginCall = String(error?.config?.url ?? '').includes('api/Base/Login')
            if (error?.response?.status === 401 && !isLoginCall && window.location.pathname !== '/') logout()
            return Promise.reject(error)
        }
    )
}
