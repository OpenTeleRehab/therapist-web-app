import { mutation } from './mutations';

// Actions
export const showSpinner = payload => dispatch => {
  dispatch(mutation.showSpinnerSuccess(payload));
};
