export const ageCalculation = (value) => {
  var today = new Date();
  var birthDate = new Date(value);
  var year = today.getFullYear() - birthDate.getFullYear();
  var month = today.getMonth() - birthDate.getMonth();
  var day = today.getDay() - birthDate.getDay();

  var totalAge = 0;
  if (year > 0) {
    totalAge = year + ' year(s)';
  } else if (month > 0) {
    totalAge = month + ' month(s)';
  } else {
    totalAge = day > 0 ? day + ' day(s)' : totalAge;
  }

  return totalAge;
};
