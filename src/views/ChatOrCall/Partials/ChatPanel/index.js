import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import Message from './Message';
import InputToolbar from './InputToolbar';
import { BsChevronLeft } from 'react-icons/bs';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { CALL_STATUS, CHAT_TYPES, USER_STATUS } from 'variables/rocketchat';
import { useDispatch, useSelector } from 'react-redux';
import {
  postAttachmentMessage,
  sendPodcastNotification
} from 'store/rocketchat/actions';
import { generateHash } from 'utils/general';
import CallingButton from '../../../../components/CallingButton';
import RocketchatContext from '../../../../context/RocketchatContext';
import { markMessagesAsRead } from '../../../../utils/chat';

const MIN_MSG_OUTER_HEIGHT = 205;
const ChatPanel = (
  {
    translate,
    userStatus,
    chatUserId,
    chatRooms,
    selectedRoom,
    messages,
    hideChatPanel,
    isVideoCall,
    onSendMessage
  }) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const therapist = useSelector(state => state.auth.profile);
  const [msgOuterHeight, setMsgOuterHeight] = useState(MIN_MSG_OUTER_HEIGHT);
  const [allMessages, setAllMessages] = useState(messages);

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (selectedRoom && therapist) {
      setTimeout(() => {
        markMessagesAsRead(chatSocket, selectedRoom.rid, therapist.id);
      }, 1000);
    }
  }, [selectedRoom]);

  const handleInputSizeChanged = (changedHeight) => {
    if (changedHeight < 0) {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT);
    } else {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT + changedHeight);
    }
  };

  const handleSendMessage = (text = '', attachment = null) => {
    // pending message
    const newMessage = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      _updatedAt: new Date(),
      u: { _id: chatUserId },
      received: false,
      isVideoCall: false
    };

    if (text !== '') {
      newMessage.msg = text;
      newMessage.type = CHAT_TYPES.TEXT;
      onSendMessage(text);
    } else if (attachment !== null) {
      const { type, url, caption, file } = attachment;
      newMessage.type = type.includes('video/') ? CHAT_TYPES.VIDEO : CHAT_TYPES.IMAGE;
      newMessage.attachment = {
        title: file.name,
        type,
        caption,
        url
      };
      dispatch(postAttachmentMessage(selectedRoom.rid, attachment));
      handleSendPodcastNotification(therapist, selectedRoom, 'chat_attachment.title', true);
    }

    setAllMessages(messages.concat([newMessage]));
  };

  const handleCall = (isVideo) => {
    onSendMessage(isVideo ? CALL_STATUS.VIDEO_STARTED : CALL_STATUS.AUDIO_STARTED);
    isVideoCall(isVideo);
  };

  const handleSendPodcastNotification = (therapist, selectedRoom, body, translatable) => {
    if (therapist && selectedRoom.u.status === USER_STATUS.OFFLINE) {
      const notification = {
        identity: selectedRoom.u.username,
        title: therapist.first_name + ' ' + therapist.last_name,
        body: body,
        translatable: translatable
      };

      dispatch(sendPodcastNotification(notification));
    }
  };

  return (
    <>
      {selectedRoom && chatRooms.length ? (
        <>
          <div className="chat-message-header d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold mb-0 d-flex align-items-center">
              <Button variant="link" className="d-md-none btn-back" onClick={() => hideChatPanel(true)} aria-label="Status">
                <BsChevronLeft size={18} color="#0077C8" />
              </Button>
              {selectedRoom.name}
              {userStatus(selectedRoom, 'md')}
            </h4>
            <div className="d-flex justify-content-end">
              <CallingButton variant="light" className="btn-audio-call bg-white rounded-circle mr-2" onClick={() => handleCall(false)} aria-label="Audio call">
                <IoCallOutline size={18} color="#333333" />
              </CallingButton>
              <CallingButton isVideo variant="light" className="btn-video-call bg-white rounded-circle" onClick={() => handleCall(true)} aria-label="Video call">
                <IoVideocamOutline size={18} color="#333333" />
              </CallingButton>
            </div>
          </div>
          <Message
            translate={translate}
            messages={allMessages.length > messages.length ? allMessages : messages}
            currentUser={chatUserId}
            msgOuterHeight={msgOuterHeight}
          />
          <InputToolbar
            onSend={handleSendMessage}
            onInputSizeChanged={handleInputSizeChanged}
            translate={translate}
          />
        </>
      ) : (
        <Alert variant="primary" className="mt-3">{translate('chat_message.please_select_patient')}</Alert>
      )}
    </>
  );
};

ChatPanel.propTypes = {
  translate: PropTypes.func,
  userStatus: PropTypes.func,
  chatUserId: PropTypes.string,
  chatRooms: PropTypes.array,
  selectedRoom: PropTypes.object,
  messages: PropTypes.array,
  hideChatPanel: PropTypes.func,
  isVideoCall: PropTypes.func,
  onSendMessage: PropTypes.func
};

export default ChatPanel;
