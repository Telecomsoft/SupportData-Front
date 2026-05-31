import {endpointMode, productionEndpoint, WEB_SOCKET_ENDPOINT_LOCAL, WEB_SOCKET_ENDPOINT_PRODUCTION} from "../../config";

export const getWebSocketEndpoint = () : string => {
    let endpoint;
    if (endpointMode === productionEndpoint) {
        endpoint = WEB_SOCKET_ENDPOINT_PRODUCTION
    } else {
        endpoint = WEB_SOCKET_ENDPOINT_LOCAL
    }

    return endpoint
}