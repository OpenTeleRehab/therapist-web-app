// @see https://github.com/batuhansahan/react-gifted-chat
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Day,
  Bubble,
  Message,
  MessageText,
  Time
} from 'react-gifted-chat';
import { Alert } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';
import styles from './styles';
import { generateHash } from 'utils/general';
import { sendNewMessage } from 'utils/rocketchat';
import settings from 'settings';

const MIN_COMPOSER_HEIGHT = 50;
const MIN_MSG_OUTER_HEIGHT = 150;
const ChatPanel = (
  {
    translate,
    userStatus,
    therapist,
    socket,
    selectedRoom,
    messages
  }) => {
  const [allMessages, setAllMessages] = useState(messages || []);
  const [msgOuterHeight, setMsgOuterHeight] = useState(MIN_MSG_OUTER_HEIGHT);
  const [composerHeight, setComposerHeight] = useState(MIN_COMPOSER_HEIGHT);
  const [chatText, setChatText] = useState('');
  const [isSendByEnter, setIsSendByEnter] = useState(false);

  const restoreAutoHeight = () => {
    setComposerHeight(MIN_COMPOSER_HEIGHT);
    setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT);
    setChatText('');
  };

  useEffect(() => {
    setAllMessages(messages);
    restoreAutoHeight();
  }, [messages]);

  const handleAutoResize = (e) => {
    if (isSendByEnter) {
      setIsSendByEnter(false);
      return true;
    }
    const { value, scrollHeight } = e.target;
    const diffValue = scrollHeight - MIN_COMPOSER_HEIGHT;
    setChatText(value.trimLeft());
    if (diffValue > 0 && value !== '') {
      setMsgOuterHeight(MIN_MSG_OUTER_HEIGHT + diffValue);
      setComposerHeight(e.target.scrollHeight);
    } else if (value === '') {
      restoreAutoHeight();
    }
  };

  const handleSendOnEnterKey = (e) => {
    const { key, shiftKey } = e.nativeEvent;
    if (!shiftKey && key === 'Enter') {
      setIsSendByEnter(true);
      if (chatText.trim() !== '') {
        const newMessage = [{
          _id: generateHash(),
          text: chatText.trim(),
          createdAt: new Date(),
          user: {
            _id: therapist.chat_user_id
          }
        }];
        handleSendMessage(newMessage);
      }
    }
  };

  const handleSendMessage = (newMessage) => {
    if (newMessage[0]._id === undefined) {
      newMessage[0]._id = newMessage[0].id;
    }
    newMessage[0].pending = true;
    setAllMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
    restoreAutoHeight();

    // post new message to rocket chat
    newMessage[0].rid = selectedRoom.rid;
    sendNewMessage(socket, newMessage[0], therapist.id);
  };

  const renderInputToolbar = (giftedChatProps) => {
    return (
      <InputToolbar
        {...giftedChatProps}
        containerStyle={styles.chatInputToolBar}
        renderComposer={() => (
          <Composer
            {...giftedChatProps}
            composerHeight={composerHeight}
            textInputStyle={styles.chatComposer}
            placeholder={translate(`placeholder.${selectedRoom.enabled ? 'type.message' : 'disabled.chat'}`)}
            placeholderTextColor={selectedRoom.enabled ? '#A1A1A1' : '#0077C8'}
            textInputProps={{
              onKeyPress: (e) => handleSendOnEnterKey(e),
              onChange: (e) => handleAutoResize(e),
              editable: selectedRoom.enabled === 1
            }}
          />
        )}
        renderSend={() => (
          <Send {...giftedChatProps} containerStyle={styles.chatSendButton}>
            <MdSend size={22} color="#0077C8" />
          </Send>
        )}
      />
    );
  };

  const renderMessage = (giftedChatProps) => {
    return (
      <Message
        {...giftedChatProps}
        containerStyle={{ right: styles.chatMessageRight, left: styles.chatMessageLeft }}
        renderBubble={() => (
          <Bubble
            {...giftedChatProps}
            wrapperStyle={{ right: styles.chatBubbleRight, left: styles.chatBubbleLeft }}
            tickStyle={styles.chatSendTick}
            renderMessageText={() => (
              <MessageText
                {...giftedChatProps}
                textStyle={{
                  right: styles.chatMessageTextRight,
                  left: styles.chatMessageTextLeft
                }}
              />
            )}
            renderTime={() => (
              <Time
                {...giftedChatProps}
                textStyle={{ right: styles.chatTimeRight, left: styles.chatTimeLeft }}
                containerStyle={{ right: styles.chatTimeContainerRight }}
              />
            )}
          />
        )}
        renderDay={() => (
          <Day {...giftedChatProps} dateFormat={settings.date_format} textStyle={styles.chatDay} />
        )}
        renderAvatar={null}
      />
    );
  };

  return (
    <>
      {selectedRoom ? (
        <>
          <div className="chat-selected-user">
            <h4 className="font-weight-bold mb-0 d-flex align-items-center">
              {selectedRoom.name}
              {userStatus(selectedRoom, 'md')}
            </h4>
          </div>
          <div className="chat-message-panel" style={{ height: `calc(100vh - ${msgOuterHeight}px)` }}>
            <GiftedChat
              text={chatText}
              messages={allMessages}
              user={{ _id: therapist.chat_user_id }}
              messageIdGenerator={() => generateHash()}
              onSend={(newMessage) => handleSendMessage(newMessage)}
              renderMessage={renderMessage}
              renderInputToolbar={renderInputToolbar}
            />
          </div>
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
  messages: PropTypes.array
};

export default ChatPanel;
