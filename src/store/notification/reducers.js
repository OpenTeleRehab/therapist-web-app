import { initialState } from './states';

export const notification = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION_MESSAGE': {
      return Object.assign({}, state, {
        title: action.title,
        message: action.message
      });
    }
    case 'OPEN_NOTIFICATION': {
      return Object.assign({}, state, {
        show: true
      });
    }
    case 'CLOSE_NOTIFICATION': {
      return Object.assign({}, state, {
        show: false
      });
    }
    case 'SET_TYPE': {
      return Object.assign({}, state, {
        color: action.color
      });
    }
    default:
      return state;
  }
};
