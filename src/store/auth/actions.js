import { Auth } from '../../services/auth';
import { mutation } from './mutations';
import keycloak from 'utils/keycloak';
import { showErrorNotification } from 'store/notification/actions';

// Actions
export const getProfile = () => async dispatch => {
  dispatch(mutation.getProfileRequest(true));
  if (keycloak.authenticated) {
    const tokenParsed = keycloak.tokenParsed;
    const username = tokenParsed.preferred_username;
    const data = await Auth.getProfile(username);
    if (data) {
      dispatch(mutation.getProfileSuccess(data.data));
    } else {
      dispatch(mutation.getProfileFail());
      dispatch(showErrorNotification('toast_title.error_message', data.message));
    }
  }
};
