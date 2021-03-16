import { Category } from 'services/category';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getCategories = payload => async dispatch => {
  dispatch(mutation.getCategoriesRequest());
  const data = await Category.getCategories(payload);
  if (data.success) {
    dispatch(mutation.getCategoriesSuccess(data.data));
  } else {
    dispatch(mutation.getCategoriesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getCategory = (id, language) => async dispatch => {
  dispatch(mutation.getCategoryRequest());
  dispatch(showSpinner(true));
  const data = await Category.getCategory(id, language);
  if (data) {
    dispatch(mutation.getCategorySuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getCategoryFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createCategory = payload => async (dispatch) => {
  dispatch(mutation.createCategoryRequest());
  const data = await Category.createCategory(payload);
  if (data.success) {
    dispatch(mutation.createCategorySuccess());
    dispatch(getCategories({ type: payload.type }));
    dispatch(showSuccessNotification('toast_title.new_category', data.message));
    return true;
  } else {
    dispatch(mutation.createCategoryFail());
    dispatch(showErrorNotification('toast_title.new_category', data.message));
    return false;
  }
};

export const updateCategory = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateCategoryRequest());
  const data = await Category.updateCategory(id, payload);
  if (data.success) {
    dispatch(mutation.updateCategorySuccess());
    dispatch(getCategories({ type: payload.type }));
    dispatch(showSuccessNotification('toast_title.edit_category', data.message));
    return true;
  } else {
    dispatch(mutation.updateCategoryFail());
    dispatch(showErrorNotification('toast_title.edit_category', data.message));
    return false;
  }
};
