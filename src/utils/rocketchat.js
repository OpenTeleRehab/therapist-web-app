import {
  setChatAuthToken,
  loadLastMessageHistory,
  loadAllMessagesInRoom,
  prependNewMessageInRoom
} from 'store/rocketchat/actions';
import { getUniqueId } from './general';

const lastMessages = [];
let lastLoadHistoryId = '';
let isLoadLastHistory = true;

export const initialChatSocket = (dispatch, profile) => {
  let isConnected = false;
  const loginId = getUniqueId(profile.id);
  const subscribeId = getUniqueId(profile.id);

  // register websocket
  const socket = new WebSocket(process.env.REACT_APP_ROCKET_CHAT_WEBSOCKET);

  // observer
  socket.onmessage = function (e) {
    const response = JSON.parse(e.data);
    // console.log('socket = ', response);
    const { msg, id, result, subs, collection, fields } = response;

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
      socket.send(JSON.stringify({ msg: 'pong' }));
    } else if (msg === 'connected') {
      // connection success => login
      const options = {
        msg: 'method',
        method: 'login',
        id: loginId,
        params: [
          {
            user: { username: profile.identity },
            password: {
              digest: profile.chat_password,
              algorithm: 'sha-256'
            }
          }
        ]
      };
      socket.send(JSON.stringify(options));
    } else if (msg === 'result' && id === loginId && result.id === profile.chat_user_id) {
      // login success => subscribe chat room(s) event
      dispatch(setChatAuthToken(result.token));
      const options = {
        msg: 'sub',
        id: subscribeId,
        name: 'stream-room-messages',
        params: ['__my_messages__', false]
      };
      socket.send(JSON.stringify(options));
    } else if (msg === 'ready' && subs[0] === subscribeId) {
      // subscribe success => load last message for available rooms
      isLoadLastHistory = true;
      loadLastMessageInChatRoom(socket, profile.id, profile.chat_rooms);
    } else if (msg === 'result' && result.messages && isLoadLastHistory) {
      // load last message success
      const { _id, rid, msg, ts, u } = result.messages[0] || {};
      if (rid !== undefined) {
        lastMessages.push({
          rid,
          _id,
          text: msg,
          createdAt: new Date(ts.$date),
          user: { _id: u._id }
        });
      }
      if (id === lastLoadHistoryId) {
        isLoadLastHistory = false;
        dispatch(loadLastMessageHistory(lastMessages));
      }
    } else if (msg === 'result' && result.messages && !isLoadLastHistory) {
      // load all messages in a room
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
      dispatch(loadAllMessagesInRoom(allMessages));
    } else if (msg === 'changed' && collection === 'stream-room-messages') {
      // trigger change in chat room
      const { _id, msg, ts, u } = fields.args[0];
      const newMessage = {
        _id,
        text: msg,
        createdAt: new Date(ts.$date),
        user: { _id: u._id },
        received: true,
        pending: false
      };
      dispatch(prependNewMessageInRoom(newMessage));
    }
  };

  return socket;
};

const loadLastMessageInChatRoom = (socket, userId, rooms) => {
  rooms.forEach((room, index) => {
    if (index === rooms.length - 1) {
      lastLoadHistoryId = getUniqueId(userId);
    }
    const options = {
      msg: 'method',
      method: 'loadHistory',
      id: lastLoadHistoryId || getUniqueId(userId),
      params: [
        room,
        null,
        1,
        { $date: new Date().getTime() }
      ]
    };
    socket.send(JSON.stringify(options));
  });
};
