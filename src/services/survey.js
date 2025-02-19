import adminAxios from 'utils/admin-axios';
import axios from 'utils/axios';

const submitSurvey = payload => {
  return axios.post('/survey/submit', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const skipSurvey = payload => {
  return axios.post('/survey/skip', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPublishSurvey = (payload) => {
  return adminAxios.get('/get-publish-survey', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Survey = {
  getPublishSurvey,
  submitSurvey,
  skipSurvey
};
