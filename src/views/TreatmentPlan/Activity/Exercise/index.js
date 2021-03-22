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
  Button
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch, BsX, BsHeart, BsHeartFill } from 'react-icons/bs';

import Pagination from 'components/Pagination';
import { getExercises } from 'store/exercise/actions';
import Spinner from 'react-bootstrap/Spinner';
import ViewExercise from './viewExercise';
import { IoPerson } from 'react-icons/io5';

let timer = null;
const Exercise = ({ translate, selectedExercises, onSectionChange, setViewExercise, viewExercise }) => {
  const dispatch = useDispatch();
  const { loading, exercises, filters } = useSelector(state => state.exercise);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: ''
  });
  const [exercise, setExercise] = useState([]);
  const [therapistId, setTherapistId] = useState('');

  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);

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
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getExercises({
        lang: language,
        filter: formFields,
        page_size: pageSize,
        page: currentPage,
        therapist_id: therapistId
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [language, formFields, currentPage, pageSize, dispatch, therapistId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleView = (exercise) => {
    setExercise(exercise);
    setViewExercise(true);
  };

  const handleViewClose = () => {
    setViewExercise(false);
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3}>
          <Card bg="info">
            <Card.Header>
              <Form.Group className="search-box-with-icon">
                <BsSearch className="search-icon" />
                <Button
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
                />
              </Form.Group>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('common.category_item')}</option>
                  <option>{translate('common.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('common.category_item')}</option>
                  <option>{translate('common.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('common.category_item')}</option>
                  <option>{translate('common.category_item')}</option>
                </Form.Control>
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
                        <div className="favorite-btn btn-link">
                          {exercise.is_favorite
                            ? <BsHeartFill size={25} />
                            : <BsHeart size={25} />
                          }
                        </div>
                        {therapistId === exercise.therapist_id && (
                          <div className="owner-btn">
                            <IoPerson size={20} />
                          </div>
                        )}
                        <Form.Check
                          type="checkbox"
                          className="action"
                          checked={selectedExercises.includes(exercise.id)}
                          onChange={(e) => onSectionChange(e.currentTarget.checked, exercise.id)}
                        />
                      </div>
                      <div className="card-container" onClick={() => handleView(exercise)}>
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
  setViewExercise: PropTypes.func
};

export default withLocalize(Exercise);
