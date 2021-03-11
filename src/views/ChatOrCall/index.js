import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Badge, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { BsSearch, BsXCircle } from 'react-icons/bs';
import PatientList from 'views/ChatOrCall/Partials/PatientList';
import { getUsers } from 'store/user/actions';

const ChatOrCall = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const therapist = useSelector((state) => state.auth.profile);
  const patients = useSelector(state => state.user.users);
  const translate = getTranslate(localize);

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
            <h4 className="font-weight-bold mt-3">Chat <Badge variant="primary">10</Badge></h4>
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
            <PatientList translate={translate} patients={patients} keyword={searchValue} />
          </div>
        </Col>
        <Col lg={9} md={8} sm={7} className="chat-message-panel">
          Content
        </Col>
      </Row>
    </>
  );
};

export default ChatOrCall;
