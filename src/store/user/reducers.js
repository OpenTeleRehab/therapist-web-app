const initialState = {
  users: [],
  filters: [],
  loading: false
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'GET_USERS_SUCCESS': {
      return Object.assign({}, state, {
        users: action.data,
        filters: action.filters,
        loading: false
      });
    }
    case 'GET_USERS_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    default:
      return state;
  }
};
