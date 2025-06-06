import axios from 'axios';

const createInstance = (userId, authToken) => {
  return axios.create({
    baseURL: process.env.REACT_APP_ROCKET_CHAT_API_BASE_URL,
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId
    }
  });
};

const login = (user, password) => {
  const instance = createInstance(undefined, undefined);
  return instance.post('login', { user, password })
    .then(
      res => {
        return res.data;
      }
    ).catch(e => {
      return e.response.data;
    });
};

const getUserStatus = (userNames, authUserId, authToken) => {
  const instance = createInstance(authUserId, authToken);
  const fields = JSON.stringify({ status: 1 });
  const query = JSON.stringify({ username: { $in: userNames } });
  return instance.get(`/users.list?fields=${fields}&query=${query}&count=999999`)
    .then(
      res => {
        return res.data;
      }
    ).catch(e => {
      return e.response.data;
    });
};

const getLastMessages = (chatRooms, authUserId, authToken) => {
  const instance = createInstance(authUserId, authToken);
  const fields = JSON.stringify({ msgs: 1, lastMessage: 1 });
  const query = JSON.stringify({ _id: { $in: chatRooms } });
  return instance.get(`/im.list?fields=${fields}&query=${query}&count=999999`)
    .then(
      res => {
        return res.data;
      }
    ).catch(e => {
      return e.response.data;
    });
};

const getSubscriptions = async (authUserId, authToken) => {
  const instance = createInstance(authUserId, authToken);
  return instance.get('subscriptions.get')
    .then(res => {
      return res.data.update;
    }).catch(e => {
      return e.response.data;
    });
};

const sendAttachmentMessage = (roomId, authUserId, authToken, attachment) => {
  const instance = createInstance(authUserId, authToken);
  const formData = new FormData();
  formData.append('description', attachment.caption);
  formData.append('file', attachment.file);
  return instance.post(`/rooms.upload/${roomId}`, formData)
    .then(
      res => {
        return res.data;
      }
    ).catch(e => {
      return e.response.data;
    });
};

export const Rocketchat = {
  login,
  getUserStatus,
  getLastMessages,
  getSubscriptions,
  sendAttachmentMessage
};
