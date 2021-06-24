import { initialState } from './states';

export const privacyPolicy = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PUBLISH_PRIVACY_POLICY_SUCCESS': {
      return Object.assign({}, state, {
        publishPrivacyPolicy: action.data
      });
    }
    default:
      return state;
  }
};
