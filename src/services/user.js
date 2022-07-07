import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';
import axiosPatient from 'utils/patient-axios';

const createUser = payload => {
  return axiosPatient.post('/patient', payload, { headers: { country: getCountryIsoCode() } })
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
  return axiosPatient.put(`/patient/${id}`, payload, { headers: { country: getCountryIsoCode() } })
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
  return axiosPatient.get('/patient', { params: payload, headers: { country: getCountryIsoCode() } })
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
  return axiosPatient.post(`/patient/activateDeactivateAccount/${id}`, enabled, { headers: { country: getCountryIsoCode() } })
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
  return axiosPatient.post(`/patient/deleteAccount/${id}`, null, { headers: { country: getCountryIsoCode() } })
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
  return axiosPatient.post('/patient/delete-chat-room/by-id', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getActivitiesByIds = (activityIds, treatmentPlanId, type, day, week, lang, therapistId, isPreset = false) => {
  const params = { activity_ids: activityIds, treatment_plan_id: treatmentPlanId, type: type, day: day, week: week, lang: lang, therapist_id: therapistId };
  let httpRequest = axios;
  let config = ['/activities/list/by-ids', { params }];
  if (!isPreset) {
    httpRequest = axiosPatient;
    config = ['activities/list/by-ids', { params }];
  }
  return httpRequest.get(...config)
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
