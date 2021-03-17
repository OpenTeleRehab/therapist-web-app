import { mutation } from './mutations';

export const updateChatAuthToken = payload => dispatch => {
  dispatch(mutation.updateChatAuthTokenSuccess(payload));
};

export const selectPatientToChat = payload => dispatch => {
  dispatch(mutation.selectPatientSuccess(payload));
};
