import moment from 'moment';
import settings from '../settings';

export const getNextAppointment = (nextAppointment) => {
  if (nextAppointment) {
    return moment.utc(nextAppointment.start_date).local().format(settings.date_format + ' hh:mm A');
  }
};
