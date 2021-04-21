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

const activateDeactivateRequest = () => ({
  type: 'ACTIVATE_DEACTIVATE_REQUEST'
});

const activateDeactivateSuccess = () => ({
  type: 'ACTIVATE_DEACTIVATE_SUCCESS'
});

const activateDeactivateFail = () => ({
  type: 'ACTIVATE_DEACTIVATE_FAIL'
});

const deleteRequest = () => ({
  type: 'DELETE_REQUEST'
});

const deleteSuccess = () => ({
  type: 'DELETE_SUCCESS'
});

const deleteFail = () => ({
  type: 'DELETE_FAIL'
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
  updateUserFail,
  activateDeactivateRequest,
  activateDeactivateSuccess,
  activateDeactivateFail,
  deleteRequest,
  deleteSuccess,
  deleteFail
};
