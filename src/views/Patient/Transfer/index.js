import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-step-progress-bar/styles.css';
import { getTranslate } from 'react-localize-redux';
import BackButton from '../Partials/backButton';
import CustomTable from '../../../components/Table';
import { getPatientsByIds } from '../../../store/patient/actions';
import _ from 'lodash';
import moment from 'moment';
import settings from '../../../settings';
import { Button } from 'react-bootstrap';
import { BsCheck, BsX } from 'react-icons/bs';
import { acceptTransfer, declineTransfer, getTransfers } from '../../../store/transfer/actions';

const Transfer = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector(state => state.auth);
  const { transfers } = useSelector(state => state.transfer);

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [patients, setPatients] = useState([]);

  const translate = getTranslate(localize);

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'date_of_birth', title: translate('common.date_of_birth') },
    { name: 'secondary_therapist', title: translate('common.secondary_primary_therapist') },
    { name: 'transfer_from', title: translate('common.transfer_from') },
    { name: 'action', title: translate('common.action') }
  ];

  const columnExtensions = [
    { columnName: 'action', width: 220 }
  ];

  useEffect(() => {
    dispatch(getTransfers());
  }, [dispatch]);

  useEffect(() => {
    if (transfers.length) {
      const receiveTransfers = transfers.filter(item => item.to_therapist_id === profile.id && item.status === 'invited');
      const patientIds = _.map(receiveTransfers, 'patient_id');

      dispatch(getPatientsByIds({ patient_ids: patientIds })).then((data) => {
        setPatients(data);
      });
    } else {
      setPatients([]);
    }
  }, [dispatch, transfers]);

  const handleAcceptTransfer = (transferId, patient) => {
    dispatch(acceptTransfer({
      transfer_id: transferId,
      patient_id: patient.id,
      patient_chat_user_id: patient.chat_user_id,
      chat_rooms: patient.chat_rooms
    }));
    dispatch(getTransfers());
  };

  const handleDeclineTransfer = (transferId) => {
    dispatch(declineTransfer(transferId));
    dispatch(getTransfers());
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">{translate('transfer.list')}</h1>
        <div className="btn-toolbar gap-3">
          <BackButton />
        </div>
      </div>

      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hideSearchFilter
        columns={columns}
        columnExtensions={columnExtensions}
        rows={transfers.map(transfer => {
          const patient = patients.find(item => item.id === transfer.patient_id);

          const renderTransfer = (
            <>
              <Button
                className="mr-1 mb-1"
                aria-label="Accept"
                variant="primary"
                size="sm"
                onClick={() => handleAcceptTransfer(transfer.id, patient)}
              >
                <BsCheck size={18} /> {translate('transfer.status.accept')}
              </Button>
              <Button
                className="mr-1 mb-1"
                aria-label="Reject"
                variant="danger"
                size="sm"
                onClick={() => handleDeclineTransfer(transfer.id)}
              >
                <BsX size={18} /> {translate('transfer.status.decline')}
              </Button>
            </>
          );

          return {
            identity: patient && patient.identity,
            last_name: patient && patient.last_name,
            first_name: patient && patient.first_name,
            date_of_birth: patient && patient.date_of_birth ? moment(patient.date_of_birth, 'YYYY-MM-DD').locale('en').format(settings.date_format) : '',
            secondary_therapist: transfer && transfer.therapist_type === 'lead' ? translate('common.primary_therapist.label') : translate('common.secondary_therapist.label'),
            transfer_from: transfer && transfer.from_therapist && `${transfer.from_therapist.first_name} ${transfer.from_therapist.last_name}`,
            action: renderTransfer
          };
        })}
      />
    </>
  );
};

export default Transfer;
