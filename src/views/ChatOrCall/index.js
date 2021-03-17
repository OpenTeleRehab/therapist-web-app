import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Badge, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch, BsXCircle } from 'react-icons/bs';
import { getUsers } from 'store/user/actions';
import PatientList from 'views/ChatOrCall/Partials/PatientList';
import ChatPanel from './Partials/ChatPanel';

const ChatOrCall = ({ translate }) => {
  const dispatch = useDispatch();
  const therapist = useSelector((state) => state.auth.profile);
  const patients = useSelector(state => state.user.users);
  const rocketchat = useSelector(state => state.rocketchat);

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (therapist !== undefined) {
      dispatch(getUsers({
        therapist_id: therapist.id,
        page_size: 999,
        page: 1
      }));
    }
  }, [dispatch, therapist]);

  return (
    <>
      <Row className="row-bg">
        <Col lg={3} md={4} sm={5} className="d-flex flex-column chat-sidebar-panel">
          <div className="chat-sidebar-header pb-1">
            <h4 className="font-weight-bold mt-3">{translate('chat')} <Badge variant="primary">10</Badge></h4>
            <Form.Group className="search-box-with-icon">
              <BsSearch className="search-icon" />
              <Button
                variant=""
                className="clear-btn"
                disabled={!searchValue.length}
                onClick={() => setSearchValue('')}
              >
                <BsXCircle size={18} color="#ADADAD" />
              </Button>
              <Form.Control
                name="search_value"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder={translate('common.search.placeholder')}
              />
            </Form.Group>
          </div>
          <div className="chat-patient-list">
            <PatientList
              translate={translate}
              patients={patients}
              keyword={searchValue}
              selected={rocketchat.selectedPatient || {}}
            />
          </div>
        </Col>
        <Col lg={9} md={8} sm={7} className="chat-message-panel d-flex flex-column">
          <ChatPanel
            translate={translate}
            user={therapist}
            data={rocketchat}
          />
        </Col>
      </Row>
    </>
  );
};

ChatOrCall.propTypes = {
  translate: PropTypes.func
};

export default ChatOrCall;
