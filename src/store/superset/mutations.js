const getGuestTokenRequest = () => ({
  type: 'GET_GUEST_TOKEN_REQUEST'
});

const getGuestTokenSuccess = (data) => ({
  type: 'GET_GUEST_TOKEN_SUCCESS',
  data
});

const getGuestTokenFail = () => ({
  type: 'GET_GUEST_TOKEN_FAIL'
});

export const mutation = {
  getGuestTokenRequest,
  getGuestTokenSuccess,
  getGuestTokenFail
};
