export const REACT_APP_VERSION = '1.0.3';

let REACT_APP_API_URL:any;

if (process.env.NODE_ENV === 'production') {
    REACT_APP_API_URL = `${window.location.protocol}//${window.location.hostname}:8190`;
} else {
    // Development Configuration
    const isMobileDev = process.env.REACT_APP_MOBILE_DEV === 'true';
    const devBaseUrl = isMobileDev ? 'http://192.168.56.1:8000' : 'http://127.0.0.1:3333';
    REACT_APP_API_URL = `${devBaseUrl}`;
}

export { REACT_APP_API_URL };
