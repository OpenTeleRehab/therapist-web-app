import React from 'react';
import { STATUS, STATUS_VARIANTS } from 'variables/treatmentPlan';
import { Badge } from 'react-bootstrap';
import moment from 'moment';
import settings from '../settings';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export const renderStatusBadge = (treatmentPlan) => {
  if (!treatmentPlan || !treatmentPlan.id) {
    return '';
  }

  let status = STATUS.planned;
  if (moment().startOf('day').diff(moment(treatmentPlan.end_date, settings.date_format), 'days', true) > 0) {
    status = STATUS.finished;
  } else if (moment().startOf('day').diff(moment(treatmentPlan.start_date, settings.date_format), 'days', true) >= 0) {
    status = STATUS.on_going;
  }

  return (
    <Badge pill variant={STATUS_VARIANTS[status]}>
      <Translate id={`common.${status}`} />
    </Badge>
  );
};

export const getLastActivityDate = (startDate, activities) => {
  const sortActivities = activities.sort((a, b) => a.week - b.week || a.day - b.day);
  const rawActivities = sortActivities.filter((item) => item.exercises.length || item.materials.length || item.questionnaires.length);

  if (rawActivities.length) {
    const lastActivity = rawActivities[rawActivities.length - 1];
    const remainingDay = 7 - lastActivity.day;
    const day = (lastActivity.week * 7) - remainingDay - 1;
    return moment(startDate, settings.date_format).add(day, 'days').locale('en').format(settings.date_format);
  }

  return startDate;
};

export const getDisease = (id, diseases) => {
  const disease = _.findLast(diseases, { id: parseInt(id, 10) });

  return disease ? disease.name : '';
};
