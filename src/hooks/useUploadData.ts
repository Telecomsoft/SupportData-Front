import getEndpoint from '@src/utility/getEndPoint'
import axios, { AxiosResponse } from 'axios'
import { useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export default function useUploadData(
    endpoint: string,
    isAborted?: boolean
): { mutation: UseMutationResult<AxiosResponse<any>, Error, FormData, unknown>; progress: number; controller: AbortController } {
    const controller = useMemo(() => {
        return new AbortController()
    }, [isAborted])
    
    const [progress, setProgress] = useState<number>(0)
    
    const config = {
        headers: {
            Authorization: 'Bearer ' + Cookies.get('auth_token'),
            'Content-Type': 'multipart/form-data',
        },
    }
    
    const mutation = useMutation<AxiosResponse<any>, Error, FormData>({
        mutationKey: ['upload-data'],
        mutationFn: (data: FormData) =>
            axios.post(getEndpoint() + endpoint, data, {
                ...config,
                onUploadProgress: (progressEvent) => {
                    setProgress((progressEvent.loaded * 100) / progressEvent.total!)
                },
                signal: controller.signal,
            }),
        retry: 2,
    })
    
    return { mutation, progress, controller }
}
