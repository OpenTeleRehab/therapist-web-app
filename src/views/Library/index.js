import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BsPlus } from 'react-icons/bs';
import queryString from 'query-string';

import * as ROUTES from 'variables/routes';
import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import Questionnaire from './Questionnaire';
import PresetTreatment from './PresetTreatment';
import Dialog from 'components/Dialog';
import { updateFavorite as updateFavoriteEducationMaterial } from 'store/educationMaterial/actions';
import { updateFavorite as updateFavoriteExercise } from 'store/exercise/actions';
import { useDispatch } from 'react-redux';

const VIEW_EXERCISE = 'exercise';
const VIEW_EDUCATION = 'education';
const VIEW_QUESTIONNAIRE = 'questionnaire';
const VIEW_PRESET_TREATMENT = 'preset_treatment';

const Library = ({ translate }) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [view, setView] = useState(undefined);
  const [newContentLink, setNewContentLink] = useState(undefined);
  const [showSwitchFavoriteDialog, setShowSwitchFavoriteDialog] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [formFields, setFormFields] = useState({
    is_favorite: 0,
    therapist_id: null
  });

  useEffect(() => {
    if (queryString.parse(search).tab === VIEW_EDUCATION) {
      setView(VIEW_EDUCATION);
      setNewContentLink(ROUTES.EDUCATION_MATERIAL_CREATE);
    } else if (queryString.parse(search).tab === VIEW_QUESTIONNAIRE) {
      setView(VIEW_QUESTIONNAIRE);
      setNewContentLink(ROUTES.QUESTIONNAIRE_CREATE);
    } else if (queryString.parse(search).tab === VIEW_PRESET_TREATMENT) {
      setView(VIEW_PRESET_TREATMENT);
      setNewContentLink(ROUTES.LIBRARY_TREATMENT_PLAN_CREATE);
    } else {
      setView(VIEW_EXERCISE);
      setNewContentLink(ROUTES.EXERCISE_CREATE);
    }
  }, [search]);

  const handleSwitchFavorite = (id, isFavorite, therapistId, type) => {
    setId(id);
    setType(type);
    setFormFields({ ...formFields, is_favorite: isFavorite, therapist_id: therapistId });
    setShowSwitchFavoriteDialog(true);
  };

  const handleSwitchFavoriteDialogClose = () => {
    setId(null);
    setShowSwitchFavoriteDialog(false);
  };

  const handleSwitchFavoriteDialogConfirm = () => {
    switch (type) {
      case 'exercise':
        dispatch(updateFavoriteExercise(id, formFields)).then(result => {
          if (result) {
            handleSwitchFavoriteDialogClose(true);
          }
        });
        break;
      case 'education-material':
        dispatch(updateFavoriteEducationMaterial(id, formFields)).then(result => {
          if (result) {
            handleSwitchFavoriteDialogClose(true);
          }
        });
        break;
      default:
        dispatch(updateFavoriteExercise(id, formFields)).then(result => {
          if (result) {
            handleSwitchFavoriteDialogClose(true);
          }
        });
        break;
    }
  };

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

      { view === VIEW_EXERCISE && <Exercise handleSwitchFavorite={handleSwitchFavorite} /> }
      { view === VIEW_EDUCATION && <EducationMaterial handleSwitchFavorite={handleSwitchFavorite} /> }
      { view === VIEW_QUESTIONNAIRE && <Questionnaire /> }
      { view === VIEW_PRESET_TREATMENT && <PresetTreatment /> }
      <Dialog
        show={showSwitchFavoriteDialog}
        title={translate('library.switchFavorite_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleSwitchFavoriteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSwitchFavoriteDialogConfirm}
      >
        <p>{translate('common.switchFavorite_confirmation_message')}</p>
      </Dialog>
    </>
  );
};

Library.propTypes = {
  translate: PropTypes.func
};

export default Library;
