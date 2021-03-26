import { Rocketchat } from 'services/roketchat';
import { User } from 'services/user';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';

export const connectWebsocket = (payload) => (dispatch) => {
  dispatch(mutation.setWebsocketConnectionSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const getChatRooms = (therapistId, chatUserId, roomIds) => async dispatch => {
  const payload = {
    therapist_id: therapistId,
    page_size: 999999,
    page: 1
  };
  const data = await User.getUsers(payload);
  if (data.success) {
    const chatRooms = [];
    data.data.forEach(user => {
      if (user.chat_user_id) {
        const fIndex = roomIds.findIndex(r => r.includes(user.chat_user_id));
        if (fIndex > -1) {
          chatRooms.push({
            rid: roomIds[fIndex],
            name: `${user.last_name} ${user.first_name}`,
            enabled: user.enabled,
            unread: 0,
            u: {
              _id: user.chat_user_id,
              username: user.identity,
              status: 'offline'
            },
            lastMessage: {},
            totalMessages: 0
          });
        }
      }
    });
    dispatch(mutation.getChatRoomsSuccess(chatRooms));
    return true;
  } else {
    dispatch(mutation.getChatRoomsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    return false;
  }
};

export const getChatUsersStatus = (authUserId) => async (dispatch, getState) => {
  const { authToken, chatRooms } = getState().rocketchat;
  const userIds = [];
  const mapIndex = [];
  chatRooms.forEach((room, idx) => {
    if (room.enabled) {
      userIds.push(room.u._id);
      mapIndex[room.u._id] = idx;
    }
  });
  if (userIds.length) {
    const data = await Rocketchat.getUserStatus(userIds, authUserId, authToken);
    if (data.success) {
      data.users.forEach(user => {
        chatRooms[mapIndex[user._id]].u.status = user.status;
      });
      dispatch(mutation.getChatUsersStatusSuccess(chatRooms));
      return true;
    } else {
      dispatch(mutation.getChatUsersStatusFail());
      dispatch(showErrorNotification('toast_title.error_message', data.message));
      return false;
    }
  }
};

export const getLastMessages = (authUserId, roomIds) => async (dispatch, getState) => {
  const { authToken, chatRooms } = getState().rocketchat;
  const data = await Rocketchat.getLastMessages(roomIds, authUserId, authToken);
  if (data.success) {
    data.ims.forEach(message => {
      if (message.lastMessage) {
        const { rid, msg, _id, ts, u } = message.lastMessage;
        const fIndex = chatRooms.findIndex(cr => cr.rid === rid);
        if (fIndex > -1) {
          chatRooms[fIndex].lastMessage = {
            _id,
            text: msg,
            createdAt: ts,
            u: { _id: u._id }
          };
          chatRooms[fIndex].totalMessages = message.msgs;
        }
      }
    });
    dispatch(mutation.getLastMessagesSuccess(chatRooms));
    return true;
  } else {
    dispatch(mutation.getLastMessagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    return false;
  }
};

export const getMessagesInRoom = (payload) => async (dispatch) => {
  dispatch(mutation.getMessagesInRoomSuccess(payload));
};

export const selectRoom = (payload) => (dispatch, getState) => {
  dispatch(mutation.selectRoomSuccess(payload));
  const { chatRooms } = getState().rocketchat;
  if (chatRooms.enabled) {
    const fIndex = chatRooms.findIndex(cr => cr.rid === payload.rid);
    if (chatRooms[fIndex].unread > 0) {
      chatRooms[fIndex].unread = 0;
      dispatch(mutation.updateUnreadSuccess(chatRooms));
    }
  }
};

export const prependNewMessage = (payload) => (dispatch, getState) => {
  const { messages, chatRooms, selectedRoom } = getState().rocketchat;
  let currentRoom = false;
  if (selectedRoom !== undefined && selectedRoom.rid === payload.rid) {
    currentRoom = true;
    const fIndex = messages.findIndex(msg => msg._id === payload._id);
    if (fIndex === -1) {
      dispatch(mutation.prependNewMessageSuccess(payload));
    }
  }
  const fIndex = chatRooms.findIndex(cr => cr.rid === payload.rid);
  if (fIndex > -1) {
    if (!currentRoom) {
      chatRooms[fIndex].unread += 1;
    }
    chatRooms[fIndex].totalMessages += 1;
    chatRooms[fIndex].lastMessage = payload;
    dispatch(mutation.updateLastMessageSuccess(chatRooms));
  }
};

export const setIsOnChatPage = (payload) => (dispatch) => {
  dispatch(mutation.setIsOnChatPageSuccess(payload));
};

export const updateChatUserStatus = (payload) => (dispatch, getState) => {
  const { isOnChatPage, chatRooms } = getState().rocketchat;
  if (isOnChatPage) {
    const fIndex = chatRooms.findIndex(cr => cr.u._id === payload._id);
    if (fIndex > -1) {
      chatRooms[fIndex].u.status = payload.status;
      dispatch(mutation.updateChatUserStatusSuccess(chatRooms));
    }
  }
};
