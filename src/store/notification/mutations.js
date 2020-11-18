const setNotificationMessage = (title, message) => ({
  type: 'SET_NOTIFICATION_MESSAGE',
  title,
  message
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
