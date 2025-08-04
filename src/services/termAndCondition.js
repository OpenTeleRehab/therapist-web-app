import axios from 'utils/admin-axios';

const getPublishTermConditionPage = payload => {
  return axios.get('/public/user-term-condition', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const TermAndCondition = {
  getPublishTermConditionPage
};
