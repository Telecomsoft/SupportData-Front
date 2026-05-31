import axios from 'axios';
import getEndpoint from '@utility/getEndPoint';
import Cookies from 'js-cookie';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export function useDeleteData<T, R = unknown>(
    endpoint: string,
    mutationKey: string = 'delete-data'
): UseMutationResult<R, Error, T | undefined> {
    const authToken = Cookies.get('auth_token');

    return useMutation<R, Error, T | undefined>({
        mutationKey: [mutationKey],
        mutationFn: (data?: T) =>
            axios.delete<R>(getEndpoint() + endpoint, {
                headers: { Authorization: 'Bearer ' + authToken },
                ...(data ? { data } : {}),
            }).then(res => res.data),
    });
}
