import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { selectRoom } from 'store/rocketchat/actions';
import { formatDate } from 'utils/general';
import _ from 'lodash';
import { loadMessagesInRoom } from 'utils/rocketchat';
import { CALL_STATUS, CHAT_TYPES } from 'variables/rocketchat';

const ChatRoomList = (
  {
    translate,
    userStatus,
    chatRooms,
    selectedRoom,
    hideChatPanel,
    keyword,
    therapist,
    socket
  }
) => {
  const dispatch = useDispatch();
  const selected = selectedRoom || {};

  // search name
  let roomList = chatRooms;
  if (keyword.length >= 2 && roomList.length) {
    const searchValue = keyword.toLowerCase();
    roomList = roomList.filter(room => {
      return room.name.toLowerCase().includes(searchValue);
    });
  }
  roomList = _.orderBy(roomList, ['unread', 'u.status', 'name'], ['desc', 'desc', 'asc']);

  const handleSelectRoomToChat = (index) => {
    const selected = roomList[index];
    dispatch(selectRoom(selected));
    loadMessagesInRoom(socket, selected.rid, therapist.id);
    hideChatPanel(false);
  };

  const getHighlightText = (msg, type) => {
    let lastMsg = msg || '';
    let className = 'text-muted';
    if (type !== undefined && type !== CHAT_TYPES.TEXT) {
      lastMsg = translate('chat_attachment.title');
      className = 'text-primary';
    } else if (msg === CALL_STATUS.AUDIO_MISSED || msg === CALL_STATUS.VIDEO_MISSED || msg === CALL_STATUS.BUSY) {
      lastMsg = translate(msg);
      className = 'text-danger';
    } else if ([CALL_STATUS.AUDIO_STARTED, CALL_STATUS.VIDEO_STARTED, CALL_STATUS.ACCEPTED].includes(msg)) {
      lastMsg = translate(msg);
      className = 'text-primary';
    } else if (msg === CALL_STATUS.AUDIO_ENDED || msg === CALL_STATUS.VIDEO_ENDED) {
      lastMsg = translate(msg);
      className = 'text-primary';
    }
    return { lastMsg, className };
  };

  return (
    <>
      {roomList.length ? (
        roomList.map((room, index) => {
          const { unread, lastMessage } = room;
          const { lastMsg, className } = getHighlightText(lastMessage.msg, lastMessage.type);

          return (
            <ListGroup as="ul" key={index}>
              <ListGroup.Item
                as="button"
                className="d-flex justify-content-between align-items-center text-left"
                active={room.rid === selected.rid}
                onClick={() => handleSelectRoomToChat(index)}
                tabIndex="0"
              >
                <div className="chat-room-item">
                  <p className="mb-0 d-flex align-items-center">
                    {room.name}
                    {userStatus(room)}
                  </p>
                  <p className={`${className} text-truncate small mb-0`}>{lastMsg}</p>
                </div>
                {room.rid !== selected.rid && (
                  <div className="d-flex flex-column align-items-end">
                    {unread > 0 && (
                      <Badge variant="primary" className="d-flex align-items-center justify-content-center">{unread}</Badge>
                    )}
                    <p className="text-muted small mb-0">{formatDate(lastMessage._updatedAt)}</p>
                  </div>
                )}
              </ListGroup.Item>
            </ListGroup>
          );
        })
      ) : (
        <div className="d-flex justify-content-center pt-3">
          <p>{translate('common.no_data')}</p>
        </div>
      )}
    </>
  );
};

ChatRoomList.propTypes = {
  translate: PropTypes.func,
  userStatus: PropTypes.func,
  chatRooms: PropTypes.array,
  selectedRoom: PropTypes.object,
  hideChatPanel: PropTypes.func,
  keyword: PropTypes.string,
  therapist: PropTypes.object,
  socket: PropTypes.object
};

export default ChatRoomList;
