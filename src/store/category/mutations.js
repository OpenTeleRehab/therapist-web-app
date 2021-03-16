const getCategoriesRequest = () => ({
  type: 'GET_CATEGORIES_REQUEST'
});

const getCategoriesSuccess = (data) => ({
  type: 'GET_CATEGORIES_SUCCESS',
  data
});

const getCategoriesFail = () => ({
  type: 'GET_CATEGORIES_FAIL'
});

const getCategoryRequest = () => ({
  type: 'GET_CATEGORY_REQUEST'
});

const getCategorySuccess = (data) => ({
  type: 'GET_CATEGORY_SUCCESS',
  data
});

const getCategoryFail = () => ({
  type: 'GET_CATEGORY_FAIL'
});

const createCategoryRequest = () => ({
  type: 'CREATE_CATEGORY_REQUEST'
});

const createCategorySuccess = () => ({
  type: 'CREATE_CATEGORY_SUCCESS'
});

const createCategoryFail = () => ({
  type: 'CREATE_CATEGORY_FAIL'
});

const updateCategoryRequest = () => ({
  type: 'UPDATE_CATEGORY_REQUEST'
});

const updateCategorySuccess = () => ({
  type: 'UPDATE_CATEGORY_SUCCESS'
});

const updateCategoryFail = () => ({
  type: 'UPDATE_CATEGORY_FAIL'
});

export const mutation = {
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFail,
  getCategoryRequest,
  getCategorySuccess,
  getCategoryFail,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFail,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFail
};
