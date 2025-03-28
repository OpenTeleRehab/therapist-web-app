import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Row,
  Col,
  Card,
  Form,
  Tooltip,
  OverlayTrigger,
  Button,
  Accordion
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsSearch,
  BsX,
  BsHeart,
  BsHeartFill,
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare, BsPersonFill
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import { getExercises } from 'store/exercise/actions';
import Spinner from 'react-bootstrap/Spinner';
import ViewExercise from 'views/Library/Exercise/view';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import CheckboxTree from 'react-checkbox-tree';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { FaRegCheckSquare } from 'react-icons/fa';
import _ from 'lodash';
import Select from 'react-select';
import scssColors from 'scss/custom.scss';

const Exercise = ({ translate, selectedExercises, onSectionChange, setViewExercise, viewExercise, setShowPreview, isOwnCreated, oldSelectedExercises, showPreview }) => {
  const dispatch = useDispatch();
  const { loading, exercises, filters, totalCount } = useSelector(state => state.exercise);
  const { exerciseCategoryTreeData } = useSelector((state) => state.category);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [formFields, setFormFields] = useState({
    search_value: '',
    favorites_only: false,
    my_contents_only: false
  });
  const [exercise, setExercise] = useState([]);
  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState(undefined);
  const { profile } = useSelector((state) => state.auth);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const therapistId = profile ? profile.id : '';

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    } else {
      setLanguage('');
    }
  }, [filters, profile]);

  useEffect(() => {
    if (language !== undefined) {
      dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.EXERCISE, lang: language }, CATEGORY_TYPES.EXERCISE));
    }
  }, [language, dispatch]);

  useEffect(() => {
    if (language !== undefined) {
      let serializedSelectedCats = [];
      Object.keys(selectedCategories).forEach(function (key) {
        serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
      });

      dispatch(getExercises({
        lang: language,
        filter: formFields,
        categories: serializedSelectedCats,
        page_size: pageSize,
        page: currentPage,
        therapist_id: therapistId
      }));
    }
  }, [language, formFields, selectedCategories, currentPage, pageSize, dispatch, therapistId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
    setCurrentPage(1);
  };

  const handleView = (exercise) => {
    setExercise(exercise);
    setViewExercise(true);
  };

  const handleViewClose = () => {
    setViewExercise(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
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
              <Form.Group className="search-box-with-icon">
                <BsSearch className="search-icon" />
                <Button
                  aria-label="Clear search"
                  variant="light"
                  className="clear-btn"
                  onClick={handleClearSearch}
                >
                  <BsX size={18} />
                </Button>
                <Form.Control
                  name="search_value"
                  value={formFields.search_value}
                  onChange={handleChange}
                  placeholder={translate('exercise.search')}
                  aria-label="Search"
                />
              </Form.Group>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Check
                  custom
                  type="checkbox"
                  name="favorites_only"
                  label={translate('library.show_favorites_only')}
                  id="showFavoriteExercisesOnly"
                  onChange={handleCheckBoxChange}
                />
                <Form.Check
                  custom
                  type="checkbox"
                  name="my_contents_only"
                  className="mt-3"
                  label={translate('library.show_my_contents_only')}
                  id="showMyExercisesOnly"
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
                  exerciseCategoryTreeData.map(category => (
                    <Card key={category.value} className="mb-3 rounded">
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
        <Col sm={7} md={8} lg={showPreview ? 7 : 9}>
          { exercises.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { exercises.length > 0 && (
            <>
              <Row>
                { exercises.map(exercise => (
                  <Col key={exercise.id} md={6} lg={showPreview ? 4 : 3}>
                    <Card className="exercise-card shadow-sm mb-4" role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && document.getElementById('view-exercise-' + exercise.id).click()}>
                      <div className="top-bar">
                        <div className="favorite-btn btn-link">
                          {exercise.is_favorite
                            ? <BsHeartFill size={20} />
                            : <BsHeart size={20} />
                          }
                        </div>
                        {oldSelectedExercises.includes(exercise.id) && !isOwnCreated ? (
                          <Form.Check
                            type="checkbox"
                            id={`exercise-${exercise.id}`}
                            checked={selectedExercises.includes(exercise.id)}
                            onChange={(e) => {
                              onSectionChange(e.currentTarget.checked, exercise.id); setShowPreview(true);
                            }}
                            custom={true}
                            disabled={oldSelectedExercises.includes(exercise.id) && !isOwnCreated}
                            label={`exercise-${exercise.id}`}
                          />
                        ) : (
                          <Form.Check
                            type="checkbox"
                            id={`exercise-${exercise.id}`}
                            checked={selectedExercises.includes(exercise.id)}
                            onChange={(e) => {
                              onSectionChange(e.currentTarget.checked, exercise.id); setShowPreview(true);
                            }}
                            custom={true}
                            disabled={oldSelectedExercises.includes(exercise.id) && !isOwnCreated}
                            label={`exercise-${exercise.id}`}
                          />
                        )
                        }
                      </div>
                      <div id={`view-exercise-${exercise.id}`} className="card-container" onClick={() => handleView(exercise)}>
                        <div className="card-img bg-light">
                          {
                            exercise.files.length > 0 && (
                              exercise.files[0].fileType === 'audio/mpeg' ? (
                                <div className="w-100 pt-5 pl-3 pr-3">
                                  <audio controls className="w-100">
                                    <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                                  </audio>
                                </div>
                              ) : (
                                <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}?thumbnail=1`} alt="Exercise" loading="lazy"/>
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
          { loading && <Spinner className="loading-spinner" animation="border" variant="primary" /> }
          { viewExercise && <ViewExercise showView={viewExercise} handleViewClose={handleViewClose} exercise={exercise} /> }
        </Col>
      </Row>
    </>
  );
};

Exercise.propTypes = {
  translate: PropTypes.func,
  selectedExercises: PropTypes.array,
  onSectionChange: PropTypes.func,
  viewExercise: PropTypes.bool,
  setViewExercise: PropTypes.func,
  setShowPreview: PropTypes.func,
  isOwnCreated: PropTypes.bool,
  oldSelectedExercises: PropTypes.array,
  showPreview: PropTypes.bool
};

export default withLocalize(Exercise);
