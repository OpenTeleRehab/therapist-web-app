const getOrganizationTherapistAndMaxSmsRequest = () => ({
  type: 'GET_ORGANIZATION_THERAPIST_AND_MAX_SMS_REQUEST'
});

const getOrganizationTherapistAndMaxSmsSuccess = (data) => ({
  type: 'GET_ORGANIZATION_THERAPIST_AND_MAX_SMS_SUCCESS',
  data
});

const getOrganizationTherapistAndMaxSmsFail = () => ({
  type: 'GET_ORGANIZATION_THERAPIST_AND_MAX_SMS_FAIL'
});

export const mutation = {
  getOrganizationTherapistAndMaxSmsRequest,
  getOrganizationTherapistAndMaxSmsSuccess,
  getOrganizationTherapistAndMaxSmsFail
};
