import React from 'react';
import {
  SelectionState,
  TreeDataState,
  CustomTreeData
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn
} from '@devexpress/dx-react-grid-bootstrap4';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { BsCaretDownFill, BsCaretRightFill } from 'react-icons/bs';

const CustomTree = ({ data, columns, treeColumnName, tableColumnExtensions, selection, onSelectChange }) => {
  const getChildRows = (row, rootRows) => {
    const childRows = rootRows.filter(r => r.parentId === (row ? row.id : null));
    return childRows.length ? childRows : null;
  };

  return (
    <div className="card tree-container">
      <Grid
        rows={data}
        columns={columns}
      >
        <SelectionState
          selection={selection}
          onSelectionChange={onSelectChange}
        />
        <TreeDataState />
        <CustomTreeData
          getChildRows={getChildRows}
        />
        <Table
          columnExtensions={tableColumnExtensions}
        />
        <TableHeaderRow />
        <TableTreeColumn
          for={treeColumnName}
          showSelectionControls
          checkboxComponent={(props) => <TreeCheckBox {...props} />}
          expandButtonComponent={(props) => <TreeExpandedButton {...props} />}
        />
      </Grid>
    </div>
  );
};

CustomTree.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  treeColumnName: PropTypes.array,
  tableColumnExtensions: PropTypes.array,
  selection: PropTypes.array,
  onSelectChange: PropTypes.func
};

const TreeCheckBox = ({ checked, indeterminate, onChange }) => {
  return (
    <Form.Check
      className="form-check tree-checkbox"
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
  );
};

TreeCheckBox.propTypes = {
  indeterminate: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

const TreeExpandedButton = ({ visible, expanded, onToggle }) => {
  return (
    <>
      {
        <Button variant="link" className={'p-0 mr-2 ' + (visible ? '' : 'invisible')}
          onClick={onToggle}>
          {expanded ? (
            <BsCaretDownFill size={15} color="black" />
          ) : (
            <BsCaretRightFill size={15} color="black" />
          )
          }
        </Button>
      }
    </>
  );
};

TreeExpandedButton.propTypes = {
  visible: PropTypes.bool,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func
};

export default CustomTree;
