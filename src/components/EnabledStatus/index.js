import React from 'react';
import { Badge } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

const EnabledStatus = ({ enabled }) => {
  if (enabled) {
    return (
      <Badge pill variant="success">
        <Translate id="common.active"/>
      </Badge>
    );
  }

  return (
    <Badge pill variant="light">
      <Translate id="common.inactive"/>
    </Badge>
  );
};

EnabledStatus.propTypes = {
  enabled: PropTypes.bool
};

export default EnabledStatus;
