import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Badge, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch, BsXCircle } from 'react-icons/bs';
import Jitsi from 'react-jitsi';
import {
  setIsOnChatPage,
  getChatRooms,
  getCurrentChatUsersStatus,
  getLastMessages
} from 'store/rocketchat/actions';
import ChatRoomList from 'views/ChatOrCall/Partials/ChatRoomList';
import ChatPanel from 'views/ChatOrCall/Partials/ChatPanel';
import RocketchatContext from 'context/RocketchatContext';
import { USER_STATUS } from 'variables/rocketchat';

const ChatOrCall = ({ translate }) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const therapist = useSelector(state => state.auth.profile);
  const { authToken, chatRooms, messages, selectedRoom, isChatConnected } = useSelector(state => state.rocketchat);
  const [searchValue, setSearchValue] = useState('');
  const [hideChatPanel, setHideChatPanel] = useState(true);
  const showJitsi = false;

  useEffect(() => {
    if (therapist && therapist.chat_user_id && therapist.chat_rooms.length) {
      dispatch(getChatRooms());
    }
    dispatch(setIsOnChatPage(true));
    return () => {
      dispatch(setIsOnChatPage(false));
    };
  }, [dispatch, therapist]);

  useEffect(() => {
    if (therapist && therapist.chat_user_id && authToken && chatRooms.length) {
      dispatch(getCurrentChatUsersStatus());
      // TODO get unread messages in each room
      // https://developer.rocket.chat/api/realtime-api/method-calls/get-subscriptions
      setTimeout(() => {
        const roomIds = [];
        chatRooms.forEach((room) => {
          roomIds.push(room.rid);
        });
        dispatch(getLastMessages(roomIds));
      }, 1000);
    }
  }, [dispatch, therapist, authToken, chatRooms]);

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
            <div className="chat-room-list">
              <ChatRoomList
                translate={translate}
                chatRooms={chatRooms}
                selectedRoom={selectedRoom}
                keyword={searchValue}
                therapist={therapist}
                userStatus={renderUserStatus}
                socket={chatSocket}
                hideChatPanel={setHideChatPanel}
              />
            </div>
          </Col>
          <Col lg={9} md={8} sm={12} className={`d-md-flex flex-column chat-message-panel ${hideChatPanel ? 'd-none' : 'd-flex'}`}>
            <ChatPanel
              translate={translate}
              therapist={therapist}
              socket={chatSocket}
              selectedRoom={selectedRoom}
              messages={messages}
              userStatus={renderUserStatus}
              hideChatPanel={setHideChatPanel}
            />

            {showJitsi && (
              <Jitsi />
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

ChatOrCall.propTypes = {
  translate: PropTypes.func
};

export default ChatOrCall;
