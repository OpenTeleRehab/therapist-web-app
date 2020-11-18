import React, { Fragment } from 'react';
import { Toolbar as ToolbarDx } from '@devexpress/dx-react-grid';
import { withComponents } from '@devexpress/dx-react-core';
import PropTypes, { arrayOf, node } from 'prop-types';

const Toolbar = ({ children }) => (
  <div className="d-flex  mb-3">
    {children}
  </div>
);

Toolbar.propTypes = {
  children: PropTypes.oneOfType([arrayOf(node), node]).isRequired,
  className: PropTypes.string
};

export default withComponents({ Root: Toolbar, FlexibleSpace: Fragment })(ToolbarDx);
