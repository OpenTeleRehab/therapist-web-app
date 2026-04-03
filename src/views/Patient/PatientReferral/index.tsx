import { useList } from 'hooks/useList';
import { useEffect, useMemo, useState } from 'react';
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
import InterviewHistoryDialog from './Partials/InterviewHistoryDialog';
import { useInvalidate } from 'hooks/useInvalidate';

const CustomTable = Table as any;

const PatientReferralList = () => {
  const t: any = useTranslate();
  const { openDialog } = useDialog();
  const { showToast } = useToast();
  const invalidate = useInvalidate();
  const [pageSize, setPageSize] = useState<number>(60);
  const [currentPage, setCurrentPage] = useState<number>(1);
   const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [showInterviewHistory, setShowInterviewHistory] = useState(false);
  const [interviewPatientId, setInterviewPatientId] = useState<number | null>(null);
  const { mutate: acceptPatientReferral } = useUpdate(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT);
  const { data: referralAssignments } = useList<IReferralAssignmentResource>(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT, {
    page_size: pageSize,
    page: currentPage + 1,
    search_value: searchValue,
    filters,
  });

  useEffect(() => {
    if (referralAssignments && referralAssignments.info) {
      setTotalCount(referralAssignments.info.total_count);
    }
  }, [referralAssignments]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  const handleViewHistory = (patientId: number) => {
    setInterviewPatientId(patientId);
    setShowInterviewHistory(true);
  };

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
        invalidate(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT_COUNT);
        showToast({
          title: t('patient.referral_assignment.accept.title'),
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
        identity: ra.patient_identity,
        last_name: ra.last_name,
        first_name: ra.first_name,
        date_of_birth: ra.date_of_birth ? moment(ra.date_of_birth).format('DD/MM/YYYY') : '',
        phc_workers: <span dangerouslySetInnerHTML={{ __html: formatLeadSupplementaryPhc(ra.lead_and_supplementary_phc) }}></span>,
        referred_by: ra.referred_by,
        request_reason: ra.request_reason,
        interview_history: <p className="text-primary" style={{ cursor: 'pointer' }} onClick={() => handleViewHistory(ra.patient_id)}>{t('common.view_history')}</p>,
        action,
      };
    });
  }, [referralAssignments, t]);

  const columns = useMemo(() => [
    { name: 'identity', title: t('common.id') },
    { name: 'last_name', title: t('common.last_name'), width: 50 },
    { name: 'first_name', title: t('common.first_name'), width: 50 },
    { name: 'date_of_birth', title: t('common.date_of_birth') },
    { name: 'phc_workers', title: t('referral.lead.and.supplementary') },
    { name: 'request_reason', title: t('referral.phc_request_reason') },
    { name: 'referred_by', title: t('referral.referred_by') },
    { name: 'interview_history', title: t('common.interview_history') },
    { name: 'action', title: t('common.action') },
  ], [t]);

  const defaultHiddenColumnNames = [
    'referred_by',
  ];

  const columnExtensions = [
    { columnName: 'request_reason', wordWrapEnabled: true },
    { columnName: 'action', align: 'right' },
    { columnName: 'phc_workers', wordWrapEnabled: true },
  ];

  return (
    <>
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        defaultHiddenColumnNames={defaultHiddenColumnNames}
        rows={rows}
      />
      <InterviewHistoryDialog
        show={showInterviewHistory}
        onClose={() => setShowInterviewHistory(false)}
        patientId={interviewPatientId}
      />
    </>
  );
};

export default PatientReferralList;
