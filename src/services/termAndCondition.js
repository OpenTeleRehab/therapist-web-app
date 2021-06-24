import axios from 'utils/admin-axios';

const getPublishTermConditionPage = id => {
  return axios.get('/user-term-condition')
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
