import { mutation } from './mutations';
import {
  showErrorNotification
} from 'store/notification/actions';
import { Message } from '../../services/message';

export const getMessages = (payload) => async dispatch => {
  dispatch(mutation.getMessagesRequest());
  const data = await Message.getMessages(payload);
  if (data.success) {
    dispatch(mutation.getMessagesSuccess(data.data));
  } else {
    dispatch(mutation.getMessagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getTherapistMessage = () => async dispatch => {
  dispatch(mutation.getTherapistMessagesRequest());
  const data = await Message.getTherapistMessage();
  if (data.success) {
    dispatch(mutation.getTherapistMessagesSuccess(data.data));
    return data.data;
  } else {
    dispatch(mutation.getTherapistMessagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const sendMessages = (payload) => async dispatch => {
  dispatch(mutation.sendMessagesRequest());
  const data = await Message.sendMessages(payload);
  if (data.success) {
    dispatch(getMessages({ patient_id: payload.patient_id }));
    dispatch(mutation.sendMessagesSuccess(data.data));
    return data;
  } else {
    dispatch(mutation.sendMessagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
