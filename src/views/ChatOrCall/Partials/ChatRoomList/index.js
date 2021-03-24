import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { selectRoom } from 'store/rocketchat/actions';
import { formatDate } from 'utils/general';
import { loadHistoryInRoom } from 'utils/rocketchat';
import _ from 'lodash';

const ChatRoomList = (
  {
    translate,
    userStatus,
    chatRooms,
    selectedRoom,
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
  roomList = _.orderBy(roomList, ['unread', 'enabled', 'name'], ['desc', 'desc', 'asc']);

  const handleSelectRoomToChat = (index) => {
    const selected = roomList[index];
    dispatch(selectRoom(selected));
    loadHistoryInRoom(socket, selected.rid, therapist.id);
  };

  return (
    <>
      {roomList.length ? (
        roomList.map((room, index) => {
          const { unread, lastMessage } = room;
          return (
            <ListGroup as="ul" key={index}>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-center"
                active={room.rid === selected.rid}
                onClick={() => handleSelectRoomToChat(index)}
              >
                <div className="chat-room">
                  <p className="mb-0 d-flex align-items-center">
                    {room.name}
                    {userStatus(room)}
                  </p>
                  <p className="text-muted text-truncate small mb-0">{lastMessage.text || ''}</p>
                </div>
                {room.rid !== selected.rid && (
                  <div className="d-flex flex-column align-items-end">
                    {unread > 0 && (
                      <Badge variant="primary" className="d-flex align-items-center justify-content-center">{unread}</Badge>
                    )}
                    <p className="text-muted small mb-0">{formatDate(lastMessage.createdAt)}</p>
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
  keyword: PropTypes.string,
  therapist: PropTypes.object,
  socket: PropTypes.object
};

export default ChatRoomList;