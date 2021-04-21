import axios from 'utils/admin-axios';

const getProfession = (countryId) => {
  const params = { country_id: countryId };
  return axios.get('/profession', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Profession = {
  getProfession
};
