import React from 'react';
import {
  Template,
  TemplatePlaceholder,
  Plugin
} from '@devexpress/dx-react-core';
import { Button } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

const FilterToggle = ({ onToggle, showFilter }) => (
  <Plugin>
    <Template name="toolbarContent">
      <TemplatePlaceholder />
      <Button
        className="mr-2"
        variant="outline-dark"
        onClick={onToggle}
        active={showFilter}
      >
        <FaFilter className="mr-1" />
        <Translate id="common.filters" />
      </Button>
    </Template>
  </Plugin>
);

FilterToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  showFilter: PropTypes.bool
};

export default FilterToggle;
