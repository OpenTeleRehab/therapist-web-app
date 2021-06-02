const getFaqPageRequest = () => ({
  type: 'GET_FAQ_PAGE_REQUEST'
});

const getFaqPageSuccess = (data) => ({
  type: 'GET_FAQ_PAGE_SUCCESS',
  data
});

const getFaqPageFail = () => ({
  type: 'GET_FAQ_PAGE_FAIL'
});

export const mutation = {
  getFaqPageFail,
  getFaqPageSuccess,
  getFaqPageRequest
};
