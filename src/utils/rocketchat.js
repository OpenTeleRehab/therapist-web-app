import {
  isWebsocketConnected,
  setChatAuthToken,
  getMessagesInRoom,
  prependNewMessage,
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
  socket.onmessage = (e) => {
    const response = JSON.parse(e.data);
    const { id, msg, result, error, collection, fields } = response;

    // create connection
    if (!isConnected && msg === undefined && socket.readyState === 1) {
      isConnected = true;
      const options = {
        msg: 'connect',
        version: '1',
        support: ['1', 'pre2', 'pre1']
      };
      socket.send(JSON.stringify(options));
    }

    if (msg === 'ping') {
      // Keep connection alive
      socket.send(JSON.stringify({ msg: 'pong' }));
    } else if (msg === 'connected') {
      // connection success => login
      dispatch(isWebsocketConnected(true));
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
    } else if (msg === 'result') {
      if (error !== undefined) {
        dispatch(showErrorNotification('toast_title.error_message', `Websocket: ${error.reason}`));
      } else if (id === loginId && result) {
        // login success

        // set auth token
        const { token, tokenExpires } = result;
        const authTokenExpiredAt = new Date(tokenExpires.$date);
        dispatch(setChatAuthToken({ authToken: token, authTokenExpiredAt }));

        // subscribe chat room message
        subscribeChatRoomMessage(socket, roomMessageId);

        // subscribe to user logged status (patient)
        setTimeout(() => {
          subscribeUserLoggedStatus(socket, notifyLoggedId);
        }, 1000);
      } else if (result && result.messages) {
        // load messages in a room
        const allMessages = [];
        result.messages.forEach(message => {
          const { _id, msg, ts, u } = message;
          allMessages.push({
            _id,
            text: msg,
            createdAt: new Date(ts.$date),
            user: { _id: u._id },
            received: true,
            pending: false
          });
        });
        dispatch(getMessagesInRoom(allMessages));
      }
    } else if (msg === 'changed') {
      if (collection === 'stream-room-messages') {
        // trigger change in chat room
        const { _id, rid, msg, ts, u } = fields.args[0];
        const newMessage = {
          _id,
          rid,
          text: msg,
          createdAt: new Date(ts.$date),
          user: { _id: u._id },
          received: true,
          pending: false,
          unread: 0
        };
        dispatch(prependNewMessage(newMessage));
      } else if (collection === 'stream-notify-logged') {
        // trigger user logged status
        const res = fields.args[0];
        const data = {
          _id: res[0],
          status: USER_STATUS[res[2]]
        };
        dispatch(updateChatUserStatus(data));
      }
    }
  };

  return socket;
};

// TODO set specific iterm per page on first load with infinite scroll
export const loadHistoryInRoom = (socket, roomId, therapistId) => {
  const options = {
    msg: 'method',
    method: 'loadHistory',
    id: getUniqueId(therapistId),
    params: [
      roomId,
      null,
      999999,
      { $date: new Date().getTime() }
    ]
  };
  socket.send(JSON.stringify(options));
};

export const sendNewMessage = (socket, newMessage, therapistId) => {
  const options = {
    msg: 'method',
    method: 'sendMessage',
    id: getUniqueId(therapistId),
    params: [
      {
        rid: newMessage.rid,
        _id: newMessage._id,
        msg: newMessage.text
      }
    ]
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
