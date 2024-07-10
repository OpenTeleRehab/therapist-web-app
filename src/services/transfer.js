import axios from 'utils/axios';
import { getCountryIsoCode } from '../utils/country';

const getTransfers = () => {
  return axios.get('/transfer')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createTransfer = payload => {
  return axios.post('/transfer', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const acceptTransfer = payload => {
  return axios.get(`/transfer/accept/${payload.transfer_id}`, { params: payload, headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const declineTransfer = transferId => {
  return axios.get(`/transfer/decline/${transferId}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteTransfer = transferId => {
  return axios.delete(`/transfer/${transferId}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Transfer = {
  getTransfers,
  createTransfer,
  acceptTransfer,
  declineTransfer,
  deleteTransfer
};
