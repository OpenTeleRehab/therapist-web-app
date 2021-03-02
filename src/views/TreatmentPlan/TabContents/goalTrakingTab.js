import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';

const GoalTrackingTab = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { treatmentPlansDetail } = useSelector((state) => state.treatmentPlan);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [numberOfWeeks, setNumberOfWeeks] = useState([]);

  const graphOptions = {
    legend: {
      display: false
    }
  };

  const datasets = {
    fill: true,
    backgroundColor: 'rgba(255, 135, 71, 0.5)',
    borderColor: '#E35205',
    borderWidth: 4,
    data: []
  };

  useEffect(() => {
    if (!_.isEmpty(treatmentPlansDetail)) {
      setGoals(treatmentPlansDetail.goals);
      setActivities(treatmentPlansDetail.activities.filter(activity => activity.type === 'goal' && activity.completed));
      setNumberOfWeeks(treatmentPlansDetail.total_of_weeks);
    }
  }, [treatmentPlansDetail]);

  return (
    <div className="mb-3 pt-4">
      {goals && goals.length ? (
        <>

          {goals.map((goal, i) => {
            const data = [];
            const labels = [];
            for (let w = 1; w <= numberOfWeeks; w++) {
              if (goal.frequency === 'weekly') {
                labels.push(`W${w}`);
                const activity = _.find(activities, { activity_id: goal.id, week: w });
                data.push(activity ? activity.satisfaction || 0 : undefined);
              } else {
                for (let d = 1; d <= 7; d++) {
                  labels.push(`D${(w - 1) * 7 + d}`);
                  const activity = _.find(activities, { activity_id: goal.id, week: w, day: d });
                  data.push(activity ? activity.satisfaction || 0 : undefined);
                }
              }
            }

            return (
              <Card key={i} className="mb-3">
                <Card.Header as="h5" className="bg-blue-light-2 text-primary">
                  <span className="text-dark mr-1">
                    {translate('treatment_plan.goal.number', { number: i + 1 })}:
                  </span>
                  {goal.title}
                </Card.Header>
                <Card.Body>
                  <span className="text-orange">
                    {translate('treatment_plan.goal.extreme_satisfaction')}
                  </span>
                  <Line
                    height={70}
                    options={graphOptions}
                    data={{ datasets: [{ ...datasets, data }], labels }}
                  />
                  <span className="text-orange">
                    {translate('treatment_plan.goal.no_satisfaction')}
                  </span>
                </Card.Body>
              </Card>
            );
          })}
        </>
      ) : (
        <Card body className="text-center">
          <div className="py-5 h5">{translate('common.no_data')}</div>
        </Card>
      )}
    </div>
  );
};

export default GoalTrackingTab;
