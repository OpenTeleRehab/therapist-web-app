import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { getGuidances } from '../../store/guidance/actions';
import { toggleGuidance } from '../../store/auth/actions';
import GoogleTranslationAttribute from '../GoogleTranslationAttribute';

const Guidance = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { guidances } = useSelector(state => state.guidance);
  const [showGuidance, setShowGuidance] = useState(false);
  const [checked, setChecked] = useState(false);
  const [currentIndex, SetCurrentIndex] = useState(0);

  useEffect(() => {
    // TODO: Fix show_guidance flag — negative value currently treated as "Not Show".
    if (profile && profile.show_guidance === 0) {
      dispatch(getGuidances());
      setShowGuidance(true);
    }
  }, [profile, dispatch]);

  const handleCheckBoxChange = e => {
    setChecked(true);
  };

  const handlePrevGuidance = () => {
    SetCurrentIndex(currentIndex - 1);
  };

  const handleNextGuidance = () => {
    SetCurrentIndex(currentIndex + 1);
  };

  const handleCloseGuidance = () => {
    if (checked) {
      dispatch(toggleGuidance(profile.id));
    }

    setShowGuidance(false);
  };

  if (guidances.length === 0) {
    return null;
  }

  return (
    <Modal show={showGuidance} size="lg" onHide={handleCloseGuidance} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>{guidances[currentIndex].title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: guidances[currentIndex].content }} />
        { guidances[currentIndex].auto_translated === true && <GoogleTranslationAttribute /> }
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
            disabled={currentIndex + 1 === guidances.length}
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
