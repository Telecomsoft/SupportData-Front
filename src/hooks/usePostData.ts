import {useGetAuthorizationConfig} from "./useGetAuthorizationConfig";
import axios from "axios";
import getEndpoint from "@utility/getEndPoint";
import {useMutation, UseMutationResult} from "@tanstack/react-query";

export const usePostData = <T, R = unknown>(
    endpoint: string,
    mutationKey: string = 'post-data'
): UseMutationResult<R, Error, T> => {
    const config = useGetAuthorizationConfig();

    return useMutation<R, Error, T>({
        mutationKey: [mutationKey],
        mutationFn: (data: T) =>
            axios.post<R>(getEndpoint() + endpoint, data, config).then(res => res.data)
    });
};