import {
    productionEndpoint,
    testEnvEndpoint,
    MAIN_ENDPOINT,
    TEST_ENDPOINT,
    LOCAL_ENDPOINT,
    endpointMode
} from '../../config';

function getEndpoint(): string {
    let endpoint = '';
    if (endpointMode === productionEndpoint) {
        endpoint = MAIN_ENDPOINT;
    } else if (endpointMode === testEnvEndpoint) {
        endpoint = TEST_ENDPOINT;
    } else {
        endpoint = LOCAL_ENDPOINT;
    }
    return endpoint;
}

export default getEndpoint;
