import axios from 'utils/admin-axios';

const getColorScheme = () => {
  return axios.get('/color-scheme')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const colorScheme = {
  getColorScheme
};
