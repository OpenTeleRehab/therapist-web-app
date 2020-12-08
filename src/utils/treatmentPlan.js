import React from 'react';
import _ from 'lodash';
import { STATUS } from 'variables/treatmentPlan';
import { Badge } from 'react-bootstrap';

export const getTreatmentPlanStatus = (patientId, treatmentPlans, translate) => {
  const treatmentPlan = _.find(treatmentPlans, { patient_id: patientId });

  if (treatmentPlan !== undefined) {
    if (treatmentPlan.status === STATUS.planned) {
      return (
        <Badge pill variant="info">
          {translate('common.planned')}
        </Badge>
      );
    } else {
      return (
        <Badge pill variant={treatmentPlan.status === STATUS.finished ? 'danger' : 'primary'}>
          {translate('common.' + treatmentPlan.status)}
        </Badge>
      );
    }
  } else {
    return '';
  }
};

export const getTreatmentPlanName = (patientId, treatmentPlans) => {
  const treatmentPlan = _.find(treatmentPlans, { patient_id: patientId });

  return treatmentPlan !== undefined ? treatmentPlan.name : '';
};
