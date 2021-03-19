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
  Accordion
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsDashSquare,
  BsSquare
} from 'react-icons/bs';

import Pagination from 'components/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import { getQuestionnaires } from 'store/questionnaire/actions';
import ViewQuestionnaire from './viewQuestionnaire';
import CheckboxTree from 'react-checkbox-tree';
import SearchInput from 'components/Form/SearchInput';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { FaRegCheckSquare } from 'react-icons/fa';
import { EditAction, FavoriteAction, NonFavoriteAction } from 'components/ActionIcons';
import _ from 'lodash';
import { IoPerson } from 'react-icons/io5/index';

let timer = null;
const Questionnaire = ({ translate, handleSwitchFavorite }) => {
  const dispatch = useDispatch();
  const { loading, questionnaires, filters } = useSelector(state => state.questionnaire);
  const { categoryTreeData } = useSelector((state) => state.category);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formFields, setFormFields] = useState({
    search_value: ''
  });

  const languages = useSelector(state => state.language.languages);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [therapistId, setTherapistId] = useState('');

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

  useEffect(() => {
    if (language) {
      dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.QUESTIONNAIRE, lang: language }));
    }
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

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
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
                        <div className="favorite-btn">
                          {questionnaire.is_favorite
                            ? <NonFavoriteAction onClick={() => handleSwitchFavorite(questionnaire.id, 0, therapistId, CATEGORY_TYPES.QUESTIONNAIRE)} />
                            : <FavoriteAction onClick={() => handleSwitchFavorite(questionnaire.id, 1, therapistId, CATEGORY_TYPES.QUESTIONNAIRE)} />
                          }
                        </div>
                        {therapistId === questionnaire.therapist_id && (
                          <div className="owner-btn">
                            <IoPerson size={20} />
                          </div>
                        )}
                        {therapistId === questionnaire.therapist_id && (
                          <div className="edit-btn">
                            <EditAction />
                          </div>
                        )}
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
  handleSwitchFavorite: PropTypes.func
};

export default withLocalize(Questionnaire);
