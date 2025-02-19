import React from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { VscWarning } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
const SmsButton = ({ children, ...props }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const smsButton = (
    <Button {...props} >
      {children}
    </Button>
  );
  return (
    <>
      {props.reachMaxSms
        ? <OverlayTrigger overlay={<Tooltip>{translate('error_message.sms.reach.limit', { number: props.maxSms })}</Tooltip>}>
          <span className="d-inline-block btn-with-warning">
            {smsButton}
            <span className="badge rounded-pill bg-warning"><VscWarning size={10} /></span>
          </span>
        </OverlayTrigger>
        : smsButton}
    </>
  );
};

SmsButton.propTypes = {
  isVideo: PropTypes.bool,
  children: PropTypes.node,
  reachMaxSms: PropTypes.bool,
  isOngoingTreatment: PropTypes.bool,
  maxSms: PropTypes.number
};

SmsButton.defaultProps = {
  isVideo: false
};

export default SmsButton;
