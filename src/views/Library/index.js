import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BsPlus } from 'react-icons/bs';

import * as ROUTES from 'variables/routes';
import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import Questionnaire from './Questionnaire';
import PresetTreatment from './PresetTreatment';

const VIEW_EXERCISE = 'exercise';
const VIEW_EDUCATION = 'education';
const VIEW_QUESTIONNAIRE = 'questionnaire';
const VIEW_PRESET_TREATMENT = 'preset_treatment';

const Library = ({ translate }) => {
  const { hash } = useLocation();
  const [view, setView] = useState(undefined);
  const [newContentLink, setNewContentLink] = useState(undefined);

  useEffect(() => {
    if (hash.includes('#' + VIEW_EDUCATION)) {
      setView(VIEW_EDUCATION);
      setNewContentLink(ROUTES.EDUCATION_MATERIAL_CREATE);
    } else if (hash.includes('#' + VIEW_QUESTIONNAIRE)) {
      setView(VIEW_QUESTIONNAIRE);
      setNewContentLink(ROUTES.QUESTIONNAIRE_CREATE);
    } else if (hash.includes('#' + VIEW_PRESET_TREATMENT)) {
      setView(VIEW_PRESET_TREATMENT);
      setNewContentLink(ROUTES.LIBRARY_TREATMENT_PLAN_CREATE);
    } else {
      setView(VIEW_EXERCISE);
      setNewContentLink(ROUTES.EXERCISE_CREATE);
    }
  }, [hash]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('library')}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-toolbar mb-2 mb-md-0">
            {newContentLink && (
              <Button
                as={Link} to={newContentLink}>
                <BsPlus size={20} className="mr-1" />
                {translate('common.new_content')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Nav variant="tabs" activeKey={view} className="mb-3">
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.LIBRARY} eventKey={VIEW_EXERCISE}>
            {translate('library.exercises')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.LIBRARY_EDUCATION} eventKey={VIEW_EDUCATION}>
            {translate('library.education_materials')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.LIBRARY_QUESTIONNAIRE} eventKey={VIEW_QUESTIONNAIRE}>
            {translate('library.questionnaires')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.LIBRARY_PRESET_TREATMENT} eventKey={VIEW_PRESET_TREATMENT}>
            {translate('library.preset_treatments')}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      { view === VIEW_EXERCISE && <Exercise /> }
      { view === VIEW_EDUCATION && <EducationMaterial /> }
      { view === VIEW_QUESTIONNAIRE && <Questionnaire /> }
      { view === VIEW_PRESET_TREATMENT && <PresetTreatment /> }
    </>
  );
};

Library.propTypes = {
  translate: PropTypes.func
};

export default Library;
