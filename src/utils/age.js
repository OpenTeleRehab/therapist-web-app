const AgeCalculation = (value, translate) => {
  var today = new Date();
  var birthDate = new Date(value);
  var year = today.getFullYear() - birthDate.getFullYear();
  var month = today.getMonth() - birthDate.getMonth();
  var day = today.getDate() - birthDate.getDate();

  var totalAge = 0;
  if (year > 0) {
    totalAge = year === 1 ? year + ' ' + translate('age.single_year') : year + ' ' + translate('age.plural_year');
  } else if (month > 0) {
    totalAge = month === 1 ? month + ' ' + translate('age.single_month') : month + ' ' + translate('age.plural_month');
  } else {
    totalAge = day === 1 ? day + ' ' + translate('age.single_day') : day + ' ' + translate('age.plural_day');
  }

  return totalAge;
};

export default AgeCalculation;

export const AgeInYear = (value) => {
  var today = new Date();
  var birthDate = new Date(value);
  var year = today.getFullYear() - birthDate.getFullYear();

  return year;
};
