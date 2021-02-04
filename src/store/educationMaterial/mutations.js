const getEducationMaterialsRequest = () => ({
  type: 'GET_EDUCATION_MATERIALS_REQUEST'
});

const getEducationMaterialsSuccess = (data, filters) => ({
  type: 'GET_EDUCATION_MATERIALS_SUCCESS',
  data,
  filters
});

const getEducationMaterialsFail = () => ({
  type: 'GET_EDUCATION_MATERIALS_FAIL'
});

export const mutation = {
  getEducationMaterialsFail,
  getEducationMaterialsRequest,
  getEducationMaterialsSuccess
};
