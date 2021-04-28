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

export const Therapist = {
  getTherapistsByClinic
};
