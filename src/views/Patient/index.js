import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { BsPlus, BsChatDotsFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import settings from 'settings';
import moment from 'moment/moment';
import * as ROUTES from 'variables/routes';

import CreatePatient from './create';
import { getUsers } from 'store/user/actions';
import CustomTable from 'components/Table';
import AgeCalculation from 'utils/age';
import { renderStatusBadge } from 'utils/treatmentPlan';
import { getTranslate } from 'react-localize-redux';
import 'react-step-progress-bar/styles.css';
import { ProgressBar } from 'react-step-progress-bar';
import { TiWarning } from 'react-icons/all';
import scssColors from 'scss/custom.scss';
import { getChatRooms } from '../../store/rocketchat/actions';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';

const Patient = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const users = useSelector(state => state.user.users);
  const { profile } = useSelector((state) => state.auth);
  const { countries } = useSelector((state) => state.country);
  const therapist = useSelector(state => state.auth.profile);
  const localize = useSelector((state) => state.localize);
  const { authToken, chatRooms } = useSelector(state => state.rocketchat);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const translate = getTranslate(localize);
  const history = useHistory();

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'date_of_birth', title: translate('common.date_of_birth') },
    { name: 'age', title: translate('common.age') },
    { name: 'ongoing_treatment_plan', title: translate('common.ongoing_treatment_plan') },
    { name: 'treatment_status', title: translate('common.ongoing_treatment_status') },
    { name: 'next_appointment', title: translate('common.next_appointment') },
    { name: 'secondary_therapist', title: translate('common.secondary_primary_therapist') },
    { name: 'notification', title: translate('common.notification') }
  ];

  const defaultHiddenColumnNames = [
    'age', 'ongoing_treatment_plan', 'ongoing_treatment_status', 'next_appointment'
  ];

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'ongoing_treatment_plan', wordWrapEnabled: true },
    { columnName: 'treatment_status', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (profile !== undefined && countries.length) {
      dispatch(getUsers({
        therapist_id: profile.id,
        filters,
        search_value: searchValue,
        page_size: pageSize,
        page: currentPage + 1
      }));
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile, countries]);

  useEffect(() => {
    if (authToken && therapist && therapist.chat_user_id && therapist.chat_rooms.length) {
      dispatch(getChatRooms());
    }
  }, [dispatch, authToken, therapist]);

  const handleRowClick = (row) => {
    history.push(ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', row.id));
  };

  const totalRoomUnreadMessages = (chatUserId) => {
    if (chatRooms.length) {
      const fIndex = chatRooms.findIndex(r => r.rid.includes(chatUserId));

      return chatRooms[fIndex].unread > 99 ? '99+' : chatRooms[fIndex].unread;
    }

    return 0;
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <div>&nbsp;</div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={handleShow}>
            <BsPlus className="mr-1" />
            {translate('patient.new')}
          </Button>
        </div>
        {show && <CreatePatient handleClose={handleClose} show={show} editId={editId} />}
      </div>
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        defaultHiddenColumnNames={defaultHiddenColumnNames}
        onRowClick={handleRowClick}
        hover="hover-primary"
        rows={users.map(user => {
          const notification = (
            <div className="notify-lists d-flex align-items-center">
              <div className="notify-list-item mr-2">
                <ProgressBar width={75} percent={user.completed_percent || 0} />
              </div>
              {user.total_pain_threshold > 0 && (
                <div className="notify-list-item mr-2">
                  <TiWarning className="threshold-icon mr-1" size={20} color={scssColors.orange}/>
                  <sup>{user.total_pain_threshold}</sup>
                </div>
              )}
              {totalRoomUnreadMessages(user.chat_user_id) > 0 && (
                <div className="notify-list-item">
                  <BsChatDotsFill className="chat-icon mr-1" size={20} color={scssColors.primary} />
                  <sup>{totalRoomUnreadMessages(user.chat_user_id)}</sup>
                </div>
              )}
            </div>
          );
          return {
            id: user.id,
            identity: user.identity,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            date_of_birth: user.date_of_birth !== null ? moment(user.date_of_birth, 'YYYY-MM-DD').format(settings.date_format) : '',
            age: user.date_of_birth !== null ? AgeCalculation(user.date_of_birth, translate) : '',
            ongoing_treatment_plan: user.ongoingTreatmentPlan.length ? user.ongoingTreatmentPlan[0].name : user.upcomingTreatmentPlan ? user.upcomingTreatmentPlan.name : '',
            treatment_status: renderStatusBadge(user.ongoingTreatmentPlan.length ? user.ongoingTreatmentPlan[0] : user.lastTreatmentPlan),
            next_appointment: user.upcoming_appointment ? moment.utc(user.upcoming_appointment.start_date).local().format(settings.date_format + ' hh:mm A') : '',
            secondary_therapist: user.is_secondary_therapist ? translate('common.secondary_therapist.label') : translate('common.primary_therapist.label'),
            notification
          };
        })}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;
