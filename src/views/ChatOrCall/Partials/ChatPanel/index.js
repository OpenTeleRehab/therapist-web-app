import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import { generateHash } from 'utils/general';
import { sendNewMessage } from 'utils/rocketchat';
import Message from './Message';
import InputToolbar from './InputToolbar';
import { BsChevronLeft } from 'react-icons/bs';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';

const MIN_MSG_OUTER_HEIGHT = 205;
const ChatPanel = (
  {
    translate,
    userStatus,
    therapist,
    socket,
    selectedRoom,
    messages,
    hideChatPanel,
    isIncomingCall,
    isVideoCall
  }) => {
  const [msgOuterHeight, setMsgOuterHeight] = useState(MIN_MSG_OUTER_HEIGHT);

  const handleInputSizeChanged = (changedHeight) => {
    if (changedHeight < 0) {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT);
    } else {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT + changedHeight);
    }
  };

  const handleSendMessage = (msg) => {
    const newMessage = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      msg
    };
    sendNewMessage(socket, newMessage, therapist.id);
  };

  const onAudioCall = () => {
    isVideoCall(false);
    isIncomingCall(true);
  };

  const onVideoCall = () => {
    isVideoCall(true);
    isIncomingCall(true);
  };

  return (
    <>
      {selectedRoom ? (
        <>
          <div className="chat-message-header d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold mb-0 d-flex align-items-center">
              <Button variant="link" className="d-md-none btn-back" onClick={() => hideChatPanel(true)}>
                <BsChevronLeft size={18} color="#0077C8" />
              </Button>
              {selectedRoom.name}
              {userStatus(selectedRoom, 'md')}
            </h4>

            <div className="d-flex justify-content-end">
              <Button variant="light" className="btn-audio-call bg-white rounded-circle mr-2" disabled onClick={() => onAudioCall()}>
                <IoCallOutline size={16} />
              </Button>
              <Button variant="light" className="btn-video-call bg-white rounded-circle" disabled onClick={() => onVideoCall()}>
                <IoVideocamOutline size={16} />
              </Button>
            </div>
          </div>
          <Message
            translate={translate}
            messages={messages}
            currentUser={therapist.chat_user_id}
            msgOuterHeight={msgOuterHeight}
          />
          <InputToolbar
            onSend={handleSendMessage}
            onInputSizeChanged={handleInputSizeChanged}
            translate={translate}
            roomId={selectedRoom.rid}
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
  therapist: PropTypes.object,
  socket: PropTypes.object,
  selectedRoom: PropTypes.object,
  messages: PropTypes.array,
  hideChatPanel: PropTypes.func,
  isIncomingCall: PropTypes.func,
  isVideoCall: PropTypes.func
};

export default ChatPanel;
