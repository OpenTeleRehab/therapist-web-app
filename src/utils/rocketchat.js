// @see https://developer.rocket.chat/api/realtime-api
import {
  connectWebsocket,
  authenticateChatUser,
  appendNewMessage,
  updateChatUserStatus
} from 'store/rocketchat/actions';
import { showErrorNotification } from 'store/notification/actions';
import { USER_STATUS } from 'variables/rocketchat';
import { getUniqueId } from './general';

export const initialChatSocket = (dispatch, subscribeIds, username, password) => {
  let isConnected = false;
  const { loginId, roomMessageId, notifyLoggedId } = subscribeIds;

  // register websocket
  const socket = new WebSocket(process.env.REACT_APP_ROCKET_CHAT_WEBSOCKET);

  // observer
  socket.onclose = (e) => {
    if (e.target.readyState === socket.CLOSED) {
      dispatch(connectWebsocket(false));
    }
  };
  socket.onmessage = (e) => {
    const response = JSON.parse(e.data);
    const { id, result, error, collection, fields } = response;
    const resMessage = response.msg;

    // create connection
    if (!isConnected && resMessage === undefined && socket.readyState === socket.OPEN) {
      isConnected = true;
      const options = {
        msg: 'connect',
        version: '1',
        support: ['1', 'pre2', 'pre1']
      };
      socket.send(JSON.stringify(options));
    }

    if (resMessage === 'ping') {
      // Keep connection alive
      socket.send(JSON.stringify({ msg: 'pong' }));
    } else if (resMessage === 'connected') {
      // connection success => login
      dispatch(connectWebsocket(true));
      const options = {
        msg: 'method',
        method: 'login',
        id: loginId,
        params: [
          {
            user: { username },
            password: {
              digest: password,
              algorithm: 'sha-256'
            }
          }
        ]
      };
      socket.send(JSON.stringify(options));
    } else if (resMessage === 'result') {
      if (error !== undefined) {
        dispatch(showErrorNotification('toast_title.error_message', `Websocket: ${error.reason}`));
      } else if (id === loginId && result) {
        // login success

        // set auth token
        const { token, tokenExpires } = result;
        const tokenExpiredAt = new Date(tokenExpires.$date);
        dispatch(authenticateChatUser({ authToken: token, tokenExpiredAt }));

        // subscribe chat room message
        subscribeChatRoomMessage(socket, roomMessageId);

        // subscribe to user logged status (patient)
        setTimeout(() => {
          subscribeUserLoggedStatus(socket, notifyLoggedId);
        }, 1000);
      }
    } else if (resMessage === 'changed') {
      if (collection === 'stream-room-messages') {
        // trigger change in chat room
        const { _id, rid, msg, _updatedAt, u } = fields.args[0];
        const newMessage = {
          _id,
          rid,
          msg,
          _updatedAt: new Date(_updatedAt.$date),
          u: { _id: u._id },
          received: true,
          pending: false,
          unread: 0
        };
        dispatch(appendNewMessage(newMessage));
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
  };

  return socket;
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

// @TODO look like the method is not working
export const markMessagesAsRead = (socket, roomId, therapistId) => {
  const options = {
    msg: 'method',
    method: 'readMessages',
    id: getUniqueId(therapistId),
    params: [roomId]
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
