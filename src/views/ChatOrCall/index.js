import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Badge, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch, BsXCircle } from 'react-icons/bs';
import { setIsOnChatPage, getChatRooms, sendPodcastNotification } from '../../store/rocketchat/actions';
import ChatRoomList from './Partials/ChatRoomList';
import ChatPanel from './Partials/ChatPanel';
import RocketchatContext from 'context/RocketchatContext';
import { USER_STATUS } from 'variables/rocketchat';
import { sendNewMessage, updateMessage } from '../../utils/rocketchat';
import { generateHash } from '../../utils/general';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';

const ChatOrCall = ({ translate }) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const therapist = useSelector(state => state.auth.profile);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { countries } = useSelector(state => state.country);
  const {
    authToken,
    chatRooms,
    messages,
    selectedRoom,
    isChatConnected
  } = useSelector(state => state.rocketchat);
  const [searchValue, setSearchValue] = useState('');
  const [hideChatPanel, setHideChatPanel] = useState(true);

  useEffect(() => {
    if (therapist && therapist.chat_user_id && authToken && countries.length) {
      dispatch(getChatRooms());
    }
    dispatch(setIsOnChatPage(true));
    return () => {
      dispatch(setIsOnChatPage(false));
    };
  }, [authToken, dispatch, therapist, countries]);

  const getTotalOnlineUsers = () => {
    const onlineStatus = chatRooms.filter(room => {
      return room.u.status === USER_STATUS.ONLINE;
    });
    return onlineStatus.length;
  };

  const renderUserStatus = (room, infix = '') => {
    const className = `chat-user-status ${infix} ${room.u.status}`;
    return <span className={className}>&nbsp;</span>;
  };

  const handleSendMessage = (msg) => {
    const _id = generateHash();
    const rid = selectedRoom.rid;
    const identity = selectedRoom.u.username;
    const title = therapist.first_name + ' ' + therapist.last_name;
    const newMessage = { _id, rid, msg };

    sendNewMessage(chatSocket, newMessage, therapist.id);

    dispatch(sendPodcastNotification({
      _id,
      rid,
      identity,
      title,
      body: msg,
    }));
  };

  const handleUpdateMessage = (_id, msg) => {
    const rid = selectedRoom.rid;
    const identity = selectedRoom.u.username;
    const title = therapist.last_name + ' ' + therapist.first_name;
    const notification = {
      _id,
      rid,
      identity,
      title,
      body: msg,
      translatable: false
    };

    dispatch(sendPodcastNotification(notification));

    const message = {
      _id,
      rid: selectedRoom.rid,
      msg
    };
    updateMessage(chatSocket, message, therapist.id);
  };

  return (
    <>
      {!isChatConnected ? (
        <Alert variant="warning" className="justify-content-center text-center py-5">
          <h3 className="mb-0">{translate('chat_message.server_down')}</h3>
        </Alert>
      ) : (
        <Row className="row-bg">
          <Col lg={3} md={4} sm={12} className={`d-md-flex flex-column chat-sidebar-panel ${hideChatPanel ? 'd-flex' : 'd-none'}`}>
            <div className="chat-sidebar-header pb-1">
              <h4 className="font-weight-bold mt-3 d-flex align-items-center">
                {translate('chat')}&nbsp;
                <Badge variant="primary" className="d-flex align-items-center justify-content-center">
                  {getTotalOnlineUsers()}
                </Badge>
              </h4>
              <Form.Group className="search-box-with-icon">
                <BsSearch className="search-icon" />
                <Button
                  aria-label="Clear"
                  variant="link"
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
                  aria-label="Search"
                />
              </Form.Group>
            </div>
            <div className="chat-room-list">
              <Tabs defaultActiveKey="patient" className="my-3">
                <Tab eventKey="patient" title={translate('patient')}>
                  <ChatRoomList
                    translate={translate}
                    chatRooms={chatRooms.filter(item => /^P\d+/.test(item.u.username))}
                    selectedRoom={selectedRoom}
                    keyword={searchValue}
                    therapist={therapist}
                    userStatus={renderUserStatus}
                    socket={chatSocket}
                    hideChatPanel={setHideChatPanel}
                  />
                </Tab>
                <Tab eventKey="therapist" title={translate('therapist')}>
                  <ChatRoomList
                    translate={translate}
                    chatRooms={chatRooms.filter(item => item.u.username.startsWith('T'))}
                    selectedRoom={selectedRoom}
                    keyword={searchValue}
                    therapist={therapist}
                    userStatus={renderUserStatus}
                    socket={chatSocket}
                    hideChatPanel={setHideChatPanel}
                  />
                </Tab>
                <Tab eventKey="phc_worker" title={translate('phc_worker')}>
                  <ChatRoomList
                    translate={translate}
                    chatRooms={chatRooms.filter(item => item.u.username.startsWith('PHC'))}
                    selectedRoom={selectedRoom}
                    keyword={searchValue}
                    therapist={therapist}
                    userStatus={renderUserStatus}
                    socket={chatSocket}
                    hideChatPanel={setHideChatPanel}
                  />
                </Tab>
              </Tabs>
            </div>
          </Col>
          <Col lg={9} md={8} sm={12} className={`d-md-flex flex-column chat-message-panel ${hideChatPanel ? 'd-none' : 'd-flex'}`}>
            <ChatPanel
              translate={translate}
              chatUserId={therapist.chat_user_id}
              selectedRoom={selectedRoom}
              messages={messages}
              userStatus={renderUserStatus}
              hideChatPanel={setHideChatPanel}
              onSendMessage={handleSendMessage}
              onUpdateMessage={handleUpdateMessage}
            />
          </Col>
        </Row>
      )}
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

ChatOrCall.propTypes = {
  translate: PropTypes.func
};

export default ChatOrCall;
