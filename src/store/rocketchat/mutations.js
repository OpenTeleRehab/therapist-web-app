const setWebsocketConnectionSuccess = (data) => ({
  type: 'SET_WEBSOCKET_CONNECTION_SUCCESS',
  data
});

const chatUserLoginSuccess = (data) => ({
  type: 'CHAT_USER_LOGIN_SUCCESS',
  data
});

const setChatSubscribeIdsSuccess = (data) => ({
  type: 'SET_CHAT_SUBSCRIBE_IDS_SUCCESS',
  data
});

const getChatRoomsSuccess = (data) => ({
  type: 'GET_CHAT_ROOMS_SUCCESS',
  data
});

const getChatRoomsFail = () => ({
  type: 'GET_CHAT_ROOMS_FAIL'
});

const getChatUsersStatusSuccess = (data) => ({
  type: 'GET_CHAT_USERS_STATUS_SUCCESS',
  data
});

const getChatUsersStatusFail = () => ({
  type: 'GET_CHAT_USERS_STATUS_FAIL'
});

const getLastMessagesSuccess = (data) => ({
  type: 'GET_LAST_MESSAGES_SUCCESS',
  data
});

const getLastMessagesFail = () => ({
  type: 'GET_LAST_MESSAGES_FAIL'
});

const selectRoomSuccess = (data) => ({
  type: 'SELECT_ROOM_SUCCESS',
  data
});

const updateUnreadSuccess = (data) => ({
  type: 'UPDATE_UNREAD_SUCCESS',
  data
});

const getMessagesForSelectedRoomSuccess = (data) => ({
  type: 'GET_MESSAGES_FOR_SELECTED_ROOM_SUCCESS',
  data
});

const getMessagesForSelectedRoomFail = () => ({
  type: 'GET_MESSAGES_FOR_SELECTED_ROOM_FAIL'
});

const appendNewMessageSuccess = (data) => ({
  type: 'APPEND_NEW_MESSAGE_SUCCESS',
  data
});

const updateLastMessageSuccess = (data) => ({
  type: 'UPDATE_LAST_MESSAGE_SUCCESS',
  data
});

const setIsOnChatPageSuccess = (data) => ({
  type: 'SET_IS_ON_CHAT_PAGE_SUCCESS',
  data
});

const updateChatUserStatusSuccess = (data) => ({
  type: 'UPDATE_CHAT_USER_STATUS_SUCCESS',
  data
});

export const mutation = {
  setWebsocketConnectionSuccess,
  chatUserLoginSuccess,
  setChatSubscribeIdsSuccess,
  getChatRoomsSuccess,
  getChatRoomsFail,
  getChatUsersStatusSuccess,
  getChatUsersStatusFail,
  getLastMessagesSuccess,
  getLastMessagesFail,
  selectRoomSuccess,
  updateUnreadSuccess,
  getMessagesForSelectedRoomSuccess,
  getMessagesForSelectedRoomFail,
  appendNewMessageSuccess,
  updateLastMessageSuccess,
  setIsOnChatPageSuccess,
  updateChatUserStatusSuccess
};
