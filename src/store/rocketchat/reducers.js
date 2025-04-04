import { initialState } from './states';

export const rocketchat = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WEBSOCKET_CONNECTION_SUCCESS': {
      return Object.assign({}, state, {
        isChatConnected: action.data
      });
    }
    case 'CHAT_USER_LOGIN_SUCCESS': {
      return Object.assign({}, state, {
        authToken: action.data.authToken,
        authUserId: action.data.authUserId,
        tokenExpiredAt: action.data.tokenExpiredAt
      });
    }
    case 'SET_CHAT_SUBSCRIBE_IDS_SUCCESS': {
      return Object.assign({}, state, {
        subscribeIds: action.data
      });
    }
    case 'GET_CHAT_ROOMS_SUCCESS': {
      return Object.assign({}, state, {
        chatRooms: action.data
      });
    }
    case 'SELECT_ROOM_SUCCESS': {
      return Object.assign({}, state, {
        selectedRoom: action.data
      });
    }
    case 'GET_MESSAGES_FOR_SELECTED_ROOM_SUCCESS': {
      return Object.assign({}, state, {
        messages: action.data
      });
    }
    case 'SET_IS_ON_CHAT_PAGE_SUCCESS': {
      return Object.assign({}, state, {
        isOnChatPage: action.data
      });
    }
    case 'UPDATE_VIDEO_CALL_STATUS_SUCCESS': {
      return Object.assign({}, state, {
        videoCall: action.data
      });
    }
    case 'REMOVE_VIDEO_CALL_STATUS_SUCCESS': {
      return Object.assign({}, state, {
        videoCall: undefined
      });
    }
    case 'GET_CALL_ACCESS_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        callAccessToken: action.data
      });
    }
    default:
      return state;
  }
};
