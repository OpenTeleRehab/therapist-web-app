import React from 'react';
import { STATUS, STATUS_VARIANTS } from 'variables/treatmentPlan';
import { Badge } from 'react-bootstrap';
import moment from 'moment';
import settings from '../settings';
import { Translate } from 'react-localize-redux';

export const renderStatusBadge = (treatmentPlan) => {
  if (!treatmentPlan || !treatmentPlan.id) {
    return '';
  }

  let status = STATUS.planned;
  if (moment().diff(moment(treatmentPlan.end_date, settings.date_format), 'days') > 0) {
    status = STATUS.finished;
  } else if (moment().diff(moment(treatmentPlan.start_date, settings.date_format), 'days') > 0) {
    status = STATUS.on_going;
  }

  return (
    <Badge pill variant={STATUS_VARIANTS[status]}>
      <Translate id={`common.${status}`} />
    </Badge>
  );
};
