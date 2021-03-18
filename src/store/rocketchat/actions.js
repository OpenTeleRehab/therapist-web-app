import { mutation } from './mutations';

export const setChatAuthToken = payload => dispatch => {
  dispatch(mutation.setChatAuthTokenSuccess(payload));
};

export const selectPatientToChat = payload => dispatch => {
  dispatch(mutation.selectPatientSuccess(payload));
};

export const loadLastMessageHistory = payload => dispatch => {
  dispatch(mutation.loadLastMessageHistorySuccess(payload));
};

export const loadAllMessagesInRoom = payload => dispatch => {
  dispatch(mutation.loadAllMessagesSuccess(payload));
};

export const prependNewMessageInRoom = payload => dispatch => {
  dispatch(mutation.prependNewMessageSuccess(payload));
};
