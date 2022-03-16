import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Row, Col, Card, Form, Tooltip, OverlayTrigger, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare,
  BsPersonFill
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import { getExercises, deleteExercise } from 'store/exercise/actions';
import SearchInput from 'components/Form/SearchInput';
import * as ROUTES from 'variables/routes';
import ViewExercise from './view';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { FavoriteAction, NonFavoriteAction, DeleteAction } from 'components/ActionIcons';
import _ from 'lodash';
import CheckboxTree from 'react-checkbox-tree';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { FaRegCheckSquare } from 'react-icons/fa';
import Dialog from 'components/Dialog';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';

let timer = null;
const Exercise = ({ translate, handleSwitchFavorite, therapistId, allowCreateContent, onSectionChange, selectedExercises, isShowPreviewList }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, exercises, filters, totalCount } = useSelector(state => state.exercise);
  const { profile } = useSelector((state) => state.auth);
  const { languages } = useSelector(state => state.language);
  const [previewExercise, setPreviewExercise] = useState(null);
  const { categoryTreeData } = useSelector((state) => state.category);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const [showCopy, setShowCopy] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [id, setId] = useState();
  const [show, setShow] = useState(false);

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState('');
  const [formFields, setFormFields] = useState({
    search_value: '',
    favorites_only: false,
    my_contents_only: false
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    }
  }, [filters, profile]);

  useEffect(() => {
    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getExercises({
        lang: language,
        filter: formFields,
        categories: serializedSelectedCats,
        page_size: pageSize,
        page: currentPage,
        therapist_id: therapistId
      }));
    }, 500);
  }, [language, formFields, selectedCategories, currentPage, pageSize, dispatch, therapistId]);

  useEffect(() => {
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.EXERCISE, lang: language }));
  }, [language, dispatch]);

  useEffect(() => {
    if (categoryTreeData.length) {
      const rootCategoryStructure = {};
      categoryTreeData.forEach(category => {
        rootCategoryStructure[category.value] = [];
      });
      setSelectedCategories(rootCategoryStructure);
    }
  }, [categoryTreeData]);

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setCurrentPage(1);
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
    setCurrentPage(1);
  };

  const handleView = (exercise) => {
    setPreviewExercise(exercise);
    setId(exercise.id);

    if (!exercise.therapist_id && allowCreateContent) {
      setShowCopy(true);
    }

    if (exercise.therapist_id === therapistId) {
      setShowEdit(true);
    }
  };

  const handleViewClose = () => {
    setPreviewExercise(null);
    setShowEdit(false);
    setShowCopy(false);
  };

  const handleDelete = (id, type) => {
    setId(id);
    setShow(true);
  };

  const handleClose = () => {
    setId(null);
    setShow(false);
  };

  const handleConfirm = () => {
    dispatch(deleteExercise(id)).then(result => {
      if (result) {
        handleClose();
      }
    });
  };

  const handleEdit = (id) => {
    history.push(ROUTES.EXERCISE_EDIT.replace(':id', id));
  };

  const handleCopy = (id) => {
    history.push(ROUTES.EXERCISE_COPY.replace(':id', id));
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

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3} className="library-panel__filter">
          <Card bg="info">
            <Card.Header>
              <SearchInput
                name="search_value"
                value={formFields.search_value}
                placeholder={translate('exercise.search')}
                onChange={handleChange}
                onClear={handleClearSearch}
              />
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Check
                  custom
                  type="checkbox"
                  name="favorites_only"
                  label={translate('library.show_favorites_only')}
                  id="showFavoritesOnly"
                  onChange={handleCheckBoxChange}
                />
                <Form.Check
                  custom
                  type="checkbox"
                  name="my_contents_only"
                  className="mt-3"
                  label={translate('library.show_my_contents_only')}
                  id="showMyContentsOnly"
                  onChange={handleCheckBoxChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.language')}</Form.Label>
                <Select
                  classNamePrefix="filter"
                  value={languages.filter(option => option.id === language)}
                  getOptionLabel={option => option.name}
                  options={languages}
                  onChange={(e) => setLanguage(e.id)}
                  styles={customSelectStyles}
                  aria-label="Language"
                />
              </Form.Group>
              <Accordion>
                {
                  categoryTreeData.map(category => (
                    <Card className="mb-3 rounded" key={category.value}>
                      <Accordion.Toggle eventKey={category.value} className="d-flex align-items-center card-header border-0">
                        <span className="text-truncate pr-2">{category.label}</span>
                        <div className="ml-auto text-nowrap">
                          <span className="mr-3">
                            {selectedCategories[category.value] ? selectedCategories[category.value].length : 0}
                          </span>
                          <ContextAwareToggle eventKey={category.value} />
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={category.value}>
                        <Card.Body>
                          <CheckboxTree
                            nodes={category.children || []}
                            checked={selectedCategories[category.value] ? selectedCategories[category.value] : []}
                            expanded={expanded}
                            onCheck={checked => handleSetSelectedCategories(category.value, checked)}
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
            </Card.Body>
          </Card>
        </Col>
        <Col sm={7} md={8} lg={isShowPreviewList ? 7 : 9}>
          { exercises.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { exercises.length > 0 && (
            <>
              <Row>
                { exercises.map(exercise => (
                  <Col key={exercise.id} md={6} lg={isShowPreviewList ? 4 : 3}>
                    <Card className="exercise-card shadow-sm mb-4" role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && document.getElementById('exercise-' + exercise.id).click()}>
                      <div className="top-bar">
                        <div className="favorite-btn">
                          {exercise.is_favorite
                            ? <NonFavoriteAction onClick={() => handleSwitchFavorite(exercise.id, 0, CATEGORY_TYPES.EXERCISE)} />
                            : <FavoriteAction onClick={() => handleSwitchFavorite(exercise.id, 1, CATEGORY_TYPES.EXERCISE)} />
                          }
                        </div>
                        <Form.Check
                          type="checkbox"
                          id={exercise.id}
                          checked={selectedExercises.includes(exercise.id)}
                          onChange={(e) => onSectionChange(e.currentTarget.checked, exercise.id)}
                          custom={true}
                          label={`exercise-${exercise.id}`}
                        />
                      </div>
                      <div id={`exercise-${exercise.id}`} className="card-container" onClick={() => handleView(exercise)}>
                        <div className="card-img bg-light">
                          {
                            exercise.files.length > 0 && (
                              (exercise.files[0].fileType === 'audio/mpeg' &&
                                <div className="w-100 pt-5 pl-3 pr-3">
                                  <audio controls className="w-100">
                                    <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                                  </audio>
                                </div>
                              ) ||
                              (exercise.files[0].fileType === 'video/mp4' &&
                                <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}?thumbnail=1`} alt="Exercise"
                                />
                              ) ||
                              ((exercise.files[0].fileType !== 'audio/mpeg' && exercise.files[0].fileType !== 'video/mp4') &&
                                <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} alt="Exercise"
                                />
                              )
                            )
                          }
                        </div>
                        <Card.Body className="d-flex flex-column justify-content-between">
                          <Card.Title>
                            {
                              exercise.title.length <= 50
                                ? <h5 className="card-title">
                                  {therapistId === exercise.therapist_id && (
                                    <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                                  )}
                                  { exercise.title }
                                </h5>
                                : (
                                  <OverlayTrigger
                                    overlay={<Tooltip id="button-tooltip-2">{ exercise.title }</Tooltip>}
                                  >
                                    <h5 className="card-title">
                                      {therapistId === exercise.therapist_id && (
                                        <BsPersonFill size={20} className="owner-btn mr-1 mb-1" />
                                      )}
                                      { exercise.title }
                                    </h5>
                                  </OverlayTrigger>
                                )
                            }
                          </Card.Title>
                          {exercise.sets > 0 && (
                            <Card.Text>
                              {translate('exercise.number_of_sets_and_reps', { sets: exercise.sets, reps: exercise.reps })}
                            </Card.Text>
                          )}
                        </Card.Body>
                      </div>
                      <div className="d-flex justify-content-end">
                        {therapistId === exercise.therapist_id && (
                          <div className="position-absolute delete-btn">
                            <DeleteAction className="ml-1" onClick={() => handleDelete(exercise.id)} />
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageSizes={[60, 120, 180, 240]}
              />
            </>
          )}

          { loading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
        </Col>
      </Row>
      {previewExercise && <ViewExercise showView handleViewClose={handleViewClose} exercise={previewExercise} handleEdit={() => handleEdit(id)} handleCopy={() => handleCopy(id)} showEdit={showEdit} showCopy={showCopy} />}

      <Dialog
        show={show}
        title={translate('exercise.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

Exercise.propTypes = {
  translate: PropTypes.func,
  handleSwitchFavorite: PropTypes.func,
  therapistId: PropTypes.number,
  allowCreateContent: PropTypes.bool,
  onSectionChange: PropTypes.func,
  selectedExercises: PropTypes.array,
  handleCopy: PropTypes.func,
  handEdit: PropTypes.func,
  isShowPreviewList: PropTypes.bool
};

export default withLocalize(Exercise);
