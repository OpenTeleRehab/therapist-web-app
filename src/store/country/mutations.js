const getCountriesRequest = () => ({
  type: 'GET_COUNTRIES_REQUEST'
});

const getCountriesSuccess = (data) => ({
  type: 'GET_COUNTRIES_SUCCESS',
  data
});

const getCountriesFail = () => ({
  type: 'GET_COUNTRIES_FAIL'
});

export const mutation = {
  getCountriesFail,
  getCountriesRequest,
  getCountriesSuccess
};
