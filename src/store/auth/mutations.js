const getProfileRequest = () => ({
  type: 'GET_PROFILE_REQUEST'
});

const getProfileSuccess = (data) => ({
  type: 'GET_PROFILE_SUCCESS',
  data
});

const getProfileFail = () => ({
  type: 'GET_PROFILE_FAIL'
});

export const mutation = {
  getProfileRequest,
  getProfileSuccess,
  getProfileFail
};
