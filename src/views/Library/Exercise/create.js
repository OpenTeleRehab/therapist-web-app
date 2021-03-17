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
  Card
} from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsUpload, BsXCircle, BsX, BsPlus } from 'react-icons/bs';
import CustomTree from 'components/Tree';

import * as ROUTES from 'variables/routes';
import {
  createExercise,
  getExercise,
  updateExercise
} from 'store/exercise/actions';
import { getCategories } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';

const CreateExercise = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { languages } = useSelector(state => state.language);
  const { exercise, filters } = useSelector(state => state.exercise);
  const { categories } = useSelector((state) => state.category);
  const { profile } = useSelector((state) => state.auth);

  const [language, setLanguage] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [formFields, setFormFields] = useState({
    title: '',
    include_feedback: true,
    get_pain_level: ''
  });
  const [inputFields, setInputFields] = useState([]);

  const [titleError, setTitleError] = useState(false);
  const [mediaUploads, setMediaUploads] = useState([]);
  const [mediaUploadsError, setMediaUploadsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFieldError, setInputFieldError] = useState([]);
  const [inputValueError, setInputValueError] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoryIndexes, setSelectedCategoryIndexes] = useState([]);
  const treeColumns = [
    { name: 'title', title: translate('common.category') }
  ];
  const tableColumnExtensions = [
    { columnName: 'title', width: 'auto', wordWrapEnabled: true }
  ];

  useEffect(() => {
    if (languages.length) {
      if (id && filters && filters.lang) {
        setLanguage(filters.lang);
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, filters, id]);

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
    if (id && language) {
      dispatch(getExercise(id, language));
    }
  }, [id, language, dispatch]);

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
    if (id && exercise.id) {
      setFormFields({
        title: exercise.title,
        include_feedback: exercise.include_feedback,
        get_pain_level: exercise.get_pain_level
      });
      setMediaUploads(exercise.files);
      setInputFields(exercise.additional_fields || []);
      setSelectedCategories(exercise.categories);
    }
  }, [id, exercise]);

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

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
      setMediaUploadsError(false);
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

    if (canSave) {
      setIsLoading(true);
      if (id) {
        dispatch(updateExercise(id, { ...formFields, additional_fields: JSON.stringify(inputFields), categories: selectedCategories, lang: language, therapist_id: therapistId }, mediaUploads))
          .then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY);
            }
            setIsLoading(false);
          });
      } else {
        dispatch(createExercise({ ...formFields, additional_fields: JSON.stringify(inputFields), categories: selectedCategories, lang: language, therapist_id: therapistId }, mediaUploads))
          .then(result => {
            if (result) {
              history.push(ROUTES.LIBRARY);
            }
            setIsLoading(false);
          });
      }
    }
  };

  const onSelectChange = (rowIds) => {
    const selectedCats = categories.filter((cat, index) => rowIds.indexOf(index) >= 0).map(cat => cat.id);
    setSelectedCategories(selectedCats);
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

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{id ? translate('exercise.edit') : translate('exercise.create')}</h1>
      </div>

      <Form>
        {
          !id && (
            <Form.Group as={Row}>
              <Col sm={4} lg={3} xl={2}>
                <Form.Check
                  name="option"
                  // onChange={handleChange}
                  value={1}
                  defaultChecked
                  type="radio"
                  label={translate('exercise.single_upload')}
                  id="formSingleOption"
                />
              </Col>
              <Col>
                <Form.Check
                  name="option"
                  // onChange={handleChange}
                  value={2}
                  type="radio"
                  label={translate('exercise.bulk_upload')}
                  id="formBulkOption"
                />
              </Col>
            </Form.Group>
          )
        }

        <Row>
          <Col sm={4} xl={3}>
            <div className="exercise-media">
              <h4>{translate('exercise.media')}</h4>
              { mediaUploads.map((mediaUpload, index) => (
                <div key={index} className="mb-2 position-relative w-75" >
                  <div className="position-absolute remove-btn-wrapper">
                    <BsXCircle size={20} onClick={() => handleFileRemove(index)}/>
                  </div>

                  { mediaUpload.fileType === 'audio/mpeg' &&
                    <div className="img-thumbnail w-100 pt-2">
                      <audio controls className="w-100">
                        <source src={mediaUpload.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${mediaUpload.id}`} type="audio/ogg" />
                      </audio>
                    </div>
                  }

                  { (mediaUpload.fileType !== 'audio/mpeg' && mediaUpload.fileType !== 'video/mp4') &&
                    <img src={mediaUpload.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${mediaUpload.id}`} alt="..." className="w-100 img-thumbnail"/>
                  }

                  { mediaUpload.fileType === 'video/mp4' &&
                    <video className="w-100 img-thumbnail" controls>
                      <source src={mediaUpload.url || `${process.env.REACT_APP_ADMIN_API_BASE_URL}/file/${mediaUpload.id}`} type="video/mp4" />
                    </video>
                  }
                  <div>{mediaUpload.fileName} {mediaUpload.fileSize ? ('(' + mediaUpload.fileSize + 'kB )') : ''}</div>
                </div>
              ))}
              <div className="btn btn-sm bg-white btn-outline-primary text-primary position-relative overflow-hidden" >
                <BsUpload size={15}/> Upload Image
                <input type="file" name="file" className="position-absolute upload-btn" onChange={handleFileChange} multiple accept="audio/*, video/*, image/*" />
              </div>
              { mediaUploadsError &&
                <div className="text-danger">{translate('exercise.media_upload.required')}</div>
              }
            </div>
          </Col>
          <Col sm={6} xl={4}>
            <Form.Group controlId="formLanguage">
              <Form.Label>{translate('common.show_language.version')}</Form.Label>
              <Form.Control as="select" value={id ? language : ''} onChange={handleLanguageChange} disabled={!id}>
                {languages.map((language, index) => (
                  <option key={index} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </Form.Control>
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
            <Form.Group controlId="formIncludeFeedback">
              <Form.Check
                name="include_feedback"
                onChange={handleCheck}
                value={true}
                checked={formFields.include_feedback}
                label={translate('exercise.include_collecting_feedback')}
              />
            </Form.Group>
            <Form.Group controlId="formGetPainLevel">
              <Form.Check
                name="get_pain_level"
                onChange={handleCheck}
                value={true}
                checked={formFields.get_pain_level}
                label={translate('exercise.get_pain_level_feedback')}
              />
            </Form.Group>

            <div className="mb-3">
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
            </div>

            {
              inputFields.map((inputField, index) => (
                <Card key={index} className="bg-light mb-3 additional-field">
                  <Card.Body>
                    <div className="remove-btn-container">
                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('common.remove')}</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          className="btn-remove"
                          onClick={() => handleRemoveFields(index)}
                        >
                          <BsX size={20} />
                        </Button>
                      </OverlayTrigger>
                    </div>
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

            <Form.Group>
              <Button
                variant="link"
                onClick={handleAddFields}
                className="p-0"
              >
                <BsPlus size={20} /> {translate('exercise.additional_field.add_more_field')}
              </Button>
            </Form.Group>

            <Form.Group>
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                {translate('common.save')}
              </Button>
              <Button
                className="ml-2"
                variant="outline-dark"
                as={Link}
                to={ROUTES.LIBRARY}
                disabled={isLoading}
              >
                {translate('common.cancel')}
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  );
};

CreateExercise.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CreateExercise);
