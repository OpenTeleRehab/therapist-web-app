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
import { BsSearch, BsX } from 'react-icons/bs';

import Pagination from 'components/Pagination';
import { getExercises } from 'store/exercise/actions';
import Spinner from 'react-bootstrap/Spinner';
import { BiChevronLeftCircle } from 'react-icons/bi';

const Exercise = ({ translate, selectedExercises, setSelectedExercises }) => {
  const dispatch = useDispatch();
  const { loading, exercises } = useSelector(state => state.exercise);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: ''
  });
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    dispatch(getExercises({
      filter: formFields,
      page_size: pageSize,
      page: currentPage
    })).then(result => {
      if (result) {
        setTotalCount(result.total_count);
      }
    });
  }, [formFields, currentPage, pageSize, dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
  };

  const handleCheck = (e, id) => {
    if (e.currentTarget.checked) {
      const obj = exercises.find(o => o.id === id);
      selectedExercises.push(obj);
      setSelectedExercises([...selectedExercises]);
    } else {
      const selectedItems = selectedExercises;
      const index = selectedItems.findIndex(x => x.id === id);
      if (index !== -1) {
        selectedItems.splice(index, 1);
        setSelectedExercises([...selectedItems]);
      }
    }
  };

  const handleShow = () => {
    const test = !isShow;
    setIsShow(test);
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
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" disabled>
                  <option>Category Item</option>
                  <option>Category Item</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" disabled>
                  <option>Category Item</option>
                  <option>Category Item</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" disabled>
                  <option>Category Item</option>
                  <option>Category Item</option>
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
                      <div className="card-img bg-light">
                        <div className="position-absolute w-100">
                          <Form.Check type="checkbox" id = "checkTest" className="float-right action" onChange={(e) => handleCheck(e, exercise.id)} />
                        </div>
                        {
                          exercise.files.length > 0 && (
                            (exercise.files[0].fileType === 'audio/mpeg' &&
                              <div className="w-100">
                                <audio controls className="w-100">
                                  <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                                </audio>
                              </div>
                            ) ||
                            (exercise.files[0].fileType === 'video/mp4' &&
                              <video controls className="w-100 h-100">
                                <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="video/mp4" />
                              </video>
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
        <div className="position-absolute p-2 show-select-exercise-button"><BiChevronLeftCircle size={25} onClick={handleShow}/></div>
        {isShow &&
          <div className="position-absolute w-25 selected-exercise-wrapper">
            { selectedExercises.map(exercise => (
              <Col key={exercise.id} className="col-sm">
                <Card className="exercise-card shadow-sm mb-4">
                  <div className="card-img bg-light">
                    <div className="position-absolute w-100">
                      <Form.Check type="checkbox" className="float-right action" onChange={() => handleCheck(exercise.id)} />
                    </div>
                    {
                      exercise.files.length > 0 && (
                        (exercise.files[0].fileType === 'audio/mpeg' &&
                          <div className="w-100">
                            <audio controls className="w-100">
                              <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                            </audio>
                          </div>
                        ) ||
                        (exercise.files[0].fileType === 'video/mp4' &&
                          <video controls className="w-100 h-100">
                            <source src={`${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${exercise.files[0].id}`} type="video/mp4" />
                          </video>
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
          </div>
        }
      </Row>
    </>
  );
};

Exercise.propTypes = {
  translate: PropTypes.func,
  selectedExercises: PropTypes.array,
  setSelectedExercises: PropTypes.func
};

export default withLocalize(Exercise);
