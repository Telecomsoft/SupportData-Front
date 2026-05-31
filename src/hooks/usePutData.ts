import { useGetAuthorizationConfig } from './useGetAuthorizationConfig'
import axios from 'axios'
import getEndpoint from '@utility/getEndPoint'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export const usePutData = <T, R = unknown>(
    endpoint: string,
    mutationKey: string = 'put-data'
): UseMutationResult<R, Error, T> => {
    const config = useGetAuthorizationConfig();
    return useMutation<R, Error, T>({
        mutationKey: [mutationKey],
        mutationFn: (data: T) => axios.put<R>(getEndpoint() + endpoint, data, config).then(res => res.data),
    });
}
