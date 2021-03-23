const getSettingsRequest = () => ({
  type: 'GET_SETTINGS_REQUEST'
});

const getSettingsSuccess = (data) => ({
  type: 'GET_SETTINGS_SUCCESS',
  data
});

const getSettingsFail = () => ({
  type: 'GET_SETTINGS_FAIL'
});

export const mutation = {
  getSettingsRequest,
  getSettingsSuccess,
  getSettingsFail
};
