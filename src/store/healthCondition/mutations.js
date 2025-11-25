const getHealthConditionsRequest = () => ({
  type: 'GET_HEALTH_CONDITIONS_REQUEST'
});

const getHealthConditionsSuccess = (data) => ({
  type: 'GET_HEALTH_CONDITIONS_SUCCESS',
  data
});

const getHealthConditionsFail = () => ({
  type: 'GET_HEALTH_CONDITIONS_FAIL'
});

export const mutation = {
  getHealthConditionsRequest,
  getHealthConditionsFail,
  getHealthConditionsSuccess
};
