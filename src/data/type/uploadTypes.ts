export type UploadResponse = {
    data: string;
    status: number;
    statusText: string;
    headers: {
        'content-type': string;
    };
    config: {
        transitional: {
            silentJSONParsing: boolean;
            forcedJSONParsing: boolean;
            clarifyTimeoutError: boolean;
        };
        adapter: string[];
        transformRequest: null[] | (null | undefined)[];
        transformResponse: null[] | (null | undefined)[];
        timeout: number;
        xsrfCookieName: string;
        xsrfHeaderName: string;
        maxContentLength: number;
        maxBodyLength: number;
        env: object;
        headers: {
            Accept: string;
            'Content-Type': string;
            Authorization: string;
        };
        signal: AbortSignal | null;
        method: string;
        url: string;
        data: object;
    };
    request: object;
};
