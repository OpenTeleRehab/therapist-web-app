import { initialState } from './states';

export const appointment = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_APPOINTMENTS_SUCCESS': {
      return Object.assign({}, state, {
        appointments: action.data
      });
    }
    case 'CREATE_APPOINTMENT_REQUEST':
    case 'UPDATE_APPOINTMENT_REQUEST':
    case 'GET_APPOINTMENTS_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'CREATE_APPOINTMENT_SUCCESS':
    case 'CREATE_APPOINTMENT_FAIL':
    case 'UPDATE_APPOINTMENT_SUCCESS':
    case 'UPDATE_APPOINTMENT_FAIL':
    case 'GET_APPOINTMENTS_FAIL':
    case 'GET_APPOINTMENT_TREE_DATA_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    default:
      return state;
  }
};
