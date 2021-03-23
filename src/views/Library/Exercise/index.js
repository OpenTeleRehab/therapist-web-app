import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Row, Col, Card, Form, Tooltip, OverlayTrigger, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IoPerson } from 'react-icons/io5';
import Spinner from 'react-bootstrap/Spinner';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import { getExercises } from 'store/exercise/actions';
import SearchInput from 'components/Form/SearchInput';
import * as ROUTES from 'variables/routes';
import ViewExercise from './view';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { CopyAction, EditAction, FavoriteAction, NonFavoriteAction } from 'components/ActionIcons';
import _ from 'lodash';
import CheckboxTree from 'react-checkbox-tree';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { FaRegCheckSquare } from 'react-icons/fa';

let timer = null;
const Exercise = ({ translate, handleSwitchFavorite, therapistId, allowCreateContent }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, exercises, filters } = useSelector(state => state.exercise);
  const { profile } = useSelector((state) => state.auth);
  const { languages } = useSelector(state => state.language);
  const [id, setId] = useState(null);
  const [showView, setShowView] = useState(false);
  const { categoryTreeData } = useSelector((state) => state.category);

  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
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
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
  };

  const handleView = (id) => {
    setId(id);
    setShowView(true);
  };

  const handleViewClose = () => {
    setId('');
    setShowView(false);
  };

  const handleEdit = (id) => {
    history.push(ROUTES.EXERCISE_EDIT.replace(':id', id));
  };

  const handleCopy = (id) => {
    history.push(ROUTES.EXERCISE_COPY.replace(':id', id));
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3}>
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
                <Form.Control as="select" value={language} onChange={handleLanguageChange}>
                  {languages.map((language, index) => (
                    <option key={index} value={language.id}>
                      {language.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {
                categoryTreeData.map(category => (
                  <Accordion key={category.value} className="mb-3" defaultActiveKey={category.value}>
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey={category.value} className="d-flex align-items-center">
                        {category.label}
                        <div className="ml-auto text-nowrap">
                          <span className="mr-3">
                            {selectedCategories[category.value] ? selectedCategories[category.value].length : 0} {translate('category.selected')}
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
                  </Accordion>
                ))
              }
            </Card.Body>
          </Card>
        </Col>
        <Col sm={7} md={8} lg={9}>
          { exercises.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { exercises.length > 0 && (
            <>
              <Row>
                { exercises.map(exercise => (
                  <Col key={exercise.id} md={6} lg={3}>
                    <Card className="exercise-card shadow-sm mb-4">
                      <div className="top-bar">
                        <div className="favorite-btn">
                          {exercise.is_favorite
                            ? <NonFavoriteAction onClick={() => handleSwitchFavorite(exercise.id, 0, CATEGORY_TYPES.EXERCISE)} />
                            : <FavoriteAction onClick={() => handleSwitchFavorite(exercise.id, 1, CATEGORY_TYPES.EXERCISE)} />
                          }
                        </div>
                        {therapistId === exercise.therapist_id && (
                          <div className="owner-btn">
                            <IoPerson size={20} />
                          </div>
                        )}
                        {therapistId === exercise.therapist_id && (
                          <div className="edit-btn">
                            <EditAction onClick={() => handleEdit(exercise.id)} />
                          </div>
                        )}
                        {!exercise.therapist_id && allowCreateContent && (
                          <div className="edit-btn">
                            <CopyAction onClick={() => handleCopy(exercise.id)} />
                          </div>
                        )}
                      </div>
                      <div className="card-container" onClick={() => handleView(exercise.id)}>
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
                                <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}/?thumbnail=1`} alt="Exercise"
                                />
                              ) ||
                              ((exercise.files[0].fileType !== 'audio/mpeg' && exercise.files[0].fileType !== 'video/mp4') &&
                                <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} alt="Exercise"
                                />
                              )
                            )
                          }
                        </div>
                        <Card.Body>
                          <Card.Title>
                            {
                              exercise.title.length <= 50
                                ? <h5 className="card-title">{ exercise.title }</h5>
                                : (
                                  <OverlayTrigger
                                    overlay={<Tooltip id="button-tooltip-2">{ exercise.title }</Tooltip>}
                                  >
                                    <h5 className="card-title">{ exercise.title }</h5>
                                  </OverlayTrigger>
                                )
                            }
                          </Card.Title>
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
                pageSizes={[8, 16, 24, 32, 40]}
              />
            </>
          )}

          { loading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
        </Col>
      </Row>
      {showView && <ViewExercise showView={showView} handleViewClose={handleViewClose} id={id} />}
    </>
  );
};

Exercise.propTypes = {
  translate: PropTypes.func,
  handleSwitchFavorite: PropTypes.func,
  therapistId: PropTypes.string,
  allowCreateContent: PropTypes.bool
};

export default withLocalize(Exercise);
