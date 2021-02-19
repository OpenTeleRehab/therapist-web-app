import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import settings from '../../../settings';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';

const AdherenceTab = () => {
  const localize = useSelector((state) => state.localize);
  const { treatmentPlansDetail } = useSelector((state) => state.treatmentPlan);
  const translate = getTranslate(localize);
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [graphData, setGraphData] = useState();
  const dateRangePickerRef = useRef();

  useEffect(() => {
    if (!_.isEmpty(treatmentPlansDetail)) {
      setActivities(treatmentPlansDetail.activities);
      dateRangePickerRef.current.setStartDate(moment(treatmentPlansDetail.start_date, settings.date_format));
      dateRangePickerRef.current.setEndDate(moment(treatmentPlansDetail.end_date, settings.date_format));
      setStartDate(moment(treatmentPlansDetail.start_date, settings.date_format));
      setEndDate(moment(treatmentPlansDetail.end_date, settings.date_format));
    }
  }, [treatmentPlansDetail]);

  useEffect(() => {
    if (activities.length && startDate && endDate) {
      const labels = [];
      const lineData = [];
      const barData = [];

      const exercises = activities.filter(activity => activity.type === 'exercise');

      for (let m = moment(startDate); m.diff(endDate, 'days', true) <= 0; m.add(1, 'days')) {
        let numberOfAllActivity = 0;
        let numberOfCompletedActivity = 0;
        let numberOfSubmittedPainLevel = 0;
        let painLevelValue = 0;
        exercises.forEach(exercise => {
          if (exercise.date === m.format('YYYY-MM-DD')) {
            numberOfAllActivity++;
            if (exercise.completed) {
              numberOfCompletedActivity++;
            }

            if (exercise.pain_level) {
              numberOfSubmittedPainLevel++;
              painLevelValue += parseInt(exercise.pain_level);
            }
          }
        });

        if (numberOfAllActivity) {
          labels.push([m.format('dddd'), m.format(settings.date_format)]);
          lineData.push(numberOfSubmittedPainLevel ? painLevelValue * 100 / (numberOfSubmittedPainLevel * 10) : 0);
          barData.push(numberOfAllActivity ? numberOfCompletedActivity * 100 / numberOfAllActivity : 0);
        }
      }

      setGraphData({
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: translate('common.pain_level') + ' (%)',
            borderColor: 'red',
            borderWidth: 4,
            fill: false,
            data: lineData
          },
          {
            type: 'bar',
            label: translate('common.completed') + ' (%)',
            backgroundColor: 'blue',
            data: barData,
            borderColor: 'white',
            borderWidth: 2
          }
        ]
      });
    }
    // eslint-disable-next-line
  }, [activities, startDate, endDate]);

  const handleOnCallback = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleCancel = (event, picker) => {
    picker.element.val('');
  };

  return (
    <div className="card">
      <div className="card-header form-row">
        <div className="form-group col-xs-5">
          <label>{translate('common.time_range')}</label>
          <DateRangePicker
            ref={dateRangePickerRef}
            initialSettings={{
              locale: {
                format: settings.date_format,
                cancelLabel: translate('common.clear'),
                applyLabel: translate('common.apply')
              }
            }}
            onCallback={handleOnCallback}
            onCancel={handleCancel}
          >
            <input
              type="text"
              className="form-control"
              placeholder={translate('common.timerange.placeholder')}
            />
          </DateRangePicker>
        </div>
      </div>
      <div className="card-body row">
        <div className="col-xl-8 col-sm-10 offset-xl-2 offset-sm-1">
          {graphData &&
            <Bar
              data={graphData}
              legend={{
                position: 'top',
                align: 'end',
                reverse: true
              }}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default AdherenceTab;
