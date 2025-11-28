import React, { useState, createContext, useContext } from 'react';
import Toast from 'react-bootstrap/Toast';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

interface IToast {
  show?: boolean;
  title: string;
  message: any;
  color?: 'primary' | 'success' | 'danger';
}

interface ToastProviderProps {
  children: React.ReactNode;
}

interface IToastContext {
  showToast: (toast: IToast) => void;
  hideToast: () => void;
}

const ToastContext = createContext<IToastContext | undefined>(undefined);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<IToast>({
    show: false,
    title: '',
    message: '',
    color: 'primary'
  });

  const showToast = ({ title, message, color = 'success' }: IToast) => {
    setToast({ show: true, title, message, color });
  };

  const hideToast = () => {
    setToast({
      show: false,
      title: '',
      message: ''
    });
  };

  const { show, title, message, color } = toast;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      <Toast
        onClose={hideToast}
        show={show}
        autohide
        className={`type-${color}`}
      >
        <Toast.Header>
          {
            color === 'success' &&
            <BsCheckCircle size={22} className="mr-2" />
          }
          {
            color === 'danger' &&
            <BsXCircle size={22} className="mr-2" />
          }
          <strong className="mr-auto">
            {title}
          </strong>
        </Toast.Header>
        <Toast.Body>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export default useToast;
