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
  return axios.get('survey/list/publish-survey', { params: payload })
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
