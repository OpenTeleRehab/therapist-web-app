import { initialState } from './states';

export const rocketchat = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WEBSOCKET_CONNECTION_SUCCESS': {
      return Object.assign({}, state, {
        isConnected: action.data
      });
    }
    case 'SET_CHAT_AUTH_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        authToken: action.data.authToken,
        authTokenExpiredAt: action.data.authTokenExpiredAt
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
    case 'GET_MESSAGES_IN_ROOM_SUCCESS': {
      return Object.assign({}, state, {
        messages: action.data
      });
    }
    case 'PREPEND_NEW_MESSAGE_SUCCESS': {
      return Object.assign({}, state, {
        messages: [action.data, ...state.messages]
      });
    }
    case 'SET_IS_ON_CHAT_PAGE_SUCCESS': {
      return Object.assign({}, state, {
        isOnChatPage: action.data
      });
    }
    default:
      return state;
  }
};
