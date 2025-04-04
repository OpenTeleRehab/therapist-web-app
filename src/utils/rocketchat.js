// @see https://developer.rocket.chat/api/realtime-api
import {
  appendNewMessage,
  authenticateChatUser,
  connectWebsocket,
  getMessagesForSelectedRoom,
  updateChatUserStatus,
  updateVideoCallStatus
} from 'store/rocketchat/actions';
import { showErrorNotification } from 'store/notification/actions';
import { CALL_STATUS, USER_STATUS } from 'variables/rocketchat';
import { getUniqueId, getMessage } from './general';
import { Rocketchat } from '../services/roketchat';
import store from '../store';

export const initialChatSocket = (dispatch, subscribeIds, username, password) => {
  let authUserId = '';
  let authToken = '';
  const { loginId, roomMessageId, notifyLoggedId } = subscribeIds;

  // register websocket
  const socket = new WebSocket(process.env.REACT_APP_ROCKET_CHAT_WEBSOCKET);

  socket.addEventListener('open', () => {
    const options = {
      msg: 'connect',
      version: '1',
      support: ['1']
    };
    socket.send(JSON.stringify(options));
  });

  socket.addEventListener('close', (e) => {
    if (e.target.readyState === socket.CLOSED) {
      dispatch(connectWebsocket(false));
    }
  });

  socket.addEventListener('message', (e) => {
    const response = JSON.parse(e.data);
    const { id, result, error, collection, fields } = response;
    const resMessage = response.msg;

    if (resMessage === 'ping') {
      // Keep connection alive
      socket.send(JSON.stringify({ msg: 'pong' }));
    } else if (resMessage === 'connected') {
      // connection success => login
      dispatch(connectWebsocket(true));
      Rocketchat.login(username, { digest: password, algorithm: 'sha-256' })
        .then(({ data }) => {
          const options = {
            msg: 'method',
            method: 'login',
            id: loginId,
            params: [{ resume: data.authToken }]
          };
          socket.send(JSON.stringify(options));
        });
    } else if (resMessage === 'result') {
      if (error !== undefined) {
        dispatch(showErrorNotification('toast_title.error_message', `Websocket: ${error.reason}`));
      } else if (id === loginId && result) {
        // login success

        // set auth token
        const { token, tokenExpires } = result;
        const tokenExpiredAt = new Date(tokenExpires.$date);
        authUserId = result.id;
        authToken = token;
        dispatch(authenticateChatUser({ authToken, authUserId, tokenExpiredAt }));

        // subscribe chat room message
        subscribeChatRoomMessage(socket, roomMessageId);

        // subscribe to user logged status
        setTimeout(() => {
          subscribeUserLoggedStatus(socket, notifyLoggedId);
        }, 1000);
      } else if (result && result.messages) {
        const allMessages = [];
        const reversedMessages = result.messages.reverse();
        reversedMessages.forEach((message) => {
          const data = getMessage(message, authUserId, authToken);
          allMessages.push(data);
        });
        dispatch(getMessagesForSelectedRoom(allMessages));
      }
    } else if (resMessage === 'changed') {
      if (collection === 'stream-room-messages') {
        // trigger change in chat room
        const { _id, rid, u, msg } = fields.args[0];
        const { authUserId, videoCall } = store.getState().rocketchat;
        const { profile } = store.getState().auth;

        if (msg && msg.includes('jitsi_call')) {
          if (videoCall && u._id !== authUserId && [CALL_STATUS.AUDIO_STARTED, CALL_STATUS.VIDEO_STARTED, CALL_STATUS.BUSY].includes(msg)) {
            updateMessage(socket, { _id, rid, msg: CALL_STATUS.BUSY }, profile.id);
          } else {
            dispatch(updateVideoCallStatus({ _id, rid, u, status: msg }));
          }
        }

        const newMessage = getMessage(fields.args[0], authUserId, authToken);
        dispatch(appendNewMessage(newMessage, socket));
      } else if (collection === 'stream-notify-logged') {
        // trigger user logged status
        const res = fields.args[0];
        const data = {
          _id: res[0],
          status: USER_STATUS[res[2]]
        };
        dispatch(updateChatUserStatus(data));
      } else if (resMessage === 'removed' && collection === 'users') {
        // close connection on logout
        socket.close();
      }
    }
  });

  return socket;
};

// TODO set specific iterm per page on first load with infinite scroll
export const loadMessagesInRoom = (socket, roomId, patientId) => {
  const options = {
    msg: 'method',
    method: 'loadHistory',
    id: getUniqueId(patientId),
    params: [roomId, null, 999999, { $date: new Date().getTime() }]
  };
  socket.send(JSON.stringify(options));
};

export const sendNewMessage = (socket, newMessage, therapistId) => {
  const options = {
    msg: 'method',
    method: 'sendMessage',
    id: getUniqueId(therapistId),
    params: [{ ...newMessage }]
  };
  socket.send(JSON.stringify(options));
};

export const updateMessage = (socket, message, therapistId) => {
  const options = {
    msg: 'method',
    method: 'updateMessage',
    id: getUniqueId(therapistId),
    params: [{ ...message }]
  };
  socket.send(JSON.stringify(options));
};

export const unSubscribeEvent = (socket, subId) => {
  const options = {
    msg: 'unsub',
    id: subId
  };
  socket.send(JSON.stringify(options));
};

export const chatLogout = (socket, id) => {
  const options = {
    msg: 'method',
    method: 'logout',
    id
  };
  socket.send(JSON.stringify(options));
};

const subscribeChatRoomMessage = (socket, id) => {
  const options = {
    msg: 'sub',
    id,
    name: 'stream-room-messages',
    params: ['__my_messages__', false]
  };
  socket.send(JSON.stringify(options));
};

const subscribeUserLoggedStatus = (socket, id) => {
  const options = {
    msg: 'sub',
    id,
    name: 'stream-notify-logged',
    params: ['user-status', false]
  };
  socket.send(JSON.stringify(options));
};

export const deleteChatRoom = (socket, roomId, therapistId) => {
  const options = {
    msg: 'method',
    method: 'eraseRoom',
    id: getUniqueId(therapistId),
    params: [roomId]
  };

  socket.send(JSON.stringify(options));
};
