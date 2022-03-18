const getColorSchemeRequest = () => ({
  type: 'GET_COLOR_SCHEME_REQUEST'
});

const getColorSchemeSuccess = (data) => ({
  type: 'GET_COLOR_SCHEME_SUCCESS',
  data
});

const getColorSchemeFail = () => ({
  type: 'GET_COLOR_SCHEME_FAIL'
});

export const mutation = {
  getColorSchemeRequest,
  getColorSchemeSuccess,
  getColorSchemeFail
};
