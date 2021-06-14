import { getUniqueId } from './general';

export const markMessagesAsRead = (socket, roomId, therapistId) => {
  const options = {
    msg: 'method',
    method: 'readMessages',
    id: getUniqueId(therapistId),
    params: [roomId]
  };
  socket.send(JSON.stringify(options));
};
