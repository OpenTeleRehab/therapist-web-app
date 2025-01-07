import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';

const LocalParticipant = ({ participant, isVideoOn, isAudioOn }) => {
  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    const videoTrack = trackpubsToTracks(participant.videoTracks)[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [participant, isVideoOn]);

  useEffect(() => {
    const audioTrack = trackpubsToTracks(participant.audioTracks)[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [participant, isAudioOn]);

  return (
    <div className="participant">
      {!isVideoOn && (
        <div className="participant-avatar">
          <FaUserCircle size={50} color="white" />
        </div>
      )}
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

LocalParticipant.propTypes = {
  participant: PropTypes.object,
  isAudioOn: PropTypes.bool,
  isVideoOn: PropTypes.bool
};

export default LocalParticipant;
