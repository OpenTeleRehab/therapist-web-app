const getHealthConditionGroupsRequest = () => ({
  type: 'GET_HEALTH_CONDITION_GROUPS_REQUEST'
});

const getHealthConditionGroupsSuccess = (data) => ({
  type: 'GET_HEALTH_CONDITION_GROUPS_SUCCESS',
  data
});

const getHealthConditionGroupsFail = () => ({
  type: 'GET_HEALTH_CONDITION_GROUPS_FAIL'
});

export const mutation = {
  getHealthConditionGroupsRequest,
  getHealthConditionGroupsFail,
  getHealthConditionGroupsSuccess
};
