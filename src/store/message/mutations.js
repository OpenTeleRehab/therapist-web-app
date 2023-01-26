const getMessagesRequest = () => ({
  type: 'GET_MESSAGES_REQUEST'
});

const getMessagesSuccess = (data) => ({
  type: 'GET_MESSAGES_SUCCESS',
  data
});

const getMessagesFail = () => ({
  type: 'GET_MESSAGES_FAIL'
});

const getTherapistMessagesRequest = () => ({
  type: 'GET_THERAPIST_MESSAGES_REQUEST'
});

const getTherapistMessagesSuccess = (data) => ({
  type: 'GET_THERAPIST_MESSAGE_SUCCESS',
  data
});

const getTherapistMessagesFail = () => ({
  type: 'GET_THERAPIST_MESSAGE_FAIL'
});

const sendMessagesRequest = () => ({
  type: 'SEND_MESSAGES_REQUEST'
});

const sendMessagesSuccess = (data) => ({
  type: 'SEND_MESSAGES_SUCCESS',
  data
});

const sendMessagesFail = () => ({
  type: 'SEND_MESSAGES_FAIL'
});

export const mutation = {
  getMessagesFail,
  getMessagesRequest,
  getMessagesSuccess,
  sendMessagesRequest,
  sendMessagesSuccess,
  sendMessagesFail,
  getTherapistMessagesRequest,
  getTherapistMessagesSuccess,
  getTherapistMessagesFail
};
