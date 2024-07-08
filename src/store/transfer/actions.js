import { Transfer } from 'services/transfer';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getTransfers = () => async dispatch => {
  dispatch(mutation.getTransfersRequest());
  const data = await Transfer.getTransfers();
  if (data.success) {
    dispatch(mutation.getTransfersSuccess(data.data));
  } else {
    dispatch(mutation.getTransfersFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createTransfer = (payload) => async (dispatch) => {
  dispatch(mutation.createTransferRequest());
  dispatch(showSpinner(true));
  const data = await Transfer.createTransfer(payload);
  if (data.success) {
    dispatch(mutation.createTransferSuccess());
    dispatch(showSuccessNotification('toast_title.new_transfer', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createTransferFail());
    dispatch(showErrorNotification('toast_title.new_transfer', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const acceptTransfer = (payload) => async (dispatch) => {
  dispatch(mutation.acceptTransferRequest());
  dispatch(showSpinner(true));
  const data = await Transfer.acceptTransfer(payload);
  if (data.success) {
    dispatch(mutation.acceptTransferSuccess());
    dispatch(getTransfers());
    dispatch(showSuccessNotification('toast_title.accept_transfer', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.acceptTransferFail());
    dispatch(showErrorNotification('toast_title.accept_transfer', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const declineTransfer = (patientId) => async (dispatch) => {
  dispatch(mutation.declineTransferRequest());
  dispatch(showSpinner(true));
  const data = await Transfer.declineTransfer(patientId);
  if (data.success) {
    dispatch(mutation.declineTransferSuccess());
    dispatch(getTransfers());
    dispatch(showSuccessNotification('toast_title.decline_transfer', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.declineTransferFail());
    dispatch(showErrorNotification('toast_title.decline_transfer', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const deleteTransfer = (id) => async (dispatch) => {
  dispatch(mutation.deleteTransferRequest());
  dispatch(showSpinner(true));
  const data = await Transfer.deleteTransfer(id);
  if (data.success) {
    dispatch(mutation.deleteTransferSuccess());
    dispatch(getTransfers());
    dispatch(showSuccessNotification('toast_title.delete_transfer', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.deleteTransferFail());
    dispatch(showErrorNotification('toast_title.delete_transfer', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};
