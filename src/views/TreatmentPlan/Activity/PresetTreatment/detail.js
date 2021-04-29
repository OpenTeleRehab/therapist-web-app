import React, { useState, useEffect } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import {
  Tab,
  Tabs
} from 'react-bootstrap';
import moment from 'moment/moment';
import {
  getTreatmentPlansDetail
} from 'store/treatmentPlan/actions';
import settings from 'settings';
import { TAB } from 'variables/treatmentPlan';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ActivitySection from '../../_Partials/activitySection';

const ViewTreatmentPlan = ({ id }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const treatmentPlansDetail = useSelector((state) => state.treatmentPlan.treatmentPlansDetail);
  const [weeks, setWeeks] = useState(1);
  const [key, setKey] = useState(TAB.activities);
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [readOnly] = useState(true);

  useEffect(() => {
    if (id) {
      const additionalParams = { type: 'preset' };
      dispatch(getTreatmentPlansDetail({ id, lang: profile.language_id, ...additionalParams, therapist_id: profile.id }));
    }
  }, [id, dispatch, profile]);

  useEffect(() => {
    if (id && !_.isEmpty(treatmentPlansDetail)) {
      setWeeks(treatmentPlansDetail.total_of_weeks);
      setActivities(treatmentPlansDetail.activities);
      setStartDate(moment(treatmentPlansDetail.start_date, settings.date_format).format(settings.date_format));
    }
    // eslint-disable-next-line
  }, [id, treatmentPlansDetail]);

  return (
    <>
      <div className="mt-lg-5">
        <Tabs
          id="controlled-tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey={TAB.activities} title={translate('treatment_plan.activities_tab')}>
            <ActivitySection weeks={weeks} setWeeks={setWeeks} startDate={startDate} activities={activities} readOnly={readOnly} />
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
