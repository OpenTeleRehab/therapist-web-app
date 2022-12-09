import React, { useEffect, useState } from 'react';
import { Button, Nav, OverlayTrigger, Tab, Tooltip } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BsPlus } from 'react-icons/bs';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Exercise as exerciseService } from 'services/exercise';
import _ from 'lodash';

import { CATEGORY_TYPES } from 'variables/category';
import { SYSTEM_TYPES } from 'variables/systemLimit';
import * as ROUTES from 'variables/routes';
import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import Questionnaire from './Questionnaire';
import PresetTreatment from './PresetTreatment';
import { updateFavorite as updateFavoriteEducationMaterial } from 'store/educationMaterial/actions';
import { updateFavorite as updateFavoriteExercise } from 'store/exercise/actions';
import { updateFavorite as updateFavoriteQuestionnaire } from 'store/questionnaire/actions';
import { getSettings } from 'store/setting/actions';
import PreviewList from './Partials/previewList';
import {
  addExerciseDataPreview,
  addMaterialDataPreview,
  addQuestionnaireDataPreview
} from '../../store/treatmentPlan/actions';

const VIEW_EXERCISE = 'exercise';
const VIEW_EDUCATION = 'education';
const VIEW_QUESTIONNAIRE = 'questionnaire';
const VIEW_PRESET_TREATMENT = 'preset_treatment';

