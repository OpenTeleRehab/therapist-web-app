const getGuidancesRequest = () => ({
  type: 'GET_GUIDANCES_REQUEST'
});

const getGuidancesSuccess = (data) => ({
  type: 'GET_GUIDANCES_SUCCESS',
  data
});

const getGuidancesFail = () => ({
  type: 'GET_GUIDANCES_FAIL'
});

export const mutation = {
  getGuidancesRequest,
  getGuidancesSuccess,
  getGuidancesFail
};
