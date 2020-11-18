import React from 'react';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';

const Container = () => {
  return (
    <div>+++</div>
  );
};

Container.propTypes = {
  value: PropTypes.any,
  onValueChange: PropTypes.func.isRequired,
  translate: PropTypes.func
};

export default withLocalize(Container);
