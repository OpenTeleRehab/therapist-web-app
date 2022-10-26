import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';

const sendPodcastNotification = payload => {
  return axios.get('/push-notification', { params: payload, headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Firebase = {
  sendPodcastNotification
};
