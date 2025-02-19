import React, { useEffect, useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { FaUserPlus } from 'react-icons/fa';
import { BiPhoneCall } from 'react-icons/bi';
import { Button, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { CALL_STATUS } from '../../../../../variables/rocketchat';
import { useVideoCallContext } from '../../../../../context/VideoCallContext';
import Dialog from '../../../../../components/Dialog';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ParticipantInvitation = ({ participants, isVideoOn }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { handleSendMessage, toggleInvitation } = useVideoCallContext();
  const { profile } = useSelector(state => state.auth);
  const { authUserId, chatRooms, videoCall } = useSelector(state => state.rocketchat);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [rooms, setRooms] = useState(_.cloneDeep(chatRooms));

  useEffect(() => {
    toggleInvitation(rooms.some(item => item.countdown > 0));
  }, [rooms]);

  useEffect(() => {
    const timers = rooms.map((participant) => {
      if (participant.countdown === 0) {
        handleSendMessage(participant.rid, participant.name, isVideoOn ? CALL_STATUS.VIDEO_MISSED : CALL_STATUS.AUDIO_MISSED);
        return null;
      }

      if (participant.countdown > 0) {
        const timer = setTimeout(() => {
          setRooms((prev) =>
            prev.map((p) =>
              p.id === participant.id && !participants.some(item => item.identity === (p.u.username + '_' + profile.country_id))
                ? { ...p, countdown: p.countdown - 1 }
                : { ...p, countdown: undefined }
            )
          );
        }, 1000);

        return timer;
      }

      return null;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [rooms, participants]);

  const handleInvitation = (room) => {
    setRooms((prev) =>
      prev.map((participant) =>
        participant.u._id === room.u._id
          ? { ...participant, countdown: 60 }
          : participant
      )
    );

    handleSendMessage(room.rid, room.u.username, isVideoOn ? CALL_STATUS.VIDEO_STARTED : CALL_STATUS.AUDIO_STARTED);
  };

  return (
    <>
      {videoCall.u._id === authUserId ? (
        <Button
          disabled={participants.length === 0}
          className="btn-add-participant"
          onClick={() => setShowInviteDialog(true)}
        >
          <FaUserPlus size={22} /> {translate('common.add_participants')}
        </Button>
      ) : (
        <Button
          disabled
          className="btn-add-participant"
        >
          {translate('common.participants')}
        </Button>
      )}

      <Dialog
        show={showInviteDialog}
        title={translate('common.add_participants')}
        onCancel={() => setShowInviteDialog(false)}
      >
        <Tabs defaultActiveKey="patient" className="mb-3">
          <Tab eventKey="patient" title={translate('patient')}>
            <ListGroup>
              {rooms.filter(item => item.u.username.startsWith('P')).map((room, index) => (
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
        </Tabs>
      </Dialog>
    </>
  );
};

ParticipantInvitation.propTypes = {
  participants: PropTypes.array,
  isVideoOn: PropTypes.bool
};

export default ParticipantInvitation;
