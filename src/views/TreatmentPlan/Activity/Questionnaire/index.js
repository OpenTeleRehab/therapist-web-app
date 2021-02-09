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
import Spinner from 'react-bootstrap/Spinner';
import { RiChatQuoteLine } from 'react-icons/ri';
import { getQuestionnaires } from 'store/questionnaire/actions';

let timer = null;
const Questionnaire = ({ translate, selectedMaterials, onSectionChange }) => {
  const dispatch = useDispatch();
  const { loading, questionnaires } = useSelector(state => state.questionnaire);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: ''
  });

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getQuestionnaires({
        filter: formFields,
        page_size: pageSize,
        page: currentPage
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [formFields, currentPage, pageSize, dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
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
            </Card.Body>
          </Card>
        </Col>
        <Col sm={7} md={8} lg={9}>
          { questionnaires.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { questionnaires.length > 0 && (
            <>
              <Row>
                { questionnaires.map(questionnaire => (
                  <Col key={questionnaire.id} md={6} lg={3}>
                    <Card className="exercise-card material-card shadow-sm mb-4">
                      <div className="card-img bg-light">
                        <div className="position-absolute w-100">
                          <Form.Check
                            type="checkbox"
                            className="float-right action"
                            checked={selectedMaterials.includes(questionnaire.id)}
                            onChange={(e) => onSectionChange(e.currentTarget.checked, questionnaire.id)}
                          />
                        </div>

                        <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
                          <RiChatQuoteLine size={80} />
                          <p>{translate('activity.questionnaire').toUpperCase()}</p>
                        </div>
                      </div>
                      <Card.Body className="d-flex flex-column justify-content-between">
                        <Card.Title>
                          {
                            questionnaire.title.length <= 50
                              ? <h5 className="card-title">{ questionnaire.title }</h5>
                              : (
                                <OverlayTrigger
                                  overlay={<Tooltip id="button-tooltip-2">{ questionnaire.title }</Tooltip>}
                                >
                                  <h5 className="card-title">{ questionnaire.title }</h5>
                                </OverlayTrigger>
                              )
                          }
                        </Card.Title>
                        <Card.Text>
                          <b>{questionnaire.questions.length}</b> {translate('activity.questionnaire.questions')}
                        </Card.Text>
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
    </>
  );
};

Questionnaire.propTypes = {
  translate: PropTypes.func,
  selectedMaterials: PropTypes.array,
  onSectionChange: PropTypes.func
};

export default withLocalize(Questionnaire);
