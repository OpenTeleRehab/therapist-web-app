import React, { useEffect, useState } from 'react';
import { isSupported } from 'twilio-video';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { VscWarning } from 'react-icons/vsc';

const CallingButton = ({ isVideo, children, ...props }) => {
  const [supportedDevice, setSupportedDevice] = useState(undefined);

  useEffect(() => {
    if (isVideo) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        setSupportedDevice(true);
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }).catch(() => {
        setSupportedDevice(false);
      });
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setSupportedDevice(true);
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }).catch(() => {
        setSupportedDevice(false);
      });
    }
  }, [isVideo]);

  const callingBtn = (
    <Button {...props} disabled={!isSupported || !supportedDevice}>
      {children}
    </Button>
  );

  if ((isSupported && supportedDevice) || supportedDevice === undefined) {
    return callingBtn;
  }

  return (
    <OverlayTrigger
      overlay={
        <Tooltip>
          <Translate
            id={
              !isSupported
                ? 'error_message.video_call.unsupported_device'
                : 'error_message.video_call.unsupported_browser'
            }
          />
        </Tooltip>
      }
    >
      <span className="d-inline-block btn-with-warning">
        {callingBtn}
        <span className="badge rounded-pill bg-warning"><VscWarning size={10} /></span>
      </span>
    </OverlayTrigger>
  );
};

CallingButton.propTypes = {
  isVideo: PropTypes.bool,
  children: PropTypes.node
};

CallingButton.defaultProps = {
  isVideo: false
};

export default CallingButton;
