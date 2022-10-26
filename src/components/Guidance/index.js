import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/auth/actions';
import { getGuidances } from '../../store/guidance/actions';
import GoogleTranslationAttribute from '../GoogleTranslationAttribute';

const Guidance = () => {
  const dispatch = useDispatch();
  const languages = useSelector(state => state.language.languages);
  const { profile } = useSelector((state) => state.auth);
  const { guidances } = useSelector(state => state.guidance);
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentIndex, SetCurrentIndex] = useState(0);

  useEffect(() => {
    if (profile && profile.show_guidance === 0) {
      dispatch(getGuidances());
      setShowGuidance(true);
    }
  }, [profile]);

  const language = languages.find(item => item.id === profile.language_id);
  const [formFields, setFormFields] = useState({
    last_name: profile.last_name,
    first_name: profile.first_name,
    language_id: profile.language_id,
    language_code: language ? language.code : null,
    profession_id: profile.profession_id,
    show_guidance: profile.show_guidance
  });

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handlePrevGuidance = () => {
    SetCurrentIndex(currentIndex - 1);
  };

  const handleNextGuidance = () => {
    SetCurrentIndex(currentIndex + 1);
  };

  const handleCloseGuidance = () => {
    setShowGuidance(false);
    if (profile.show_guidance !== formFields.show_guidance) {
      dispatch(updateProfile(profile.id, formFields));
    }
  };

  return (
    <Modal show={showGuidance} size="lg" onHide={handleCloseGuidance} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>{guidances.length > 0 && guidances[currentIndex].title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: guidances.length > 0 && guidances[currentIndex].content }} />
        { guidances.length > 0 && guidances[currentIndex].auto_translated === true && (
          <GoogleTranslationAttribute />
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Form.Check
          custom
          name="show_guidance"
          id="show-guidance"
          type="checkbox"
          label={<Translate id="common.guidance.hide"/>}
          onChange={handleCheckBoxChange}
        />

        <div className="action">
          <Button
            variant="primary"
            disabled={currentIndex === 0}
            onClick={handlePrevGuidance}
          >
            <Translate id="common.guidance.prev"/>
          </Button>
          <Button
            className="ml-1"
            variant="primary"
            disabled={currentIndex + 1 === (guidances.length > 0 && guidances.length)}
            onClick={handleNextGuidance}
          >
            <Translate id="common.guidance.next"/>
          </Button>
          <Button
            className="ml-1"
            variant="outline-dark"
            onClick={handleCloseGuidance}
          >
            <Translate id="common.close"/>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Guidance;
