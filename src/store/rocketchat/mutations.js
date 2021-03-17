const updateChatAuthTokenSuccess = (data) => ({
  type: 'UPDATE_CHAT_AUTO_TOKEN_SUCCESS',
  data
});

const getMessageSuccess = (data) => ({
  type: 'GET_MESSAGE_SUCCESS',
  data
});

const selectPatientSuccess = (data) => ({
  type: 'SELECT_PATIENT_SUCCESS',
  data
});

export const mutation = {
  updateChatAuthTokenSuccess,
  getMessageSuccess,
  selectPatientSuccess
};
