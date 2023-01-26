import axios from 'utils/axios';

const getMessages = (payload) => {
  return axios.get('/message',
    {
      params: payload
    }).then(
    res => {
      return res.data;
    }
  )
    .catch((e) => {
      return e.response.data;
    });
};

const getTherapistMessage = () => {
  return axios.get('/message/get-therapist-message').then(
    res => {
      return res.data;
    }
  )
    .catch((e) => {
      return e.response.data;
    });
};

const sendMessages = (payload) => {
  return axios.post('/message', payload).then(
    res => {
      return res.data;
    }
  )
    .catch((e) => {
      return e.response.data;
    });
};

export const Message = {
  getMessages,
  sendMessages,
  getTherapistMessage
};
