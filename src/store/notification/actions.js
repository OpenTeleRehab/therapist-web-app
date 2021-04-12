import { mutation } from './mutations';

// Actions
export const openNotification = (title, message) => dispatch => {
  dispatch(mutation.openNotification());
};

export const closeNotification = (title, message) => dispatch => {
  dispatch(mutation.closeNotification());
};

export const showSuccessNotification = (title, message) => dispatch => {
  // ensure it is closed the previous notification
  dispatch(closeNotification);

  dispatch(mutation.setColor('success'));
  dispatch(mutation.setNotificationMessage(title, message));
  dispatch(openNotification());
};

export function showErrorNotification (title, message, messageParams = {}) {
  return (dispatch) => {
    // ensure it is closed the previous notification
    dispatch(closeNotification);

    dispatch(mutation.setColor('danger'));
    dispatch(mutation.setNotificationMessage(title, message, messageParams));
    dispatch(openNotification());
  };
}
