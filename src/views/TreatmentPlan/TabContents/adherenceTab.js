import React, { useContext, useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import settings from '../../../settings';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';
import { Accordion, Card, AccordionContext } from 'react-bootstrap';
import { BsChevronRight, BsChevronDown } from 'react-icons/bs';
import PropTypes from 'prop-types';
import scssColors from 'scss/custom.scss';

const AdherenceTab = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { treatmentPlansDetail } = useSelector((state) => state.treatmentPlan);
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [graphData, setGraphData] = useState();
  const [completedExercises, setCompletedExercises] = useState([]);
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
      const completedExerciseObjs = [];

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
              completedExerciseObjs.push(exercise);
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
            borderColor: scssColors.orange,
            borderWidth: 4,
            fill: false,
            data: lineData
          },
          {
            type: 'bar',
            label: translate('common.completed') + ' (%)',
            backgroundColor: scssColors.primary,
            data: barData,
            borderColor: 'white',
            borderWidth: 2
          }
        ]
      });
      setCompletedExercises(_.chain(completedExerciseObjs).groupBy('date').value());
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
    <div className="mb-3">
      <div className="card mt-4">
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
          <div className="col-xl-8 col-sm-10 offset-xl-2 offset-sm-1 text-center">
            {graphData
              ? <Bar
                data={graphData}
                legend={{
                  position: 'top',
                  align: 'end',
                  reverse: true
                }}
              />
              : <div className="py-5 h5">{translate('common.no_data')}</div>
            }
          </div>
        </div>
      </div>
      <div className="row">
        {Object.keys(completedExercises).map((key, index) => {
          return (
            <div className="col-sm-6 mt-3" key={index}>
              <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey={index + 1} className="bg-blue-light-2 text-primary font-weight-bold d-flex align-items-center">
                    <span>{moment(key).format(settings.date_format)}</span>
                    <ContextAwareToggle eventKey={index + 1} />
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>
                      <div className="row">
                        {
                          completedExercises[key].map(exercise => {
                            return (
                              <div className="col-sm-6" key={index}>
                                <span className="text-primary font-weight-bold">{exercise.title}</span>
                                <ul className="pl-3 pt-3">
                                  <li><span className="font-weight-bold">{translate('common.completed')}:</span> {exercise.sets || 0} {translate('common.sets')}, {exercise.reps || 0} {translate('common.reps')}</li>
                                  <li><span className="font-weight-bold">{translate('common.pain_level')}:</span> {exercise.pain_level || 0}</li>
                                </ul>
                              </div>
                            );
                          })
                        }
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdherenceTab;

const ContextAwareToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);

  if (currentEventKey === eventKey) {
    return <BsChevronDown className="ml-auto" />;
  }

  return <BsChevronRight className="ml-auto" />;
};

ContextAwareToggle.propTypes = {
  eventKey: PropTypes.string
};
