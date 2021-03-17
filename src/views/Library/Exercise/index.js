import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Row, Col, Card, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'components/Pagination';
import { getExercises } from 'store/exercise/actions';
import SearchInput from 'components/Form/SearchInput';
import * as ROUTES from 'variables/routes';
import ViewExercise from './view';
import { getCategories } from 'store/category/actions';
import CustomTree from 'components/Tree';
import { CATEGORY_TYPES } from 'variables/category';
import { EditAction } from 'components/ActionIcons';

let timer = null;
const Exercise = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, exercises, filters } = useSelector(state => state.exercise);
  const { profile } = useSelector((state) => state.auth);
  const { languages } = useSelector(state => state.language);
  const { categories } = useSelector((state) => state.category);
  const [id, setId] = useState(null);
  const [showView, setShowView] = useState(false);

  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [language, setLanguage] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [formFields, setFormFields] = useState({
    search_value: ''
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoryIndexes, setSelectedCategoryIndexes] = useState([]);
  const treeColumns = [
    { name: 'title', title: translate('common.category') }
  ];
  const tableColumnExtensions = [
    { columnName: 'title', width: 'auto', wordWrapEnabled: true }
  ];

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    }
  }, [filters, profile]);

  useEffect(() => {
    if (profile !== undefined) {
      setTherapistId(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (language) {
      dispatch(getCategories({ type: CATEGORY_TYPES.EXERCISE, lang: language }));
    }
  }, [language, dispatch]);

  useEffect(() => {
    if (categories.length) {
      const selectedCatIndexes = [];
      categories.forEach((cat, index) => {
        if (selectedCategories.indexOf(cat.id) >= 0) {
          selectedCatIndexes.push(index);
        }
      });

      setSelectedCategoryIndexes(selectedCatIndexes);
    }
  }, [categories, selectedCategories]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getExercises({
        lang: language,
        filter: formFields,
        categories: selectedCategories,
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

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
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

  const onSelectChange = (rowIds) => {
    const selectedCats = categories.filter((cat, index) => rowIds.indexOf(index) >= 0).map(cat => cat.id);
    setSelectedCategories(selectedCats);
  };

  const handleEdit = (id) => {
    history.push(ROUTES.EXERCISE_EDIT.replace(':id', id));
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
                placeholder={translate('education_material.search')}
                onChange={handleChange}
                onClear={handleClearSearch}
              />
            </Card.Header>
            <Card.Body>
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
              <CustomTree
                columns={treeColumns}
                treeColumnName="title"
                tableColumnExtensions={tableColumnExtensions}
                selection={selectedCategoryIndexes}
                onSelectChange={onSelectChange}
                data={categories.map(category => {
                  return {
                    id: category.id,
                    title: category.title,
                    parentId: category.parent || null
                  };
                })}
              />
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
                    {therapistId === exercise.therapist_id && (
                      <div className="position-absolute edit-btn">
                        <EditAction onClick={() => handleEdit(exercise.id)} />
                      </div>
                    )}
                    <Card className="exercise-card shadow-sm mb-4" onClick={() => handleView(exercise.id)}>
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
  translate: PropTypes.func
};

export default withLocalize(Exercise);
