import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import getEndPoint from '@utility/getEndPoint'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'

export type QueryResult<T> = { error?: number; errorMessage?: string; value: T }

/**
 * Like useGetData, but for the server's "search" endpoints, which are POST (a filter in the body).
 * The query re-runs whenever the body changes; the previous page stays on screen while the next one loads.
 */
export const usePostQuery = <T,>(endpoint: string, queryKey: string, body: unknown) => {
    const config = useGetAuthorizationConfig()
    return useQuery<QueryResult<T>, Error>({
        queryKey: [queryKey, body],
        queryFn: () => axios.post(getEndPoint() + endpoint, body, config).then((res) => res.data),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    })
}