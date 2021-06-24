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

const getDefinedCountriesRequest = () => ({
  type: 'GET_DEFINED_COUNTRIES_REQUEST'
});

const getDefinedCountriesSuccess = (data) => ({
  type: 'GET_DEFINED_COUNTRIES_SUCCESS',
  data
});

const getDefinedCountriesFail = () => ({
  type: 'GET_DEFINED_COUNTRIES_FAIL'
});

export const mutation = {
  getCountriesFail,
  getCountriesRequest,
  getCountriesSuccess,
  getDefinedCountriesRequest,
  getDefinedCountriesSuccess,
  getDefinedCountriesFail
};
