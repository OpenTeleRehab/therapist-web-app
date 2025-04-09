const getDownloadTrackersRequest = () => ({
  type: 'GET_DOWNLOAD_TRACKERS_REQUEST'
});

const getDownloadTrackersSuccess = (data) => ({
  type: 'GET_DOWNLOAD_TRACKERS_SUCCESS',
  data
});

const getDownloadTrackersFail = () => ({
  type: 'GET_DOWNLOAD_TRACKERS_FAIL'
});

const updateDownloadTrackersRequest = () => ({
  type: 'UPDATE_DOWNLOAD_TRACKERS_REQUEST'
});

const updateDownloadTrackersSuccess = (data) => ({
  type: 'UPDATE_DOWNLOAD_TRACKERS_SUCCESS',
  data
});

const updateDownloadTrackersFail = () => ({
  type: 'UPDATE_DOWNLOAD_TRACKERS_FAIL'
});

const removeDownloadTrackersRequest = () => ({
  type: 'REMOVE_DOWNLOAD_TRACKERS_REQUEST'
});

const removeDownloadTrackersSuccess = (data) => ({
  type: 'REMOVE_DOWNLOAD_TRACKERS_SUCCESS',
  data
});

const removeDownloadTrackersFail = () => ({
  type: 'REMOVE_DOWNLOAD_TRACKERS_FAIL'
});

export const mutation = {
  getDownloadTrackersRequest,
  getDownloadTrackersSuccess,
  getDownloadTrackersFail,
  updateDownloadTrackersRequest,
  updateDownloadTrackersSuccess,
  updateDownloadTrackersFail,
  removeDownloadTrackersRequest,
  removeDownloadTrackersSuccess,
  removeDownloadTrackersFail
};
