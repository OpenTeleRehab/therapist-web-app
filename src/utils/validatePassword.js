const validatePassword = (password) => {
  // eslint-disable-next-line
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return re.test(String(password));
};

export default validatePassword;
