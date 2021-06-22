import axios from 'utils/patient-axios';
import { getCountryIsoCode } from 'utils/country';

const createUser = payload => {
  return axios.post('/patient', payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateUser = (id, payload) => {
  return axios.put(`/patient/${id}`, payload, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getUsers = payload => {
  return axios.get('/patient', { params: payload, headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const activateDeactivateAccount = (id, enabled) => {
  return axios.post(`/patient/activateDeactivateAccount/${id}`, enabled, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteAccount = (id) => {
  return axios.post(`/patient/deleteAccount/${id}`, { headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deletePatientChatRoomById = (id, chatRoomId) => {
  const formData = new FormData();
  formData.append('patient_id', id);
  formData.append('chat_room_id', chatRoomId);
  return axios.post('/patient/delete-chat-room/by-id', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getActivitiesByIds = (activityIds, treatmentPlanId, type, day, week, lang, therapistId) => {
  const params = { activity_ids: activityIds, treatment_plan_id: treatmentPlanId, type: type, day: day, week: week, lang: lang, therapist_id: therapistId };
  return axios.get('activities/list/by-ids', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const User = {
  createUser,
  getUsers,
  updateUser,
  activateDeactivateAccount,
  deleteAccount,
  deletePatientChatRoomById,
  getActivitiesByIds
};
