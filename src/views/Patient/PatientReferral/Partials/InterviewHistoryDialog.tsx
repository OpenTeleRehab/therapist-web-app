import Dialog from 'components/Dialog';
import InterviewHistory from '../../InterviewList';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

type InterviewHistoryDialogProps = {
  show: boolean;
  onClose: () => void;
  patientId: number | null;
};

const InterviewHistoryDialog = ({ show, onClose, patientId }: InterviewHistoryDialogProps) => {
  const localize = useSelector((state: any) => state.localize);
  const translate = getTranslate(localize);

  return (
    <Dialog show={show} onCancel={onClose} title={translate('common.interview_history')}>
      <InterviewHistory patientId={patientId} />
    </Dialog>
  );
};

export default InterviewHistoryDialog;
