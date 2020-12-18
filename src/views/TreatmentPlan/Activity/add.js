import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

const AddActivity = ({ show, handleClose, editId }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const handleConfirm = () => {
    handleClose();
  };

  return (
    <Dialog
      show={show}
      title={translate('activity.select_activities_to_add')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={translate('common.save')}
      size="xl"
    >
      <Tabs transition={false}>
        <Tab eventKey="exercise" title={translate('activity.exercises')}>
          {translate('activity.exercises')}
        </Tab>
        <Tab eventKey="education" title={translate('activity.education_materials')}>
          {translate('activity.education_materials')}
        </Tab>
        <Tab eventKey="questionnaire" title={translate('activity.questionnaires')}>
          {translate('activity.questionnaires')}
        </Tab>
      </Tabs>
    </Dialog>
  );
};

AddActivity.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.string
};

export default AddActivity;
