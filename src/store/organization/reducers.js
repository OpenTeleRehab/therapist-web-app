import { initialState } from './states';

export const organization = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORGANIZATION_THERAPIST_AND_MAX_SMS_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'GET_ORGANIZATION_THERAPIST_AND_MAX_SMS_SUCCESS': {
      return Object.assign({}, state, {
        organization: action.data
      });
    }
    default:
      return state;
  }
};
