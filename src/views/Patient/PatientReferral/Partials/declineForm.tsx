import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import useTranslate from 'hooks/useTranslate';
import { useUpdate } from 'hooks/useUpdate';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { END_POINTS } from 'variables/endPoint';
import useToast from 'components/V2/Toast';

type DeclineFormProps = {
  referralAssignmentId: number;
}

const DeclineForm = ({ referralAssignmentId }: DeclineFormProps) => {
  const t: any = useTranslate();
  const { showToast } = useToast();
  const { closeDialog } = useDialog();
  const { mutate: declineReferral } = useUpdate(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT);
  const { control, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    declineReferral({ id: `${referralAssignmentId}/decline`, payload: data }, {
      onSuccess: (res) => {
        showToast({
          title: t('patient.referral.decline.title'),
          message: t(res.message),
        });
        closeDialog();
      }
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Input
          control={control}
          name='reason'
          label={t('common.reason')}
          controlAs="textarea"
          rows={4}
        />
      </DialogBody>
      <DialogFooter>
        <Button type='submit'>{t('common.save')}</Button>
        <Button
          onClick={closeDialog}
          variant="outline-dark"
        >
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default DeclineForm;
