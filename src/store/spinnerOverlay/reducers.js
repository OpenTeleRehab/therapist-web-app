import { initialState } from './states';

export const spinnerOverlay = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_SPINNER_SUCCESS': {
      return Object.assign({}, state, {
        showSpinner: action.data
      });
    }
    default:
      return state;
  }
};
