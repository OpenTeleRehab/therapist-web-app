import React, { useEffect, useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { FaUserPlus } from 'react-icons/fa';
import { BiPhoneCall } from 'react-icons/bi';
import { Button, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { CALL_STATUS } from '../../../../../variables/rocketchat';
import { useVideoCallContext } from '../../../../../context/VideoCallContext';
import { generateHash } from '../../../../../utils/general';
import Dialog from '../../../../../components/Dialog';
import PropTypes from 'prop-types';

const ParticipantInvitation = ({
  isVideoOn,
  participants,
  room,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { handleSendMessage, handleUpdateMessage, handleAddInvitingParticipants } = useVideoCallContext();
  const { profile } = useSelector(state => state.auth);
  const { authUserId, chatRooms } = useSelector(state => state.rocketchat);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    handleAddInvitingParticipants(rooms.filter((item) => item?.countdown > 0));
  }, [rooms]);

  useEffect(() => {
    if (chatRooms.length) {
      setRooms(
        chatRooms.map((chatRoom) => ({
          rid: chatRoom.rid,
          u: chatRoom.u,
          name: chatRoom.name,
        })),
      );
    }
  }, [chatRooms]);

  useEffect(() => {
    const timers = rooms.map((participant) => {
      if (participant.countdown > 0) {
        return setTimeout(() => {
          setRooms((prev) =>
            prev.map((p) =>
              p.id === participant.id && !participants.some(item => item.identity === (p.u.username + '_' + profile.country_id))
                ? { ...p, countdown: p.countdown - 1 }
                : { ...p, countdown: undefined }
            )
          );
        }, 1000);
      }

      if (participant.countdown === 0) {
        const _id = participant._id;
        const rid = participant.rid;
        const identity = participant.identity;
        const msg = isVideoOn ? CALL_STATUS.VIDEO_MISSED : CALL_STATUS.AUDIO_MISSED;

        handleUpdateMessage(_id, rid, identity, msg);

        return null;
      }

      return null;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [rooms, participants]);

  const handleInvitation = (room) => {
    const _id = generateHash();
    const rid = room.rid;
    const identity = room.u.username;
    const msg = isVideoOn ? CALL_STATUS.VIDEO_STARTED : CALL_STATUS.AUDIO_STARTED;

    setRooms((prev) =>
      prev.map((participant) =>
        participant.u._id === room.u._id
          ? { ...participant, _id: _id, countdown: 60 }
          : participant
      )
    );

    handleSendMessage(_id, rid, identity, msg);
  };

  return (
    <>
      <Button
        disabled={room.name !== authUserId}
        className="btn-add-participant"
        onClick={() => setShowInviteDialog(true)}
      >
        <FaUserPlus size={22} /> {translate('common.add_participants')}
      </Button>

      <Dialog
        show={showInviteDialog}
        title={translate('common.add_participants')}
        onCancel={() => setShowInviteDialog(false)}
      >
        <Tabs defaultActiveKey="patient" className="mb-3">
          <Tab eventKey="patient" title={translate('patient')}>
            <ListGroup>
              {rooms.filter(item => /^P\d+/.test(item.u.username)).map((room, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 d-flex align-items-center">
                    {room.name} <span className={`chat-user-status ${room.u.status}`}></span>
                  </p>
                  {participants.some(item => item.identity === (room.u.username + '_' + profile.country_id)) ? (
                    <Button className="min-w-92" size="sm" disabled>
                      <BiPhoneCall size={16} /> {translate('common.joined')}
                    </Button>
                  ) : room.countdown > 0 ? (
                    <Button className="min-w-92" size="sm" disabled>
                      <BiPhoneCall size={16} /> {translate('common.inviting')}
                    </Button>
                  ) : (
                    <Button className="min-w-92" size="sm" onClick={() => handleInvitation(room)}>
                      <FaUserPlus size={16} /> {translate('common.invite')}
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="therapist" title={translate('therapist')}>
            <ListGroup>
              {rooms.filter(item => item.u.username.startsWith('T')).map((room, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 d-flex align-items-center">
                    {room.name} <span className={`chat-user-status ${room.u.status}`}></span>
                  </p>
                  {participants.some(item => item.identity === (room.u.username + '_' + profile.country_id)) ? (
                    <Button className="min-w-92" size="sm" disabled>
                      <BiPhoneCall size={16} /> {translate('common.joined')}
                    </Button>
                  ) : room.countdown > 0 ? (
                    <Button className="min-w-92" size="sm" disabled>
                      <BiPhoneCall size={16} /> {translate('common.inviting')}
                    </Button>
                  ) : (
                    <Button className="min-w-92" size="sm" onClick={() => handleInvitation(room)}>
                      <FaUserPlus size={16} /> {translate('common.invite')}
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="phc_worker" title={translate('phc_worker')}>
            <ListGroup>
              {rooms.filter(item => item.u.username.startsWith('PHC')).map((room, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 d-flex align-items-center">
                    {room.name} <span className={`chat-user-status ${room.u.status}`}></span>
                  </p>
                  {participants.some(item => item.identity === (room.u.username + '_' + profile.country_id)) ? (
                    <Button className="min-w-92" size="sm" disabled>
                      <BiPhoneCall size={16} /> {translate('common.joined')}
                    </Button>
                  ) : room.countdown > 0 ? (
                    <Button className="min-w-92" size="sm" disabled>
                      <BiPhoneCall size={16} /> {translate('common.inviting')}
                    </Button>
                  ) : (
                    <Button className="min-w-92" size="sm" onClick={() => handleInvitation(room)}>
                      <FaUserPlus size={16} /> {translate('common.invite')}
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
        </Tabs>
      </Dialog>
    </>
  );
};

ParticipantInvitation.propTypes = {
  isVideoOn: PropTypes.bool,
  participants: PropTypes.array,
  room: PropTypes.object,
};

export default ParticipantInvitation;