const Library = ({ translate }) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [view, setView] = useState(undefined);
  const [newContentLink, setNewContentLink] = useState(undefined);
  const [maxLibraries, setMaxLibraries] = useState(20);
  const [allowCreateContent, setAllowCreateContent] = useState(false);
  const [therapistId, setTherapistId] = useState();
  const { profile } = useSelector((state) => state.auth);
  const { systemLimits } = useSelector((state) => state.setting);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState([]);
  const [isShowPreviewList, setIsShowPreviewList] = useState(false);

  useEffect(() => {
    if (queryString.parse(search).tab === VIEW_EDUCATION) {
      setView(VIEW_EDUCATION);
      setNewContentLink(ROUTES.EDUCATION_MATERIAL_CREATE);
    } else if (queryString.parse(search).tab === VIEW_QUESTIONNAIRE) {
      setView(VIEW_QUESTIONNAIRE);
      setNewContentLink(ROUTES.QUESTIONNAIRE_CREATE);
    } else if (queryString.parse(search).tab === VIEW_PRESET_TREATMENT) {
      setView(VIEW_PRESET_TREATMENT);
      setNewContentLink(ROUTES.LIBRARY_PRESET_TREATMENT_PLAN_CREATE);
    } else {
      setView(VIEW_EXERCISE);
      setNewContentLink(ROUTES.EXERCISE_CREATE);
    }
  }, [search]);

  useEffect(() => {
    if (systemLimits.length === 0) {
      dispatch(getSettings());
    }
  }, [systemLimits, dispatch]);

  useEffect(() => {
    if (systemLimits.length) {
      const limitLibrary = systemLimits.find(systemLimit => systemLimit.content_type === SYSTEM_TYPES.THERAPIST_CONTENT_LIMIT);
      if (!_.isEmpty(limitLibrary)) {
        setMaxLibraries(limitLibrary.value);
      }
    }
  }, [dispatch, systemLimits]);

  useEffect(() => {
    if (profile !== undefined) {
      setTherapistId(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (therapistId) {
      exerciseService.countTherapistLibraries(therapistId).then(res => {
        if (res.success) {
          setAllowCreateContent(res.data < maxLibraries);
        }
      });
    }
  }, [therapistId, view, maxLibraries]);

  useEffect(() => {
    if (selectedExercises.length || selectedMaterials.length || selectedQuestionnaires.length) {
      setIsShowPreviewList(true);
    } else {
      setIsShowPreviewList(false);
    }
  }, [selectedExercises, selectedMaterials, selectedQuestionnaires]);

  const handleSwitchFavorite = (id, isFavorite, type) => {
    switch (type) {
      case CATEGORY_TYPES.QUESTIONNAIRE:
        dispatch(updateFavoriteQuestionnaire(id, { is_favorite: isFavorite, therapist_id: therapistId }));
        break;
      case CATEGORY_TYPES.MATERIAL:
        dispatch(updateFavoriteEducationMaterial(id, { is_favorite: isFavorite, therapist_id: therapistId }));
        break;
      default:
        dispatch(updateFavoriteExercise(id, { is_favorite: isFavorite, therapist_id: therapistId }));
        break;
    }
  };

  const handleExercisesChange = (checked, id) => {
    if (checked) {
      selectedExercises.push(id);
      dispatch(addExerciseDataPreview(id));
    } else {
      _.remove(selectedExercises, n => n === id);
    }
    setSelectedExercises([...selectedExercises]);
  };

  const handleMaterialsChange = (checked, id) => {
    if (checked) {
      selectedMaterials.push(id);
      dispatch(addMaterialDataPreview(id));
    } else {
      _.remove(selectedMaterials, n => n === id);
    }
    setSelectedMaterials([...selectedMaterials]);
  };

  const handleQuestionnairesChange = (checked, id) => {
    if (checked) {
      selectedQuestionnaires.push(id);
      dispatch(addQuestionnaireDataPreview(id));
    } else {
      _.remove(selectedQuestionnaires, n => n === id);
    }
    setSelectedQuestionnaires([...selectedQuestionnaires]);
  };

  return (
    <>
      <div className="d-flex justify-content-end flex-wrap flex-md-nowrap align-items-center mb-3">
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-toolbar mb-2 mb-md-0">
            {newContentLink && (
              allowCreateContent ? (
                <Button
                  as={Link} to={newContentLink}
                >
                  <BsPlus size={20} className="mr-1"/>
                  {translate('common.new_content')}
                </Button>
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="button-tooltip">{translate('library.content_upload_reach_limit', { number: maxLibraries })}</Tooltip>}
                >
                  <span className="d-inline-block">
                    <Button disabled style={{ pointerEvents: 'none' }}>
                      <BsPlus size={20} className="mr-1"/>
                      {translate('common.new_content')}
                    </Button>
                  </span>
                </OverlayTrigger>
              )
            )}
          </div>
        </div>
      </div>

      <div className="position-relative library-panel">
        <Tab.Container mountOnEnter activeKey={view}>
          <Nav variant="tabs" className="mb-3">
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

          <Tab.Content>
            <Tab.Pane eventKey={VIEW_EXERCISE}>
              <Exercise
                handleSwitchFavorite={handleSwitchFavorite}
                therapistId={therapistId}
                allowCreateContent={allowCreateContent}
                onSectionChange={handleExercisesChange}
                selectedExercises={selectedExercises}
                isShowPreviewList={isShowPreviewList}/>
            </Tab.Pane>
            <Tab.Pane eventKey={VIEW_EDUCATION}>
              <EducationMaterial
                handleSwitchFavorite={handleSwitchFavorite}
                therapistId={therapistId}
                allowCreateContent={allowCreateContent}
                onSectionChange={handleMaterialsChange}
                selectedMaterials={selectedMaterials}
                isShowPreviewList={isShowPreviewList}/>
            </Tab.Pane>
            <Tab.Pane eventKey={VIEW_QUESTIONNAIRE}>
              <Questionnaire
                handleSwitchFavorite={handleSwitchFavorite}
                therapistId={therapistId}
                allowCreateContent={allowCreateContent}
                onSectionChange={handleQuestionnairesChange}
                selectedQuestionnaires={selectedQuestionnaires}
                isShowPreviewList={isShowPreviewList}/>
            </Tab.Pane>
            <Tab.Pane eventKey={VIEW_PRESET_TREATMENT}>
              <PresetTreatment/>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        { view !== VIEW_PRESET_TREATMENT &&
          <PreviewList
            selectedExercises={selectedExercises}
            selectedMaterials={selectedMaterials}
            selectedQuestionnaires={selectedQuestionnaires}
            onExerciseRemove={id => handleExercisesChange(false, id)}
            onMaterialRemove={id => handleMaterialsChange(false, id)}
            onQuestionnaireRemove={id => handleQuestionnairesChange(false, id)}
            showPreviewList={setIsShowPreviewList}
          />
        }
      </div>
    </>
  );
};

Library.propTypes = {
  translate: PropTypes.func
};

export default Library;
