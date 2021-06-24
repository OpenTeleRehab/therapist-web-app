const getPublishPrivacyPolicyRequest = () => ({
  type: 'GET_PUBLISH_PRIVACY_POLICY_REQUEST'
});

const getPublishPrivacyPolicySuccess = (data) => ({
  type: 'GET_PUBLISH_PRIVACY_POLICY_SUCCESS',
  data
});

const getPublishPrivacyPolicyFail = () => ({
  type: 'GET_PUBLISH_PRIVACY_POLICY_FAIL'
});

export const mutation = {
  getPublishPrivacyPolicyRequest,
  getPublishPrivacyPolicySuccess,
  getPublishPrivacyPolicyFail
};
