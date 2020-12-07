const createUserRequest = () => ({
  type: 'CREATE_USER_REQUEST'
});

const createUserSuccess = () => ({
  type: 'CREATE_USER_SUCCESS'
});

const createUserFail = () => ({
  type: 'CREATE_USER_FAIL'
});

const getUsersRequest = () => ({
  type: 'GET_USERS_REQUEST'
});

const getUsersSuccess = (data, filters) => ({
  type: 'GET_USERS_SUCCESS',
  data,
  filters
});

const getUsersFail = () => ({
  type: 'GET_USERS_FAIL'
});

const updateUserRequest = () => ({
  type: 'UPDATE_USER_REQUEST'
});

const updateUserSuccess = () => ({
  type: 'UPDATE_USER_SUCCESS'
});

const updateUserFail = () => ({
  type: 'UPDATE_USER_FAIL'
});

export const mutation = {
  createUserRequest,
  createUserSuccess,
  createUserFail,
  getUsersRequest,
  getUsersSuccess,
  getUsersFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail
};
