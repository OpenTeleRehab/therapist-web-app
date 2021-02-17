import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import CustomTable from '../../../components/Table';
import { Questionnaire } from 'services/questionnaire';

const QuestionnaireTab = ({ activities }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (activities.questionnaires && activities.questionnaires.length > 0) {
      Questionnaire.getQuestionnairesByIds(activities.questionnaires).then(res => {
        if (res.data) {
          setQuestions(res.data);
        }
      });
    } else {
      setQuestions([]);
    }
  }, [activities]);
  const columns = [
    { name: 'title', title: translate('questionnaire.title') + '/' + translate('questionnaire.description') },
    { name: 'number_of_question', title: translate('questionnaire.number_of_question') },
    { name: 'action', title: translate('common.action') }
  ];

  return (
    <div className="mt-3">
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hideSearchFilter={true}
        columns={columns}
        rows={questions.map(question => {
          return {
            title: 'tt'
          };
        })}
      />
    </div>
  );
};
QuestionnaireTab.propTypes = {
  activities: PropTypes.array
};

export default QuestionnaireTab;
