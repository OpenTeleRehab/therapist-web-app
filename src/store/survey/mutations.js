const getPublishSurveyRequest = () => ({
  type: 'GET_PUBLISH_SURVEY_REQUEST'
});

const getPublishSurveySuccess = (data) => ({
  type: 'GET_PUBLISH_SURVEY_SUCCESS',
  data
});

const getPublishSurveyFail = () => ({
  type: 'GET_PUBLISH_SURVEY_FAIL'
});

const submitSurveyRequest = () => ({
  type: 'SUBMIT_SURVEY_REQUEST'
});

const submitSurveySuccess = (data) => ({
  type: 'SUBMIT_SURVEY_SUCCESS',
  data
});

const submitSurveyFail = () => ({
  type: 'SUBMIT_SURVEY_FAIL'
});

const skipSurveyRequest = () => ({
  type: 'SKIP_SURVEY_REQUEST'
});

const skipSurveySuccess = (data) => ({
  type: 'SKIP_SURVEY_SUCCESS',
  data
});

const skipSurveyFail = () => ({
  type: 'SKIP_SURVEY_FAIL'
});

export const mutation = {
  getPublishSurveyRequest,
  getPublishSurveySuccess,
  getPublishSurveyFail,
  submitSurveyRequest,
  submitSurveySuccess,
  submitSurveyFail,
  skipSurveyRequest,
  skipSurveySuccess,
  skipSurveyFail
};
