import { Rocketchat } from 'services/roketchat';
import { Firebase } from 'services/firebase';
import { Patient } from 'services/patient';
import { mutation } from './mutations';
import { showErrorNotification } from 'store/notification/actions';
import { getMessage } from 'utils/general';
import { markMessagesAsRead } from 'utils/chat';
import { Therapist } from '../../services/therapist';
import { USER_STATUS } from '../../variables/rocketchat';
import _ from 'lodash';

export const connectWebsocket = (payload) => (dispatch) => {
  dispatch(mutation.setWebsocketConnectionSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const setIsOnChatPage = (payload) => (dispatch) => {
  dispatch(mutation.setIsOnChatPageSuccess(payload));
};

export const updateVideoCallStatus = (payload) => (dispatch) => {
  dispatch(mutation.updateVideoCallSuccess(payload));
};

export const getChatRooms = () => async (dispatch, getState) => {
  const { profile } = getState().auth;
  const { authToken, authUserId } = getState().rocketchat;

  const data = await Patient.getPatientsForChatroom();
  const dataTherapist = await Therapist.getTherapistsForChatroom();
  const dataPhcWorker = await Therapist.getPhcWorkersForChatroom();
  const subscriptions = await Rocketchat.getSubscriptions(authUserId, authToken);

  if (data.success || dataTherapist.success || dataPhcWorker.success) {
    const chatRooms = [];

    for (const user of data.data ?? []) {
      if (user.chat_user_id && subscriptions.length) {
        const subscription = subscriptions.find(room => room.rid.includes(user.chat_user_id));

        if (subscription) {
          const status = await Rocketchat.getUserPresence(user.identity, authUserId, authToken);
          const lastMessage = await Rocketchat.getLastMessage(subscription.rid, authUserId, authToken);

          chatRooms.push({
            rid: subscription.rid,
            name: `${user.last_name} ${user.first_name}`,
            unread: subscription.unread,
            u: {
              _id: user.chat_user_id,
              username: user.identity,
              status: status?.presence ?? USER_STATUS[0]
            },
            lastMessage: lastMessage?.success
              ? lastMessage.messages?.[0] ?? {}
              : {},
            totalMessages: 0
          });
        }
      }
    }

    const therapists = dataTherapist.data ?? [];
    for (const therapist of therapists.filter(item => item.id !== profile.id)) {
      const subscription = subscriptions.find(room => room.rid.includes(therapist.chat_user_id));

      if (subscription) {
        const status = await Rocketchat.getUserPresence(therapist.identity, authUserId, authToken);
        const lastMessage = await Rocketchat.getLastMessage(subscription.rid, authUserId, authToken);

        chatRooms.push({
          rid: subscription.rid,
          name: `${therapist.last_name} ${therapist.first_name}`,
          unread: subscription.unread,
          u: {
            _id: therapist.chat_user_id,
            username: therapist.identity,
            status: status?.presence ?? USER_STATUS[0]
          },
          lastMessage: lastMessage?.success
            ? lastMessage.messages?.[0] ?? {}
            : {},
          totalMessages: 0
        });
      }
    }

    const phcWorker = dataPhcWorker.data ?? [];
    for (const therapist of phcWorker.filter(item => item.id !== profile.id)) {
      const subscription = subscriptions.find(room => room.rid.includes(therapist.chat_user_id));

      if (subscription) {
        const status = await Rocketchat.getUserPresence(therapist.identity, authUserId, authToken);
        const lastMessage = await Rocketchat.getLastMessage(subscription.rid, authUserId, authToken);

        chatRooms.push({
          rid: subscription.rid,
          name: `${therapist.last_name} ${therapist.first_name}`,
          unread: subscription.unread,
          u: {
            _id: therapist.chat_user_id,
            username: therapist.identity,
            status: status?.presence ?? USER_STATUS[0]
          },
          lastMessage: lastMessage?.success
            ? lastMessage.messages?.[0] ?? {}
            : {},
          totalMessages: 0
        });
      }
    }

    dispatch(mutation.getChatRoomsSuccess(chatRooms));
    return chatRooms.length > 0;
  } else {
    dispatch(mutation.getChatRoomsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    return false;
  }
};

export const getMessagesForSelectedRoom = (payload) => (dispatch) => {
  dispatch(mutation.getMessagesForSelectedRoomSuccess(payload));
};

export const selectRoom = (payload) => (dispatch, getState) => {
  dispatch(mutation.selectRoomSuccess(payload));
  const { chatRooms } = getState().rocketchat;
  const fIndex = chatRooms.findIndex(cr => cr.rid === payload.rid);
  if (chatRooms[fIndex].unread > 0) {
    chatRooms[fIndex].unread = 0;
    dispatch(mutation.updateUnreadSuccess(chatRooms));
  }
};

export const appendNewMessage = (payload, socket) => (dispatch, getState) => {
  const { messages, chatRooms, selectedRoom, authUserId } = getState().rocketchat;
  const { profile } = getState().auth;
  let currentRoom = false;
  if (selectedRoom !== undefined && selectedRoom.rid === payload.rid) {
    currentRoom = true;
    const fIndex = messages.findIndex(msg => msg._id === payload._id);
    markMessagesAsRead(socket, selectedRoom.rid, profile.id);

    if (fIndex === -1) {
      messages.push(payload);
    } else {
      messages[fIndex] = payload;
    }
    dispatch(mutation.appendNewMessageSuccess(messages));
  }
  const fIndex = chatRooms.findIndex(cr => cr.rid === payload.rid);
  if (fIndex > -1) {
    if (!currentRoom && authUserId !== payload.u._id) {
      chatRooms[fIndex].unread += 1;
    }
    chatRooms[fIndex].totalMessages += 1;
    chatRooms[fIndex].lastMessage = payload;
    dispatch(mutation.updateLastMessageSuccess(chatRooms));
  }
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

export const postAttachmentMessage = (roomId, attachment) => async (dispatch, getState) => {
  const { authToken, authUserId } = getState().rocketchat;
  const data = await Rocketchat.sendAttachmentMessage(roomId, authUserId, authToken, attachment);
  if (data.success) {
    dispatch(mutation.sendAttachmentMessagesSuccess());
    return true;
  } else {
    dispatch(mutation.sendAttachmentMessagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.error));
    return false;
  }
};

export const sendPodcastNotification = (payload) => async () => {
  await Firebase.sendPodcastNotification(payload);
};

export const getCallAccessToken = (roomId) => async (dispatch) => {
  const data = await Therapist.getCallAccessToken(roomId);
  if (data.success) {
    dispatch(mutation.getCallAccessTokenSuccess(data.token));
    return true;
  } else {
    dispatch(mutation.getCallAccessTokenFail());
    dispatch(showErrorNotification('toast_title.error_message', data.error));
    return false;
  }
};
