import { useList } from 'hooks/useList';
import { useMemo, useState } from 'react';
import { END_POINTS } from 'variables/endPoint';
import Table from '../../../components/Table';
import moment from 'moment';
import useTranslate from 'hooks/useTranslate';
import { Button } from 'react-bootstrap';
import { IReferralAssignmentResource } from 'interfaces/IReferralAssignment';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import useDialog from 'components/V2/Dialog';
import DeclineForm from './Partials/declineForm';
import { useUpdate } from 'hooks/useUpdate';
import useToast from 'components/V2/Toast';

const CustomTable = Table as any;

const PatientReferralList = () => {
  const t: any = useTranslate();
  const { openDialog } = useDialog();
  const { showToast } = useToast();
  const [pageSize, setPageSize] = useState<number>(60);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { mutate: acceptPatientReferral } = useUpdate(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT);
  const { data: referralAssignments } = useList<IReferralAssignmentResource>(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT, {
    page_size: pageSize,
    page: currentPage,
  });

  const formatLeadSupplementaryPhc = (workers: string[] = []) => {
    if (!workers || workers.length === 0) return '';

    const [first, ...rest] = workers;
    let display = `<b>${first}</b>`;

    if (rest.length > 0) {
      display += ' / ' + rest.join(' / ');
    }

    return display;
  };

  const handleAccept = (referralAssignmentId: number) => {
    acceptPatientReferral({ id: `${referralAssignmentId}/accept`, payload: { status: 'accepted' } }, {
      onSuccess: (res) => {
        showToast({
          title: t('patient.referral.assignment.title'),
          message: t(res.message ?? '')
        });
      }
    });
  };

  const handleDecline = (referralAssignmentId: number) => {
    openDialog({
      title: t('patient.referral.decline.title'),
      content: <DeclineForm referralAssignmentId={referralAssignmentId} />
    });
  };

  const rows = useMemo(() => {
    return (referralAssignments?.data ?? []).map((ra) => {
      const action = (
        <div className='d-flex justify-content-end'>
          <Button
            size="sm"
            className="d-flex justify-content-center align-items-center"
            onClick={() => handleAccept(ra.id)}
          >
            <FaCheck /> {t('common.accept')}
          </Button>
          <Button
            size="sm"
            variant='danger'
            className='ml-1 d-flex justify-content-center align-items-center'
            onClick={() => handleDecline(ra.id)}
          >
            <IoClose size={18} /> {t('common.declined')}
          </Button>
        </div>
      );

      return {
        identity: ra.id,
        date_of_birth: ra.date_of_birth ? moment(ra.date_of_birth).format('DD/MM/YYYY') : '',
        phc_workers: <span dangerouslySetInnerHTML={{ __html: formatLeadSupplementaryPhc(ra.lead_and_supplementary_phc) }}></span>,
        referred_by: ra.referred_by,
        action,
      };
    });
  }, [referralAssignments, t]);

  const columns = useMemo(() => [
    { name: 'identity', title: t('common.id') },
    { name: 'date_of_birth', title: t('common.date_of_birth') },
    { name: 'phc_workers', title: t('referral.lead.and.supplementary') },
    { name: 'referred_by', title: t('referral.referred_by') },
    { name: 'action', title: t('common.action') },
  ], [t]);

  return (
    <CustomTable
      pageSize={pageSize}
      setPageSize={setPageSize}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      hideSearchFilter
      columns={columns}
      rows={rows}
    />
  );
};

export default PatientReferralList;
