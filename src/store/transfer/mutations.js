const getTransfersRequest = () => ({
  type: 'GET_TRANSFERS_REQUEST'
});

const getTransfersSuccess = (data) => ({
  type: 'GET_TRANSFERS_SUCCESS',
  data
});

const getTransfersFail = () => ({
  type: 'GET_TRANSFERS_FAIL'
});

const createTransferRequest = () => ({
  type: 'CREATE_TRANSFER_REQUEST'
});

const createTransferSuccess = () => ({
  type: 'CREATE_TRANSFER_SUCCESS'
});

const createTransferFail = () => ({
  type: 'CREATE_TRANSFER_FAIL'
});

const acceptTransferRequest = () => ({
  type: 'ACCEPT_TRANSFER_REQUEST'
});

const acceptTransferSuccess = () => ({
  type: 'ACCEPT_TRANSFER_SUCCESS'
});

const acceptTransferFail = () => ({
  type: 'ACCEPT_TRANSFER_FAIL'
});

const declineTransferRequest = () => ({
  type: 'DECLINE_TRANSFER_REQUEST'
});

const declineTransferSuccess = () => ({
  type: 'DECLINE_TRANSFER_SUCCESS'
});

const declineTransferFail = () => ({
  type: 'DECLINE_TRANSFER_FAIL'
});

export const mutation = {
  getTransfersRequest,
  getTransfersSuccess,
  getTransfersFail,
  createTransferRequest,
  createTransferSuccess,
  createTransferFail,
  acceptTransferRequest,
  acceptTransferSuccess,
  acceptTransferFail,
  declineTransferRequest,
  declineTransferSuccess,
  declineTransferFail
};
