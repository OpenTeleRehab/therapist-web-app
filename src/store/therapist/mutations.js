const getTherapistsByClinicRequest = () => ({
  type: 'GET_THERAPISTS_BY_CLINIC_REQUEST'
});

const getTherapistsByClinicSuccess = (data) => ({
  type: 'GET_THERAPISTS_BY_CLINIC_SUCCESS',
  data
});

const getTherapistsByClinicFail = () => ({
  type: 'GET_THERAPISTS_BY_CLINIC_FAIL'
});

export const mutation = {
  getTherapistsByClinicRequest,
  getTherapistsByClinicSuccess,
  getTherapistsByClinicFail
};
