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

const updateProfileRequest = () => ({
  type: 'UPDATE_PROFILE_REQUEST'
});

const updateProfileSuccess = (data) => ({
  type: 'UPDATE_PROFILE_SUCCESS',
  data
});

const updateProfileFail = () => ({
  type: 'UPDATE_PROFILE_FAIL'
});

const updatePasswordRequest = () => ({
  type: 'UPDATE_PASSWORD_REQUEST'
});

const updatePasswordSuccess = (data) => ({
  type: 'UPDATE_PASSWORD_SUCCESS',
  data
});

const updatePasswordFail = () => ({
  type: 'UPDATE_PASSWORD_FAIL'
});

export const mutation = {
  getProfileRequest,
  getProfileSuccess,
  getProfileFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail
};
