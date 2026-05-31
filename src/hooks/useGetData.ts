import { useGetAuthorizationConfig } from "./useGetAuthorizationConfig";
import axios from "axios";
import getEndPoint from "@utility/getEndPoint";
import { removeProperties } from "@utility/removeProperties";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

type QueryResult<T> = {
    error?: number;
    errorMessage?: string;
    value: T;
};

type CustomObject<T> = Omit<UseQueryOptions<QueryResult<T>, Error>, 'queryKey'> & {
    ids?: string[];
};

export const useGetData = <T>(
    endpoint: string,
    queryKey: string,
    options?: CustomObject<T>
): UseQueryResult<QueryResult<T>, Error> => {
    const config = useGetAuthorizationConfig();

    return useQuery(
        {
            queryKey: [queryKey, ...(options?.ids || [])],
            queryFn: (): Promise<QueryResult<T>> => axios.get(getEndPoint() + endpoint, config).then(res => res.data),
            refetchOnWindowFocus: false,
            staleTime: 0,
            refetchOnMount: true,
            ...(options ? removeProperties(options, ['ids']) : {}),
        }
    );
};
