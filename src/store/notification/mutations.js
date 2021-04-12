const setNotificationMessage = (title, message, messageParams) => ({
  type: 'SET_NOTIFICATION_MESSAGE',
  title,
  message,
  messageParams
});

const openNotification = () => ({
  type: 'OPEN_NOTIFICATION'
});

const closeNotification = () => ({
  type: 'CLOSE_NOTIFICATION'
});

const setColor = (color) => ({
  type: 'SET_TYPE',
  color
});

export const mutation = {
  setNotificationMessage,
  openNotification,
  closeNotification,
  setColor
};
