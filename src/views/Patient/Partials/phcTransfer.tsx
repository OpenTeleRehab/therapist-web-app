import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Select from 'components/V2/Form/Select';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useList } from 'hooks/useList';
import useTranslate from 'hooks/useTranslate';
import { ITransferRequest } from 'interfaces/ITransfer';
import { useMemo } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { END_POINTS } from 'variables/endPoint';

type PhcTransferProps = {
  patientId: number;
}

const PhcTransfer = ({ patientId }: PhcTransferProps) => {
  const t: any = useTranslate();
  const { profile } = useSelector((state: any) => state.auth);
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { data: phcWorkers } = useList(END_POINTS.PHC_WORKERS_BY_PHC_SERVICE);
  const { mutate: createTransfer } = useCreate(END_POINTS.TRANSFER);
  const { control, handleSubmit } = useForm<ITransferRequest>({
    defaultValues: {
      patient_id: patientId,
      phc_service_id: profile.phc_service_id,
      from_therapist_id: profile.id,
      therapist_type: 'lead',
      to_therapist_id: 0,
    }
  });

  const phcWorkerOptions = useMemo(
    () =>
      (phcWorkers?.data ?? []).filter((pw: any) => pw.id !== profile.id).map((pw: any) => ({
        label: `${pw.last_name} ${pw.first_name}`,
        value: pw.id,
      })),
    [phcWorkers, profile]
  );

  const onSubmit = handleSubmit(async (data) => {
    createTransfer(data, {
      onSuccess: (res) => {
        showToast({
          title: t('common.transfer_patient'),
          message: t(res.message || ''),
        });
        closeDialog();
      },
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Form.Row>
          <Select
            as={Col}
            control={control}
            label={t('common.phc_worker')}
            name='to_therapist_id'
            options={phcWorkerOptions}
            placeholder={t('placeholder.phc_worker')}
            rules={{
              required: true,
              validate: (value) => {
                if (value === 0) {
                  return t('required.phc_worker');
                }
              }
            }}
          />
        </Form.Row>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {t('common.save')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default PhcTransfer;
