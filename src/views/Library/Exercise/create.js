import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Card,
  Accordion
} from 'react-bootstrap';
import {
  BsUpload,
  BsXCircle,
  BsX,
  BsPlusCircle,
  BsCaretDownFill,
  BsCaretRightFill,
  BsSquare,
  BsDashSquare
} from 'react-icons/bs';
import { FaRegCheckSquare } from 'react-icons/fa';
import CheckboxTree from 'react-checkbox-tree';
import { Link, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import * as ROUTES from 'variables/routes';
import {
  createExercise,
  getExercise, translateExercise,
  updateExercise
} from 'store/exercise/actions';

import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';
import { toMB } from '../../../utils/file';
import settings from '../../../settings';

const CreateExercise = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, lang } = useParams();
  const isCopy = useRouteMatch(ROUTES.EXERCISE_COPY);
  const isTranslate = useRouteMatch(ROUTES.EXERCISE_TRANSLATE);

  const { languages } = useSelector(state => state.language);
  const { exercise, filters } = useSelector(state => state.exercise);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const [language, setLanguage] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [formFields, setFormFields] = useState({
    title: '',
    include_feedback: true,
    get_pain_level: '',
    show_sets_reps: false,
    sets: '',
    reps: ''
  });
  const [inputFields, setInputFields] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [setsError, setSetsError] = useState(false);
  const [repsError, setRepsError] = useState(false);
  const [mediaUploads, setMediaUploads] = useState([]);
  const [mediaUploadsError, setMediaUploadsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFieldError, setInputFieldError] = useState([]);
  const [inputValueError, setInputValueError] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { categoryTreeData } = useSelector((state) => state.category);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (languages.length) {
      if (id && ((filters && filters.lang) || lang)) {
        setLanguage(lang || filters.lang);
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, filters, id, lang]);

  useEffect(() => {
    if (profile !== undefined) {
      setTherapistId(profile.id);
    }
  }, [profile]);

  const enableButtons = () => {
    const languageObj = languages.find(item => item.id === parseInt(language, 10));
    return languageObj && languageObj.code === languageObj.fallback && !isTranslate;
  };

  useEffect(() => {
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.EXERCISE, lang: language }));
  }, [language, dispatch]);

  useEffect(() => {
    if (id && language) {
      dispatch(getExercise(id, language));
    }
  }, [id, language, dispatch]);

  useEffect(() => {
    if (id && exercise.id) {
      const showSetsReps = exercise.sets > 0;
      setFormFields({
        title: isCopy ? `${exercise.title} (${translate('common.copy')})` : exercise.title,
        include_feedback: showSetsReps && exercise.include_feedback,
        get_pain_level: exercise.get_pain_level,
        show_sets_reps: showSetsReps,
        sets: exercise.sets,
        reps: exercise.reps
      });
      setMediaUploads(exercise.files);
      setInputFields(exercise.additional_fields || []);
      if (categoryTreeData.length) {
        const rootCategoryStructure = {};
        categoryTreeData.forEach(category => {
          const ids = [];
          JSON.stringify(category, (key, value) => {
            if (key === 'value') ids.push(value);
            return value;
          });
          rootCategoryStructure[category.value] = _.intersectionWith(exercise.categories, ids);
        });
        setSelectedCategories(rootCategoryStructure);
      }
    }
    // eslint-disable-next-line
  }, [id, exercise, categoryTreeData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleChangeInput = (index, e) => {
    const values = [...inputFields];
    values[index][e.target.name] = e.target.value;
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { field: '', value: '' }]);
    setTimeout(() => {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.title === '') {
      canSave = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    if (mediaUploads.length === 0) {
      canSave = false;
      setMediaUploadsError(true);
    } else {
      let totalSize = 0;
      mediaUploads.forEach(item => {
        totalSize += item.file ? item.file.size : (item.size || 0);
      });
      const error = toMB(totalSize) > settings.fileMaxUploadSize;
      setMediaUploadsError(error);
      if (error) {
        canSave = false;
      }
    }

    const errorInputFields = [];
    const errorValueFields = [];

    for (let i = 0; i < inputFields.length; i++) {
      if (inputFields[i].field === '') {
        canSave = false;
        errorInputFields.push(true);
      } else {
        errorInputFields.push(false);
      }

      if (inputFields[i].value === '') {
        canSave = false;
        errorValueFields.push(true);
      } else {
        errorValueFields.push(false);
      }
    }

    setInputFieldError(errorInputFields);
    setInputValueError(errorValueFields);

    if (formFields.show_sets_reps) {
      if (formFields.sets > 0) {
        setSetsError(false);
      } else {
        canSave = false;
        setSetsError(true);
      }

      if (formFields.reps > 0) {
        setRepsError(false);
      } else {
        canSave = false;
        setRepsError(true);
      }
    } else {
      setSetsError(false);
      setRepsError(false);
    }

    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    if (canSave) {
      setIsLoading(true);
      const payload = {
        ...formFields,
        sets: formFields.show_sets_reps ? formFields.sets : 0,
        reps: formFields.show_sets_reps ? formFields.reps : 0,
        include_feedback: formFields.show_sets_reps && formFields.include_feedback,
        additional_fields: JSON.stringify(inputFields),
        categories: serializedSelectedCats,
        lang: language,
        therapist_id: therapistId,
        copy_id: isCopy ? id : ''
      };
      if (id && !isCopy && !isTranslate) {
        dispatch(updateExercise(id, payload, mediaUploads))
          .then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY);
            }
            setIsLoading(false);
          });
      } else {
        if (isTranslate) {
          dispatch(translateExercise({ ...payload, id })).then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY);
            }
            setIsLoading(false);
          });
        } else {
          dispatch(createExercise(payload, mediaUploads)).then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY);
            }
            setIsLoading(false);
          });
        }
      }
    }
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const fileObj = [];
    fileObj.push(files);
    let i;
    for (i = 0; i < fileObj[0].length; i++) {
      const file = fileObj[0][i];
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2);
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        mediaUploads.push({ url: reader.result, fileName, fileSize, fileType, file });
        setMediaUploads([...mediaUploads]);
      };
    }
  };

  const handleFileRemove = (index) => {
    const mediaFiles = mediaUploads;
    if (index !== -1) {
      mediaFiles.splice(index, 1);
      setMediaUploads([...mediaFiles]);
    }
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleNewField = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  const handleFileUpload = (e) => {
    if (e.key === 'Enter') {
      document.getElementById('file').click();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{id ? isTranslate ? translate('exercise.translate') : isCopy ? translate('exercise.copy') : translate('exercise.edit') : translate('exercise.create')}</h1>
      </div>

      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Row>
          <Col sm={4} xl={3}>
            <div className="exercise-media">
              <h4>{translate('exercise.media')}</h4>
              { mediaUploads.map((mediaUpload, index) => (
                <div key={index} className="mb-2 position-relative w-75">
                  {!isTranslate && (
                    <div className="position-absolute remove-btn-wrapper">
                      <BsXCircle size={20} onClick={() => handleFileRemove(index)}/>
                    </div>
                  )}

                  { mediaUpload.fileType === 'audio/mpeg' &&
                    <div className="img-thumbnail w-100 pt-2">
                      <audio controls className="w-100">
                        <source src={mediaUpload.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${mediaUpload.id}`} type="audio/ogg" />
                      </audio>
                    </div>
                  }

                  { (mediaUpload.fileType !== 'audio/mpeg' && mediaUpload.fileType !== 'video/mp4') &&
                    <img src={mediaUpload.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${mediaUpload.id}`} alt="..." className="w-100 img-thumbnail" loading="lazy"/>
                  }

                  { mediaUpload.fileType === 'video/mp4' &&
                    <video className="w-100 img-thumbnail" controls>
                      <source src={mediaUpload.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${mediaUpload.id}`} type="video/mp4" />
                    </video>
                  }
                  <div>{mediaUpload.fileName} {mediaUpload.fileSize ? ('(' + mediaUpload.fileSize + 'kB )') : ''}</div>
                </div>
              ))}
              {!isTranslate && (
                <div className="btn btn-sm bg-white btn-outline-primary text-primary position-relative overflow-hidden" tabIndex="0" role="button" onKeyPress={(event) => handleFileUpload(event)} >
                  <BsUpload size={15}/> {translate('exercise.media_upload')}
                  <input type="file" id="file" name="file" className="position-absolute upload-btn" onChange={handleFileChange} multiple accept="audio/*, video/*, image/*" aria-label="Upload" />
                </div>
              )}
              { mediaUploads.length === 0 && mediaUploadsError &&
                <div className="text-danger">{translate('exercise.media_upload.required')}</div>
              }
              { mediaUploads.length > 0 && mediaUploadsError &&
                <div className="text-danger">{translate('exercise.media_upload.max_size', { size: settings.fileMaxUploadSize })}</div>
              }
            </div>
          </Col>
          <Col sm={7} xl={8} className="mb-5">
            <Form.Group controlId="formLanguage">
              <Form.Label>{translate('common.show_language.version')}</Form.Label>
              <Select
                isDisabled={!id || isTranslate}
                classNamePrefix="filter"
                value={languages.filter(option => option.id.toString() === language.toString())}
                getOptionLabel={option => option.name}
                options={languages}
                onChange={(e) => setLanguage(e.id)}
                styles={customSelectStyles}
                aria-label="Language"
              />
            </Form.Group>
            <h4>{translate('exercise.information')}</h4>
            <Form.Group controlId="formTitle">
              <Form.Label>{translate('exercise.title')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                name="title"
                onChange={handleChange}
                value={formFields.title}
                placeholder={translate('exercise.title.placeholder')}
                isInvalid={titleError}
              />
              <Form.Control.Feedback type="invalid">
                {translate('exercise.title.required')}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formShowSetsReps">
              <Form.Check
                name="show_sets_reps"
                onChange={handleCheck}
                value={true}
                checked={formFields.show_sets_reps}
                label={translate('exercise.set_efault_exercise_sets_and_reps')}
                disabled={isTranslate}
              />
            </Form.Group>
            {formFields.show_sets_reps && (
              <Card bg="light" body className="mb-3">
                <Form.Row>
                  <Form.Group as={Col} controlId="formSets">
                    <Form.Label>{translate('exercise.sets')}</Form.Label>
                    <span className="text-dark ml-1">*</span>
                    <Form.Control
                      type="number"
                      name="sets"
                      placeholder={translate('exercise.sets.placeholder')}
                      value={formFields.sets}
                      onChange={handleChange}
                      isInvalid={setsError}
                      disabled={isTranslate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {translate('exercise.sets.required')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>{translate('exercise.reps')}</Form.Label>
                    <span className="text-dark ml-1">*</span>
                    <Form.Control
                      type="number"
                      name="reps"
                      placeholder={translate('exercise.reps.placeholder')}
                      value={formFields.reps}
                      onChange={handleChange}
                      isInvalid={repsError}
                      disabled={isTranslate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {translate('exercise.reps.required')}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Group controlId="formIncludeFeedback">
                  <Form.Check
                    name="include_feedback"
                    onChange={handleCheck}
                    value={true}
                    checked={formFields.include_feedback}
                    label={translate('exercise.include_collecting_feedback')}
                    disabled={isTranslate}
                  />
                </Form.Group>
              </Card>
            )}
            <Form.Group controlId="formGetPainLevel">
              <Form.Check
                name="get_pain_level"
                onChange={handleCheck}
                value={true}
                checked={formFields.get_pain_level}
                label={translate('exercise.get_pain_level_feedback')}
                disabled={isTranslate}
              />
            </Form.Group>

            <Accordion className="mb-3" defaultActiveKey={1}>
              {
                categoryTreeData.map((category, index) => (
                  <Card key={index}>
                    <Accordion.Toggle eventKey={index + 1} className="d-flex align-items-center card-header border-0" onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} disabled={isTranslate}>
                      {category.label}
                      <div className="ml-auto">
                        <span className="mr-3">
                          {selectedCategories[category.value] ? selectedCategories[category.value].length : 0} {translate('category.selected')}
                        </span>
                        <ContextAwareToggle eventKey={index + 1} />
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={!isTranslate ? index + 1 : ''}>
                      <Card.Body>
                        <CheckboxTree
                          nodes={category.children || []}
                          checked={selectedCategories[category.value] ? selectedCategories[category.value] : []}
                          expanded={expanded}
                          onCheck={(checked) => handleSetSelectedCategories(category.value, checked)}
                          onExpand={expanded => setExpanded(expanded)}
                          icons={{
                            check: <FaRegCheckSquare size={40} color="black" />,
                            uncheck: <BsSquare size={40} color="black" />,
                            halfCheck: <BsDashSquare size={40} color="black" />,
                            expandClose: <BsCaretRightFill size={40} color="black" />,
                            expandOpen: <BsCaretDownFill size={40} color="black" />
                          }}
                          showNodeIcon={false}
                        />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ))
              }
            </Accordion>

            {
              inputFields.map((inputField, index) => (
                <Card key={index} className="bg-light mb-3 additional-field">
                  <Card.Body>
                    {enableButtons() &&
                      <div className="remove-btn-container">
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('common.remove')}</Tooltip>}>
                          <Button
                            aria-label="Remove exercise"
                            variant="outline-danger"
                            className="btn-remove"
                            onClick={() => handleRemoveFields(index)}
                          >
                            <BsX size={20} />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    }
                    <Form.Group controlId={`formLabel${index}`}>
                      <Form.Label>{translate('exercise.additional_field.label')}</Form.Label>
                      <span className="text-dark ml-1">*</span>
                      <Form.Control
                        name="field"
                        placeholder={translate('exercise.additional_field.placeholder.label')}
                        value={inputField.field}
                        onChange={e => handleChangeInput(index, e)}
                        isInvalid={inputFieldError[index]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {translate('exercise.additional_field.label.required')}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId={`formValue${index}`}>
                      <Form.Label>{translate('exercise.additional_field.value')}</Form.Label>
                      <span className="text-dark ml-1">*</span>
                      <Form.Control
                        name="value"
                        as="textarea" rows={3}
                        placeholder={translate('exercise.additional_field.placeholder.value')}
                        value={inputField.value}
                        onChange={event => handleChangeInput(index, event)}
                        isInvalid={inputValueError[index]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {translate('exercise.additional_field.value.required')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Card.Body>
                </Card>
              ))
            }

            {enableButtons() &&
              <Form.Group>
                <Button
                  aria-label="Add file"
                  variant="link"
                  onClick={handleAddFields}
                  className="p-0 mr-1"
                  onKeyPress={(e) => handleNewField(e)}
                >
                  <BsPlusCircle size={20} /> {translate('exercise.additional_field.add_more_field')}
                </Button>
              </Form.Group>
            }
          </Col>
        </Row>
        <Row>
          <Col sm={12} xl={11} className="question-wrapper">
            <div className="sticky-btn d-flex justify-content-end">
              <div className="py-2 questionnaire-save-cancel-wrapper px-3">
                <Button
                  aria-label="Save"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {translate('common.save')}
                </Button>
                <Button
                  aria-label="Cancel"
                  className="ml-2"
                  variant="outline-dark"
                  as={Link}
                  to={ROUTES.LIBRARY}
                  disabled={isLoading}
                >
                  {translate('common.cancel')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

CreateExercise.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CreateExercise);
