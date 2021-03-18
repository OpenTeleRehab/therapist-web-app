import { initialState } from './states';

export const appointment = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_APPOINTMENTS_SUCCESS': {
      return Object.assign({}, state, {
        appointments: action.data
      });
    }
    default:
      return state;
  }
};
