import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import scssColors from 'scss/custom.scss';
import Select from 'react-select';

const AssistiveTechnologyFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const { assistiveTechnologies } = useSelector(state => state.assistiveTechnology);
  const translate = getTranslate(localize);
  const [assistive, setAssistive] = useState('');

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    }),
    menuPortal: base => ({ ...base, zIndex: 1000 })
  };

  const handleFilter = (value) => {
    setAssistive(value);
    onFilter(value === '' ? null : { value });
  };
  const optionData = [
    {
      id: '',
      name: translate('common.all')
    },
    ...assistiveTechnologies
  ];

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={optionData.filter(item => item.id === assistive)}
        getOptionLabel={option => option.name}
        options={optionData}
        onChange={(e) => handleFilter(e.id)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="assistive"
      />
    </th>
  );
};

AssistiveTechnologyFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default AssistiveTechnologyFilterCell;
