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
  BsPerson,
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import { getQuestionnaires } from 'store/questionnaire/actions';
import ViewQuestionnaire from './viewQuestionnaire';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import CheckboxTree from 'react-checkbox-tree';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { FaRegCheckSquare } from 'react-icons/fa';
import _ from 'lodash';

let timer = null;
const Questionnaire = ({ translate, selectedMaterials, onSectionChange, viewQuestionnaire, setViewQuestionnaire }) => {
  const dispatch = useDispatch();
  const { loading, questionnaires, filters } = useSelector(state => state.questionnaire);
  const { questionnaireCategoryTreeData } = useSelector((state) => state.category);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: '',
    favorites_only: false,
    my_contents_only: false
  });

  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [therapistId, setTherapistId] = useState('');
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
    if (profile !== undefined) {
      setTherapistId(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.QUESTIONNAIRE, lang: language }, CATEGORY_TYPES.QUESTIONNAIRE));
  }, [language, dispatch]);

  useEffect(() => {
    if (questionnaireCategoryTreeData.length) {
      const rootCategoryStructure = {};
      questionnaireCategoryTreeData.forEach(category => {
        rootCategoryStructure[category.value] = [];
      });
      setSelectedCategories(rootCategoryStructure);
    }
  }, [questionnaireCategoryTreeData]);

  useEffect(() => {
    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getQuestionnaires({
        filter: formFields,
        categories: serializedSelectedCats,
        lang: language,
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
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
    setCurrentPage(1);
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
  };

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
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
                  placeholder={translate('questionnaire.search')}
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
                questionnaireCategoryTreeData.map(category => (
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
                            nodes={category.children}
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
                      <div className="top-bar">
                        <div className="favorite-btn btn-link">
                          {questionnaire.is_favorite
                            ? <BsHeartFill size={20} />
                            : <BsHeart size={20} />
                          }
                        </div>
                        {therapistId === questionnaire.therapist_id && (
                          <div className="owner-btn">
                            <BsPerson size={20} />
                          </div>
                        )}
                        <Form.Check
                          type="checkbox"
                          className="float-right action"
                          checked={selectedMaterials.includes(questionnaire.id)}
                          onChange={(e) => onSectionChange(e.currentTarget.checked, questionnaire.id)}
                        />
                      </div>
                      <div className="card-container" onClick={() => handleViewQuestionnaire(questionnaire)}>
                        <div className="card-img bg-light">
                          <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
                            <img src={'/images/questionnaire.svg'} alt='questionnaire' />
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
          { viewQuestionnaire && <ViewQuestionnaire show={viewQuestionnaire} handleClose={handleViewQuestionnaireClose} questionnaire={questionnaire}/> }
        </Col>
      </Row>
    </>
  );
};

Questionnaire.propTypes = {
  translate: PropTypes.func,
  selectedMaterials: PropTypes.array,
  onSectionChange: PropTypes.func,
  viewQuestionnaire: PropTypes.bool,
  setViewQuestionnaire: PropTypes.func
};

export default withLocalize(Questionnaire);
