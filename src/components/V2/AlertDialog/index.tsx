import { Button } from 'react-bootstrap';
import useDialog from '../Dialog';
import DialogBody from '../Dialog/DialogBody';
import DialogFooter from '../Dialog/DialogFooter';
import useTranslate from 'hooks/useTranslate';
import { useCallback } from 'react';

type ShowAlertType = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmProps?: any;
  cancelProps?: any;
  hideConfirm?: boolean;
  hideCancel?: boolean;
  closeOnConfirm?: boolean;
  props?: { size: 'sm' | 'lg' | 'xl' | undefined };
}

export const useAlertDialog = () => {
  const t = useTranslate();
  const { openDialog, closeDialog } = useDialog();

  const showAlert = useCallback(({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    confirmProps,
    cancelProps,
    hideConfirm,
    hideCancel,
    closeOnConfirm = true,
    props
  }: ShowAlertType) => {
    openDialog({
      title,
      content: (
        <>
          <DialogBody>
            {message}
          </DialogBody>
          <DialogFooter>
            {!hideConfirm && (
              <Button
                onClick={() => {
                  onConfirm?.();
                  if (closeOnConfirm) closeDialog();
                }}
                {...confirmProps}
              >
                {confirmText || t('common.yes')}
              </Button>
            )}

            {!hideCancel && (
              <Button
                variant='outline-dark'
                onClick={() => {
                  onCancel?.();
                  closeDialog();
                }}
                {...cancelProps}
              >
                {cancelText || t('common.no')}
              </Button>
            )}
          </DialogFooter>
        </>
      ),
      props
    });
  }, [t, openDialog, closeDialog]);

  return { showAlert };
};
