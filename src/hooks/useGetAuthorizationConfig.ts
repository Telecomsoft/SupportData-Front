import Cookies from "js-cookie";
import {useMemo} from "react";

export const useGetAuthorizationConfig = () => {
    const authToken = Cookies.get('auth_token')
    return useMemo(() => {
        return {
            headers: {
                "Authorization": "Bearer " + authToken,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }
    }, []);
}
