import { downloadTracker } from 'services/downloadTracker';
import { mutation } from './mutations';
import {
  showErrorNotification, showSuccessNotification
} from 'store/notification/actions';

export const getDownloadTrackers = () => async dispatch => {
  dispatch(mutation.getDownloadTrackersRequest());
  const data = await downloadTracker.getDownloadTrackers();
  if (data.success) {
    dispatch(mutation.getDownloadTrackersSuccess(data.data));
    return data;
  } else {
    dispatch(mutation.getDownloadTrackersFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateDownloadPending = (payload) => async dispatch => {
  dispatch(mutation.updateDownloadTrackersRequest());
  if (payload) {
    dispatch(mutation.updateDownloadTrackersSuccess(payload));
  } else {
    dispatch(mutation.updateDownloadTrackersFail());
  }
};

export const removeDownloadPending = (payload) => async dispatch => {
  dispatch(mutation.removeDownloadTrackersRequest());
  if (payload) {
    dispatch(mutation.removeDownloadTrackersSuccess(payload));
  } else {
    dispatch(mutation.removeDownloadTrackersFail());
  }
};

export const clearDownloadTrackers = () => async dispatch => {
  const data = await downloadTracker.clearDownloadTrackers();
  if (data.success) {
    dispatch(showSuccessNotification('toast_title.download_history', data.message));
    return true;
  } else {
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    return false;
  }
};
