import axios from 'utils/admin-axios';
const getTherapistAndMaxSms = orgName => {
  const params = { org_name: orgName };
  return axios.get('/org/org-therapist-and-max_sms', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Organization = {
  getTherapistAndMaxSms
};
