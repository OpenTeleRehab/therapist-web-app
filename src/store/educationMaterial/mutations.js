const getEducationMaterialsRequest = () => ({
  type: 'GET_EDUCATION_MATERIALS_REQUEST'
});

const getEducationMaterialsSuccess = (data, filters, info) => ({
  type: 'GET_EDUCATION_MATERIALS_SUCCESS',
  data,
  filters,
  info
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

const updateFavoriteRequest = () => ({
  type: 'UPDATE_FAVORITE_REQUEST'
});

const updateFavoriteSuccess = () => ({
  type: 'UPDATE_FAVORITE_SUCCESS'
});

const updateFavoriteFail = () => ({
  type: 'UPDATE_FAVORITE_FAIL'
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

const translateEducationMaterialRequest = () => ({
  type: 'TRANSLATE_EDUCATION_MATERIAL_REQUEST'
});

const translateEducationMaterialSuccess = (data) => ({
  type: 'TRANSLATE_EDUCATION_MATERIAL_SUCCESS',
  data
});

const translateEducationMaterialFail = () => ({
  type: 'TRANSLATE_EDUCATION_MATERIAL_FAIL'
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
  clearFilterEducationMaterialsRequest,
  updateFavoriteRequest,
  updateFavoriteSuccess,
  updateFavoriteFail,
  translateEducationMaterialRequest,
  translateEducationMaterialSuccess,
  translateEducationMaterialFail
};
