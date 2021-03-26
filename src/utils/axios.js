import axios from 'axios';
import keycloak from './keycloak';

const HEADER_ACCEPT = 'Accept';
const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_AUTHORIZATION = 'Authorization';

const AUTHORIZATION_BEARER = 'Bearer';
const CONTENT_TYPE_JSON = 'application/json';
const TOKEN_VALIDITY = 450;

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let { token } = keycloak;
    config.headers = {
      [HEADER_ACCEPT]: CONTENT_TYPE_JSON,
      [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON
    };
    if (token) {
      try {
        const tokenRefreshed = await keycloak.updateToken(TOKEN_VALIDITY);
        if (tokenRefreshed) {
          axios.put(
            process.env.REACT_APP_API_BASE_URL + '/user/update-last-access',
            {},
            {
              headers: {
                [HEADER_ACCEPT]: CONTENT_TYPE_JSON,
                [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
                [HEADER_AUTHORIZATION]: `${AUTHORIZATION_BEARER} ${keycloak.token}`
              }
            }
          );
        }
        token = tokenRefreshed ? keycloak.token : token;
        config.headers = {
          ...config.headers,
          [HEADER_AUTHORIZATION]: `${AUTHORIZATION_BEARER} ${token}`
        };
      } catch (e) {
        keycloak.logout({ redirectUri: window.location.origin });
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;
