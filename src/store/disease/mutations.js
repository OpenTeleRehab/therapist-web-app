const getDiseasesRequest = () => ({
  type: 'GET_DISEASES_REQUEST'
});

const getDiseasesSuccess = (data) => ({
  type: 'GET_DISEASES_SUCCESS',
  data
});

const getDiseasesFail = () => ({
  type: 'GET_DISEASES_FAIL'
});

export const mutation = {
  getDiseasesRequest,
  getDiseasesFail,
  getDiseasesSuccess
};
