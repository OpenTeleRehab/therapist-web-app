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

const getUserPresence = async (username, authUserId, authToken) => {
  const instance = createInstance(authUserId, authToken);

  return instance.get(`/users.getPresence?username=${username}`)
    .then(
      res => {
        return res.data;
      }
    ).catch(e => {
      return e.response.data;
    });
};

const getLastMessage = async (roomId, authUserId, authToken) => {
  const instance = createInstance(authUserId, authToken);

  return instance.get(`/im.history?roomId=${roomId}&count=1`)
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
  getUserPresence,
  getLastMessage,
  getSubscriptions,
  sendAttachmentMessage
};
