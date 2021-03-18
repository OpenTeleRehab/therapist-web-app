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

const getEducationMaterialRequest = () => ({
  type: 'GET_EDUCATION_MATERIAL_REQUEST'
});

const getEducationMaterialSuccess = (data) => ({
  type: 'GET_EDUCATION_MATERIAL_SUCCESS',
  data
});

const getEducationMaterialFail = () => ({
  type: 'GET_EDUCATION_MATERIAL_FAIL'
});

const createEducationMaterialRequest = () => ({
  type: 'CREATE_EDUCATION_MATERIAL_REQUEST'
});

const createEducationMaterialSuccess = (data) => ({
  type: 'CREATE_EDUCATION_MATERIAL_SUCCESS',
  data
});

const createEducationMaterialFail = () => ({
  type: 'CREATE_EDUCATION_MATERIAL_FAIL'
});

const updateEducationMaterialRequest = () => ({
  type: 'UPDATE_EDUCATION_MATERIAL_REQUEST'
});

const updateEducationMaterialSuccess = (data) => ({
  type: 'UPDATE_EDUCATION_MATERIAL_SUCCESS',
  data
});

const updateEducationMaterialFail = () => ({
  type: 'UPDATE_EDUCATION_MATERIAL_FAIL'
});

const deleteEducationMaterialRequest = () => ({
  type: 'DELETE_EDUCATION_MATERIAL_REQUEST'
});

const deleteEducationMaterialSuccess = (data) => ({
  type: 'DELETE_EDUCATION_MATERIAL_SUCCESS',
  data
});

const deleteEducationMaterialFail = () => ({
  type: 'DELETE_EDUCATION_MATERIAL_FAIL'
});

const clearFilterEducationMaterialsRequest = () => ({
  type: 'CLEAR_FILTER_EDUCATION_MATERIALS_REQUEST'
});

export const mutation = {
  getEducationMaterialsFail,
  getEducationMaterialsRequest,
  getEducationMaterialsSuccess,
  getEducationMaterialRequest,
  getEducationMaterialSuccess,
  getEducationMaterialFail,
  createEducationMaterialRequest,
  createEducationMaterialSuccess,
  createEducationMaterialFail,
  updateEducationMaterialRequest,
  updateEducationMaterialSuccess,
  updateEducationMaterialFail,
  deleteEducationMaterialRequest,
  deleteEducationMaterialSuccess,
  deleteEducationMaterialFail,
  clearFilterEducationMaterialsRequest
};
