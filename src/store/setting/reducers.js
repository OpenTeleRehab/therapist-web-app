import { initialState } from './states';

export const setting = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SETTINGS_SUCCESS': {
      return Object.assign({}, state, {
        systemLimits: action.data.system_limits
      });
    }
    default:
      return state;
  }
};
