import axios from 'utils/axios';

const getDownloadTrackers = () => {
  return axios.get('/download-trackers')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const clearDownloadTrackers = () => {
  return axios.delete('/download-trackers')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const downloadTracker = { clearDownloadTrackers, getDownloadTrackers };
