import { initialState } from './states';

export const downloadTracker = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DOWNLOAD_TRACKERS_SUCCESS': {
      return Object.assign({}, state, {
        downloadTrackers: action.data
      });
    }
    case 'UPDATE_DOWNLOAD_TRACKERS_SUCCESS': {
      return Object.assign({}, state, {
        downloadPendings: [...state.downloadPendings, ...action.data]
      });
    }
    case 'REMOVE_DOWNLOAD_TRACKERS_SUCCESS': {
      const newPending = state.downloadPendings.filter((item) => action.data !== item);
      return Object.assign({}, state, {
        downloadPendings: [...newPending]
      });
    }
    default:
      return state;
  }
};
