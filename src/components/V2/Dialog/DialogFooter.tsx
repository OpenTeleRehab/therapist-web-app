import React from 'react';
import { Modal } from 'react-bootstrap';

type DialogFooterProps = {
  children: React.ReactNode;
  className?: string;
}

const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return (
    <Modal.Footer className={className!}>
      {children}
    </Modal.Footer>
  );
};

export default DialogFooter;
