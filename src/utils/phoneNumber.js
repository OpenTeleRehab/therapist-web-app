const CustomPhoneNumber = (dialCode, phoneNumber) => {
  const phoneNumberOnly = phoneNumber.replace(dialCode, '');

  return dialCode ? `(+${dialCode})-` + phoneNumberOnly : phoneNumber;
};

export default CustomPhoneNumber;
