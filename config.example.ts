// First time on a machine: copy this file to config.ts (config.ts is git-ignored, it holds this machine's addresses).
//
//   productionEndpoint : the API is on the same address as the app (what the server uses; `npm run dev` forwards /api
//                        to the backend, see the proxy in vite.config.ts: default http://localhost:5276)
//   testEnvEndpoint   : the test server below
//   localEndpoint      : the API at LOCAL_ENDPOINT below (needs the backend's AllowedOrigins to include this app)
export const productionEndpoint: string = 'productionEndpoint';
export const testEnvEndpoint: string = 'testEnvEndpoint';
export const localEndpoint: string = 'localEndpoint';

export const endpointMode: string = productionEndpoint;

let dynamicUrl = ''
if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    dynamicUrl = url.origin + '/';
}
let dynamicWebSocketUrl = ''
if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    dynamicWebSocketUrl = `ws://${url.hostname}:8080/`
}

export const MAIN_ENDPOINT: string = dynamicUrl;
export const TEST_ENDPOINT: string = 'http://localhost:5276/';
export const LOCAL_ENDPOINT: string = 'http://localhost:5276/';

export const WEB_SOCKET_ENDPOINT_LOCAL = 'ws://localhost:8090/'
export const WEB_SOCKET_ENDPOINT_PRODUCTION = dynamicWebSocketUrl;
