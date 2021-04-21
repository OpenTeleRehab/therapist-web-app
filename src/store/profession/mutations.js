const getProfessionRequest = () => ({
  type: 'GET_PROFESSIONS_REQUEST'
});

const getProfessionsSuccess = (data) => ({
  type: 'GET_PROFESSIONS_SUCCESS',
  data
});

const getProfessionsFail = () => ({
  type: 'GET_PROFESSIONS_FAIL'
});

export const mutation = {
  getProfessionRequest,
  getProfessionsFail,
  getProfessionsSuccess
};
