import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishSurvey } from '../../store/survey/actions';
import SurveyModal from './SurveyModal';
import { SURVEY_FREQUENCY } from 'variables/survey';

const Survey = () => {
  const dispatch = useDispatch();
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const { publishSurveys } = useSelector(state => state.survey);
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);

  useEffect(() => {
    dispatch(getPublishSurvey({
      organization: process.env.REACT_APP_NAME,
      user_id: profile.id,
      type: 'therapist',
      country_id: profile.country_id,
      clinic_id: profile.clinic_id,
      lang: profile.language_id ? profile.language_id : languages.length ? languages[0].id : ''
    }));
  }, [profile, dispatch]);

  useEffect(() => {
    if (publishSurveys.length) {
      setSurveys(publishSurveys);
    }
  }, [publishSurveys]);

  useEffect(() => {
    const survey = surveys.find(item => checkShowSurvey(item.id, item.frequency)) || null;
    if (survey) {
      // Store the last shown date in local storage
      localStorage.setItem(`lastSurveyShownDate_${survey.id}`, new Date().toISOString());
    }
    setCurrentSurvey(survey);
  }, [surveys]);

  const checkShowSurvey = (surveyId, frequency) => {
    const lastSurveyShownDate = localStorage.getItem(`lastSurveyShownDate_${surveyId}`);

    if (!lastSurveyShownDate) {
      return true; // Show if never shown before
    }

    // Calculate interval time based on the frequency in milliseconds
    const frequencyInMs = frequency === SURVEY_FREQUENCY.DAILY ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const lastShownDate = new Date(lastSurveyShownDate);
    const elapsedTime = currentDate - lastShownDate;
    return elapsedTime >= frequencyInMs;
  };

  const handleSurveyClose = (surveyId) => {
    setSurveys(prevQueue => prevQueue.filter(survey => survey.id !== surveyId));
  };

  return (
    <>
      {currentSurvey && (
        <SurveyModal publishSurvey={currentSurvey} handleSurveyClose={handleSurveyClose} />
      )}
    </>
  );
};

export default Survey;
