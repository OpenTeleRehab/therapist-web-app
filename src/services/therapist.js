import axios from 'utils/axios';
const getTherapistsByClinic = (clinicId) => {
  const params = { clinic_id: clinicId };
  return axios.get('therapist/list/by-clinic-id', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteTherapistChatRoomById = (id, chatRoomId) => {
  const formData = new FormData();
  formData.append('therapist_id', id);
  formData.append('chat_room_id', chatRoomId);
  return axios.post('/therapist/delete-chat-room/by-id', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Therapist = {
  getTherapistsByClinic,
  deleteTherapistChatRoomById
};
