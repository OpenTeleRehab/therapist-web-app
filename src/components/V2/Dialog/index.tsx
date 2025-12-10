import React, { createContext, useContext, useState } from 'react';
import { Modal, ModalProps } from 'react-bootstrap';

interface IDialogConfig {
  title: string;
  content: React.ReactNode;
  props?: ModalProps;
}

interface IDialogContext {
  openDialog: (config: IDialogConfig) => void;
  closeDialog: () => void;
}

interface DialogProviderProps {
  children: React.ReactNode;
}

const DialogContext = createContext<IDialogContext | undefined>(undefined);

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogs, setDialogs] = useState<IDialogConfig[]>([]);

  const openDialog = (config: IDialogConfig) => {
    setDialogs((prev) => [...prev, config]);
  };

  const closeDialog = () => {
    setDialogs((prev) => prev.slice(0, -1));
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      {dialogs.map((dialog, index) => (
        <Modal
          key={index}
          show
          onHide={closeDialog}
          backdrop="static"
          {...dialog.props}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-break">{dialog.title}</Modal.Title>
          </Modal.Header>
          {dialog.content}
        </Modal>
      ))}
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  return context;
};

export default useDialog;
