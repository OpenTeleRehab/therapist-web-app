const setChatAuthTokenSuccess = (data) => ({
  type: 'SET_CHAT_AUTH_TOKEN_SUCCESS',
  data
});

const loadAllMessagesSuccess = (data) => ({
  type: 'LOAD_ALL_MESSAGES_SUCCESS',
  data
});

const prependNewMessageSuccess = (data) => ({
  type: 'PREPEND_NEW_MESSAGE_SUCCESS',
  data
});

const selectPatientSuccess = (data) => ({
  type: 'SELECT_PATIENT_SUCCESS',
  data
});

const loadLastMessageHistorySuccess = (data) => ({
  type: 'LOAD_LAST_MESSAGE_HISTORY',
  data
});

export const mutation = {
  setChatAuthTokenSuccess,
  loadAllMessagesSuccess,
  prependNewMessageSuccess,
  selectPatientSuccess,
  loadLastMessageHistorySuccess
};
