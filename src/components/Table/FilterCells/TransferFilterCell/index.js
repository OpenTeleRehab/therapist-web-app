import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';

const TransferFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [status, setStatus] = useState('');

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

  const transferOptions = [
    {
      value: '',
      name: translate('common.all')
    },
    {
      value: 'invited',
      name: translate('transfer.status.invited')
    },
    {
      value: 'declined',
      name: translate('transfer.status.declined')
    }
  ];

  const handleFilter = (value) => {
    setStatus(value);
    onFilter(value === '' ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={transferOptions.filter(item => item.value === status) }
        getOptionLabel={option => option.name}
        options={transferOptions}
        onChange={(e) => handleFilter(e.value)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Transfer status"
      />
    </th>
  );
};

TransferFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default TransferFilterCell;
