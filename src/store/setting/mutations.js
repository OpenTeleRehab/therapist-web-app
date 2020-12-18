const getLanguagesRequest = () => ({
  type: 'GET_LANGUAGES_REQUEST'
});

const getLanguagesSuccess = (data) => ({
  type: 'GET_LANGUAGES_SUCCESS',
  data
});

const getLanguagesFail = () => ({
  type: 'GET_LANGUAGES_FAIL'
});

export const mutation = {
  getLanguagesRequest,
  getLanguagesSuccess,
  getLanguagesFail
};
