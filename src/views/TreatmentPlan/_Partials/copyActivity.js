import React, { useState } from 'react';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import _ from 'lodash';

const CopyActivity = ({ show, handleClose, activities, setActivities, dayActivityToCopy, weeks }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [errorDay, setErrorDay] = useState(false);
  const [errorWeek, setErrorWeek] = useState(false);

  const handleDayChange = (e) => {
    const checked = e.target.checked;
    const day = parseInt(e.target.value, 10);
    if (checked) {
      selectedDays.push(day);
    } else {
      _.remove(selectedDays, n => n === day);
    }
    setSelectedDays([...selectedDays]);
  };

  const handleWeekChange = (e) => {
    const checked = e.target.checked;
    const week = parseInt(e.target.value, 10);
    if (checked) {
      selectedWeeks.push(week);
    } else {
      _.remove(selectedWeeks, n => n === week);
    }
    setSelectedWeeks([...selectedWeeks]);
  };

  const handlePaste = () => {
    let canPaste = true;
    if (!selectedDays.length) {
      canPaste = false;
      setErrorDay(true);
    } else {
      setErrorDay(false);
    }

    if (!selectedWeeks.length) {
      canPaste = false;
      setErrorWeek(true);
    } else {
      setErrorWeek(false);
    }

    if (canPaste) {
      const newActivities = [];
      for (let i = 0; i < selectedWeeks.length; i++) {
        for (let j = 0; j < selectedDays.length; j++) {
          const dayActivities = _.cloneDeep(dayActivityToCopy);
          if (dayActivities.day !== selectedDays[j] || dayActivities.week !== selectedWeeks[i]) {
            newActivities.push({
              week: selectedWeeks[i],
              day: selectedDays[j],
              exercises: dayActivities.exercises ? dayActivities.exercises : [],
              materials: dayActivities.materials ? dayActivities.materials : [],
              questionnaires: dayActivities.questionnaires ? dayActivities.questionnaires : []
            });
          }
        }
      }
      const updatedActivities = _.unionWith([...newActivities], activities, (a, n) => {
        return a.week === n.week && a.day === n.day;
      });
      setActivities(updatedActivities);
      handleClose();
    }
  };

  const dayElements = () => {
    const elements = [];
    for (let i = 0; i < 7; i++) {
      elements.push(
        <Row>
          <Col>
            <Form.Group controlId={`formDay-${i + 1}`}>
              <Form.Check
                name={`day-${i + 1}`}
                onChange={(e) => handleDayChange(e)}
                value={i + 1}
                label={ translate('common.day') + ' ' + (i + 1)}
              />
            </Form.Group>
          </Col>
        </Row>
      );
    }
    return elements;
  };

  const weekElements = () => {
    const elements = [];
    for (let i = 1; i <= weeks; i++) {
      elements.push(
        <Row>
          <Col>
            <Form.Group controlId={`formWeek-${i}`}>
              <Form.Check
                name={`week-${i + 1}`}
                onChange={(e) => handleWeekChange(e)}
                value={i}
                label={ translate('common.week') + ' ' + (i)}
              />
            </Form.Group>
          </Col>
        </Row>
      );
    }
    return elements;
  };

  return (
    <Dialog
      show={show}
      title={translate('activity.copy_all_content_and_paste_to')}
      onCancel={handleClose}
      onConfirm={handlePaste}
      confirmLabel={translate('common.paste')}
    >
      <Row>
        <Col md='auto'>{translate('common.copy_to')}</Col>
        <Col md='auto'>
          {dayElements()}
        </Col>
        <Col md='auto'> {translate('common.of')}</Col>
        <Col md='auto'>
          {weekElements()}
        </Col>
      </Row>
      {(errorDay && !errorWeek) &&
        <span className="text-danger">{translate('activity.copy.day.error')}</span>
      }
      {(errorWeek && !errorDay) &&
        <span className="text-danger">{translate('activity.copy.week.error')}</span>
      }
      { (errorWeek && errorDay) &&
        <span className="text-danger">{translate('activity.copy.week_and_day.error')}</span>
      }
    </Dialog>
  );
};

CopyActivity.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  activities: PropTypes.array,
  setActivities: PropTypes.func,
  dayActivityToCopy: PropTypes.object,
  weeks: PropTypes.number
};

export default CopyActivity;
