import axios from 'utils/admin-axios';

const getClinics = (countryId) => {
  const params = { country_id: countryId };
  return axios.get('/clinic', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Clinic = {
  getClinics
};
