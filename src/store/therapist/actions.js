import { Therapist } from 'services/therapist';
import { mutation } from './mutations';

import {
  showErrorNotification
} from 'store/notification/actions';

export const getTherapistsByClinic = clinicId => async dispatch => {
  dispatch(mutation.getTherapistsByClinicRequest());
  const data = await Therapist.getTherapistsByClinic(clinicId);
  if (data.success) {
    dispatch(mutation.getTherapistsByClinicSuccess(data.data));
  } else {
    dispatch(mutation.getTherapistsByClinicFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};
