import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

const Dialog = (props) => {
  const {
    show,
    title,
    onConfirm,
    onCancel,
    cancelLabel,
    confirmLabel,
    disabledConfirmButton,
    children,
    onCopy,
    onEdit,
    copyLabel,
    editLabel,
    ...rest
  } = props;

  return (
    <Modal
      show={show}
      onHide={onCancel}
      backdrop="static"
      {...rest}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        {onConfirm &&
          <Button variant="primary" onClick={onConfirm} disabled={disabledConfirmButton} onKeyPress={(e) => e.key === 'Enter' && e.stopPropagation()}>
            {confirmLabel}
          </Button>
        }
        {onCopy &&
          <Button variant="outline-dark" onClick={onCopy}>
            {copyLabel}
          </Button>
        }
        {onEdit &&
          <Button variant="outline-dark" onClick={onEdit} >
            {editLabel}
          </Button>
        }
        <Button variant="outline-dark" onClick={onCancel} onKeyPress={(e) => e.key === 'Enter' && e.stopPropagation()}>
          {cancelLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

Dialog.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  disabledConfirmButton: PropTypes.bool,
  onCopy: PropTypes.func,
  onEdit: PropTypes.func,
  copyLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  editLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node])

};

Dialog.defaultProps = {
  confirmLabel: <Translate id="common.create"/>,
  cancelLabel: <Translate id="common.cancel"/>,
  copyLabel: <Translate id="common.copy"/>,
  editLabel: <Translate id="common.edit"/>,
  disabledConfirmButton: false
};

export default Dialog;
