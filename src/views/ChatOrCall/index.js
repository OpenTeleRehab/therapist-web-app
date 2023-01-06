import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Badge, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch, BsXCircle, BsList } from 'react-icons/bs';
import {
  setIsOnChatPage,
  getChatRooms,
  getCurrentChatUsersStatus,
  getLastMessages, sendPodcastNotification
} from 'store/rocketchat/actions';
import ChatRoomList from 'views/ChatOrCall/Partials/ChatRoomList';
import ChatPanel from 'views/ChatOrCall/Partials/ChatPanel';
import AppContext from 'context/AppContext';
import RocketchatContext from 'context/RocketchatContext';
import { CALL_STATUS, USER_STATUS } from 'variables/rocketchat';
import VideoCall from 'views/ChatOrCall/Partials/VideoCall';
import { generateHash } from 'utils/general';
import { sendNewMessage, updateMessage } from 'utils/rocketchat';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';

const CALL_WAITING_TIMEOUT = 60000; // 1 minute
const ChatOrCall = ({ translate }) => {
  const dispatch = useDispatch();
  const callTimeout = useRef(null);
  const { idleTimer } = useContext(AppContext);
  const chatSocket = useContext(RocketchatContext);
  const therapist = useSelector(state => state.auth.profile);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { authToken, chatRooms, messages, selectedRoom, isChatConnected, videoCall } = useSelector(state => state.rocketchat);
  const [searchValue, setSearchValue] = useState('');
  const [hideChatPanel, setHideChatPanel] = useState(true);
  const [isNoSidebar, setIsNoSidebar] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  useEffect(() => {
    if (therapist && therapist.chat_user_id && therapist.chat_rooms.length && authToken) {
      dispatch(getChatRooms()).then(success => {
        if (success) {
          dispatch(getLastMessages());
          setTimeout(() => {
            dispatch(getCurrentChatUsersStatus());
          }, 1000);
          // TODO get unread messages in each room
          // https://developer.rocket.chat/api/realtime-api/method-calls/get-subscriptions
        }
      });
    }
    dispatch(setIsOnChatPage(true));
    return () => {
      dispatch(setIsOnChatPage(false));
    };
  }, [authToken, dispatch, therapist]);

  useEffect(() => {
    if (videoCall !== undefined) {
      if ([CALL_STATUS.AUDIO_STARTED, CALL_STATUS.VIDEO_STARTED].includes(videoCall.status)) {
        callTimeout.current = setTimeout(() => {
          const message = {
            _id: videoCall._id,
            rid: selectedRoom.rid,
            msg: isVideoCall
              ? CALL_STATUS.VIDEO_MISSED
              : CALL_STATUS.AUDIO_MISSED
          };
          updateMessage(chatSocket, message, therapist.id);
        }, CALL_WAITING_TIMEOUT);
        setIsNoSidebar(true);
      } else if ([CALL_STATUS.ACCEPTED].includes(videoCall.status)) {
        if (callTimeout.current) {
          clearTimeout(callTimeout.current);
        }
        setIsNoSidebar(true);
      } else {
        if (callTimeout.current) {
          clearTimeout(callTimeout.current);
        }
        setIsNoSidebar(false);
      }
    }
  }, [chatSocket, selectedRoom, therapist, videoCall, isVideoCall]);

  useEffect(() => {
    if (videoCall !== undefined) {
      if ([
        CALL_STATUS.VIDEO_STARTED,
        CALL_STATUS.AUDIO_STARTED,
        CALL_STATUS.ACCEPTED
      ].includes(videoCall.status)) {
        idleTimer.pause();
      } else if ([
        CALL_STATUS.AUDIO_ENDED, CALL_STATUS.VIDEO_ENDED,
        CALL_STATUS.AUDIO_MISSED, CALL_STATUS.VIDEO_MISSED
      ].includes(videoCall.status)) {
        idleTimer.reset();
      }
    }
  }, [videoCall, idleTimer]);

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
    const newMessage = { _id, rid, msg };

    sendNewMessage(chatSocket, newMessage, therapist.id);

    const identity = selectedRoom.u.username;
    const title = therapist.first_name + ' ' + therapist.last_name;

    const notification = {
      _id,
      rid,
      identity,
      title,
      body: msg,
      translatable: false
    };

    dispatch(sendPodcastNotification(notification));
  };

  const handleUpdateMessage = (msg, _id) => {
    const rid = selectedRoom.rid;
    const identity = selectedRoom.u.username;
    const title = therapist.first_name + ' ' + therapist.last_name;
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
        <Row className={'row-bg ' + (isNoSidebar ? 'panel-no-sidebar' : '')}>
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
                  aria-label="Search"
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
          {videoCall && (videoCall.status === CALL_STATUS.AUDIO_STARTED || videoCall.status === CALL_STATUS.VIDEO_STARTED || videoCall.status === CALL_STATUS.ACCEPTED) ? (
            <>
              <Col lg={9} md={8} sm={12} className={`d-md-flex flex-column px-0 chat-message-panel ${hideChatPanel ? 'd-none' : 'd-flex'}`}>
                <div className="calling">
                  <Button disabled variant="" className="sidebar-toggle text-white d-none d-md-block" onClick={() => setIsNoSidebar(!isNoSidebar)}>
                    <BsList size={22} color="#FFFFFF" />
                  </Button>
                  <VideoCall
                    roomName={selectedRoom.rid}
                    isVideoCall={isVideoCall}
                    onUpdateMessage={handleUpdateMessage}
                    indicator={videoCall}
                  />
                </div>
              </Col>
            </>
          ) : (
            <>
              <Col lg={9} md={8} sm={12} className={`d-md-flex flex-column chat-message-panel ${hideChatPanel ? 'd-none' : 'd-flex'}`}>
                <ChatPanel
                  translate={translate}
                  chatUserId={therapist.chat_user_id}
                  chatRooms={chatRooms}
                  selectedRoom={selectedRoom}
                  messages={messages}
                  isVideoCall={setIsVideoCall}
                  userStatus={renderUserStatus}
                  hideChatPanel={setHideChatPanel}
                  onSendMessage={handleSendMessage}
                />
              </Col>
            </>
          )}
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
