const setWebsocketConnectionSuccess = (data) => ({
  type: 'SET_WEBSOCKET_CONNECTION_SUCCESS',
  data
});

const setHasStartedCallSuccess = (data) => ({
  type: 'SET_HAS_STARTED_CALL_SUCCESS',
  data
});

const setHasAcceptedCallSuccess = (data) => ({
  type: 'SET_HAS_ACCEPTED_CALL_SUCCESS',
  data
});

const showIncomingCallSuccess = (data) => ({
  type: 'SHOW_INCOMING_CALL_SUCCESS',
  data
});

const showAcceptedCallSuccess = (data) => ({
  type: 'SHOW_ACCEPTED_CALL_SUCCESS',
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

const sendAttachmentMessagesSuccess = () => ({
  type: 'SEND_ATTACHMENT_MESSAGES_SUCCESS'
});

const sendAttachmentMessagesFail = () => ({
  type: 'SEND_ATTACHMENT_MESSAGES_FAIL'
});

const updateVideoCallSuccess = (data) => ({
  type: 'UPDATE_VIDEO_CALL_STATUS_SUCCESS',
  data
});

const removeVideoCallSuccess = () => ({
  type: 'REMOVE_VIDEO_CALL_STATUS_SUCCESS'
});

const getCallAccessTokenSuccess = (data) => ({
  type: 'GET_CALL_ACCESS_TOKEN_SUCCESS',
  data
});

const getCallAccessTokenFail = () => ({
  type: 'GET_CALL_ACCESS_TOKEN_FAIL'
});

export const mutation = {
  setWebsocketConnectionSuccess,
  setHasStartedCallSuccess,
  setHasAcceptedCallSuccess,
  showIncomingCallSuccess,
  showAcceptedCallSuccess,
  chatUserLoginSuccess,
  setChatSubscribeIdsSuccess,
  getChatRoomsSuccess,
  getChatRoomsFail,
  selectRoomSuccess,
  updateUnreadSuccess,
  getMessagesForSelectedRoomSuccess,
  appendNewMessageSuccess,
  updateLastMessageSuccess,
  setIsOnChatPageSuccess,
  updateChatUserStatusSuccess,
  sendAttachmentMessagesSuccess,
  sendAttachmentMessagesFail,
  updateVideoCallSuccess,
  removeVideoCallSuccess,
  getCallAccessTokenSuccess,
  getCallAccessTokenFail
};
