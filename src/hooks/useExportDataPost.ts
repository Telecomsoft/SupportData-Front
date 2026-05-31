import axios from 'axios'
import Cookies from 'js-cookie'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import getEndpoint from '@utility/getEndPoint'

export default function useExportDataPost(endpoint: string): UseMutationResult {
    const authToken = Cookies.get('auth_token')

    const config = {
        headers: {
            Authorization: 'Bearer ' + authToken,
            'Content-Type': 'application/json; charset=utf-8',
        },
    }

    return useMutation({
        mutationKey: ['export'],
        mutationFn: (data: any) =>
            axios.post(getEndpoint() + endpoint, data, {
                ...config,
                responseType: 'arraybuffer',
            }),
    })
}
