import { initialState } from './states';

export const staticPage = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_FAQ_PAGE_SUCCESS': {
      return Object.assign({}, state, {
        faqPage: action.data,
        loading: false
      });
    }
    default:
      return state;
  }
};
