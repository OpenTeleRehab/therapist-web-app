import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';

import PatientInfo from 'views/Patient/Partials/patientInfo';
import TreatmentHistory from './treatmentHistory';

const ViewPatient = () => {
  const { patientId } = useParams();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <>
      <div className="top-content">
        <PatientInfo id={patientId} translate={translate} breadcrumb={translate('common.patient_detail')}/>
      </div>
      <TreatmentHistory />
    </>
  );
};

export default ViewPatient;
