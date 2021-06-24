const getPublishTermConditionRequest = () => ({
  type: 'GET_PUBLISH_TERM_CONDITION_REQUEST'
});

const getPublishTermConditionSuccess = (data) => ({
  type: 'GET_PUBLISH_TERM_CONDITION_SUCCESS',
  data
});

const getPublishTermConditionFail = () => ({
  type: 'GET_PUBLISH_TERM_CONDITION_FAIL'
});

export const mutation = {
  getPublishTermConditionRequest,
  getPublishTermConditionSuccess,
  getPublishTermConditionFail
};
