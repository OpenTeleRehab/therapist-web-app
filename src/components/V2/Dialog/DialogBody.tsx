import React from 'react';
import { Modal } from 'react-bootstrap';

type DialogBodyProps = {
  children: React.ReactNode;
}

const DialogBody = ({ children }: DialogBodyProps) => {
  return (
    <Modal.Body>
      {children}
    </Modal.Body>
  );
};

export default DialogBody;
