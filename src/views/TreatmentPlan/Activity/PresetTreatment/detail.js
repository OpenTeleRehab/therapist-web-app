import React, { useEffect, useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { addPresetDataPreview, getPresetTreatmentPlans } from 'store/treatmentPlan/actions';
import settings from 'settings';
import { TAB } from 'variables/treatmentPlan';
import ActivitySection from '../../_Partials/activitySection';

const ViewTreatmentPlan = ({ id }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.auth);
  const { presetTreatmentPlans } = useSelector(state => state.treatmentPlan);
  const [treatmentPlansDetail, setTreatmentPlansDetail] = useState({});
  const [weeks, setWeeks] = useState(1);
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [readOnly] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(addPresetDataPreview(id));
    }
  }, [id, dispatch, profile]);

  useEffect(() => {
    if (id) {
      if (presetTreatmentPlans.length) {
        const treatmentPlan = _.find(presetTreatmentPlans, { id: parseInt(id) }) || {};
        setTreatmentPlansDetail(treatmentPlan);
      } else {
        const additionalParams = { type: 'preset' };
        dispatch(getPresetTreatmentPlans({ id, ...additionalParams }));
      }
    }
  }, [id, dispatch, presetTreatmentPlans, profile]);

  useEffect(() => {
    if (id && !_.isEmpty(treatmentPlansDetail)) {
      setWeeks(treatmentPlansDetail.total_of_weeks);
      setActivities(treatmentPlansDetail.activities);
      setStartDate(moment(treatmentPlansDetail.start_date, settings.date_format).format(settings.date_format));
    }
  }, [id, treatmentPlansDetail]);

  return (
    <>
      <div className="mt-lg-5">
        <Tabs>
          <Tab eventKey={TAB.activities} title={translate('treatment_plan.activities_tab')}>
            <ActivitySection
              weeks={weeks}
              setWeeks={setWeeks}
              startDate={startDate}
              activities={activities}
              readOnly={readOnly}
              treatmentPlanId={id}/>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

ViewTreatmentPlan.propTypes = {
  id: PropTypes.number
};

export default ViewTreatmentPlan;
