import Cookies from 'js-cookie'

/**
 * Everything Login.tsx stores for the logged-in user:
 *  - cookies: the token (read by the request hooks), user name, type and customer / personnel ids
 *  - localStorage: the permission list (about 4 KB, too big for a cookie)
 * One function removes all of it, so logout and an expired token behave the same.
 */
const COOKIES = ['auth_token', 'userName', 'userImage', 'userId', 'userType', 'customerID', 'personnelID']

export const clearSession = () => {
    COOKIES.forEach((name) => Cookies.remove(name, { path: '/' }))
    try {
        localStorage.removeItem('accessInfo')
    } catch {
        /* storage blocked: nothing to remove */
    }
}

/** Log out: clear the session and go to the login page. */
export const logout = () => {
    clearSession()
    window.location.href = '/'
}
