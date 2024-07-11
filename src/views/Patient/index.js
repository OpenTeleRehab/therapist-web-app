import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Button, Nav, Tab } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { TiWarning } from 'react-icons/all';
import { BsPlus, BsChatDotsFill } from 'react-icons/bs';
import { ProgressBar } from 'react-step-progress-bar';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import _ from 'lodash';

import * as ROUTES from 'variables/routes';
import CreatePatient from './create';
import { getUsers } from 'store/user/actions';
import CustomTable from 'components/Table';
import AgeCalculation from 'utils/age';
import { renderStatusBadge } from 'utils/treatmentPlan';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import scssColors from 'scss/custom.scss';
import { getChatRooms, selectRoom } from '../../store/rocketchat/actions';
import { getTherapistsByClinic } from 'store/therapist/actions';
import customColorScheme from '../../utils/customColorScheme';
import 'react-step-progress-bar/styles.css';
import { loadMessagesInRoom } from '../../utils/rocketchat';
import { showErrorNotification } from '../../store/notification/actions';
import RocketchatContext from '../../context/RocketchatContext';
import { getTransfers } from '../../store/transfer/actions';
import queryString from 'query-string';
import Transfer from './Transfer';

const VIEW_PATIENT = 'patient';
const VIEW_TRANSFER = 'transfer';

const Patient = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [view, setView] = useState(VIEW_PATIENT);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const { users, loading } = useSelector(state => state.user);
  const { profile } = useSelector((state) => state.auth);
  const { countries } = useSelector((state) => state.country);
  const { therapistsByClinic } = useSelector(state => state.therapist);
  const { transfers } = useSelector(state => state.transfer);
  const therapist = useSelector(state => state.auth.profile);
  const localize = useSelector((state) => state.localize);
  const { authToken, chatRooms } = useSelector(state => state.rocketchat);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const chatSocket = useContext(RocketchatContext);
  const translate = getTranslate(localize);
  const history = useHistory();
  const pendingTransfers = transfers.filter(item => item.to_therapist_id === profile.id && item.status === 'invited');

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'last_name', title: translate('common.last_name'), width: 50 },
    { name: 'first_name', title: translate('common.first_name'), width: 50 },
    { name: 'date_of_birth', title: translate('common.date_of_birth') },
    { name: 'age', title: translate('common.age') },
    { name: 'ongoing_treatment_plan', title: translate('common.ongoing_treatment_plan') },
    { name: 'treatment_status', title: translate('common.ongoing_treatment_status') },
    { name: 'next_appointment', title: translate('common.next_appointment') },
    { name: 'secondary_therapist', title: translate('common.secondary_primary_therapist') },
    { name: 'notification', title: translate('common.notification') },
    { name: 'transfer', title: translate('common.transfer') }
  ];

  const defaultHiddenColumnNames = [
    'age',
    'ongoing_treatment_plan',
    'ongoing_treatment_status',
    'next_appointment'
  ];

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'ongoing_treatment_plan', wordWrapEnabled: true },
    { columnName: 'treatment_status', wordWrapEnabled: true },
    { columnName: 'secondary_therapist', wordWrapEnabled: true },
    { columnName: 'transfer', wordWrapEnabled: true, width: 150 }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

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
      dispatch(getTherapistsByClinic(profile.clinic_id));
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile, countries]);

  useEffect(() => {
    if (authToken && therapist && therapist.chat_user_id && therapist.chat_rooms.length) {
      dispatch(getChatRooms());
    }
  }, [dispatch, authToken, therapist]);

  useEffect(() => {
    dispatch(getTransfers());
  }, [dispatch]);

  useEffect(() => {
    if (queryString.parse(search).tab === VIEW_TRANSFER) {
      setView(VIEW_TRANSFER);
    } else {
      setView(VIEW_PATIENT);
    }
  }, [search]);

  const getSecondaryTherapist = (user) => {
    let primaryTherapistHTML = '';
    let secondaryTherapistHTML = '';

    const primaryTherapist = therapistsByClinic.find(item => item.id === user.therapist_id);
    const secondaryTherapists = _.filter(therapistsByClinic, therapist => _.includes(user.secondary_therapists, therapist.id));

    if (primaryTherapist) {
      if (primaryTherapist.id === profile.id) {
        primaryTherapistHTML = `<b>${primaryTherapist.first_name} ${primaryTherapist.last_name}</b>`;
      } else {
        primaryTherapistHTML = `${primaryTherapist.first_name} ${primaryTherapist.last_name}`;
      }
    }

    if (secondaryTherapists.length) {
      const therapists = [];

      secondaryTherapists.forEach(therapist => {
        if (therapist.id === profile.id) {
          therapists.push(`<b>${therapist.first_name} ${therapist.last_name}</b>`);
        } else {
          therapists.push(`${therapist.first_name} ${therapist.last_name}`);
        }
      });

      secondaryTherapistHTML = therapists.join(', ');
    }

    return primaryTherapistHTML + '/' + secondaryTherapistHTML;
  };

  const handleRowClick = (row) => {
    history.push(ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', row.id));
  };

  const handleSelectRoomToCall = (event, patient) => {
    event.stopPropagation();

    const findIndex = chatRooms.findIndex(r => r.u._id === patient.chat_user_id);

    if (findIndex !== -1 && patient.enabled) {
      dispatch(selectRoom(chatRooms[findIndex]));
      loadMessagesInRoom(chatSocket, chatRooms[findIndex].rid, therapist.id);
      history.push(ROUTES.CHAT_OR_CALL);
    } else {
      dispatch(showErrorNotification('chat_or_call', 'error_message.chat_nonactivated'));
    }
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Tab.Container mountOnEnter activeKey={view}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.PATIENT} eventKey={VIEW_PATIENT}>
              {translate('patient.list')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.PATIENT_TRANSFER} eventKey={VIEW_TRANSFER}>
              {translate('transfer.list')} <Badge className="ml-1" variant="danger">{ pendingTransfers.length }</Badge>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={VIEW_PATIENT}>
            <div className="d-flex justify-content-end align-items-center mb-3">
              <div className="btn-toolbar gap-3">
                <Button className="ml-3" variant="primary" onClick={handleShow}>
                  <BsPlus className="mr-1"/>
                  {translate('patient.new')}
                </Button>
              </div>
              {show && <CreatePatient handleClose={handleClose} show={show} editId={editId}/>}
            </div>
            <CustomTable
              loading={loading}
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
                const transfer = transfers.find(item => item.patient_id === user.id && item.therapist_type === 'lead');
                const room = chatRooms.find(r => r.rid.includes(user.chat_user_id));
                const unread = room ? room.unread : 0;

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
                    {unread > 0 && (
                      <div className="notify-list-item">
                        <Button className="text-decoration-none" onClick={(event) => handleSelectRoomToCall(event, user)} variant="link">
                          <BsChatDotsFill className="chat-icon mr-1" size={20} color={scssColors.primary} />
                          <sup>{unread > 99 ? '99+' : unread}</sup>
                        </Button>
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
                  date_of_birth: user.date_of_birth !== null ? moment(user.date_of_birth, 'YYYY-MM-DD').locale('en').format(settings.date_format) : '',
                  age: user.date_of_birth !== null ? AgeCalculation(user.date_of_birth, translate) : '',
                  ongoing_treatment_plan: user.ongoingTreatmentPlan.length ? user.ongoingTreatmentPlan[0].name : user.upcomingTreatmentPlan ? user.upcomingTreatmentPlan.name : '',
                  treatment_status: renderStatusBadge(user.ongoingTreatmentPlan.length ? user.ongoingTreatmentPlan[0] : user.lastTreatmentPlan),
                  next_appointment: user.upcoming_appointment ? moment.utc(user.upcoming_appointment.start_date).local().format(settings.date_format + ' hh:mm A') : '',
                  secondary_therapist: <span dangerouslySetInnerHTML={{ __html: getSecondaryTherapist(user) }}></span>,
                  notification,
                  transfer: transfer && transfer.from_therapist_id === therapist.id && <Badge pill variant="warning">{translate(`transfer.status.${transfer.status}`)}</Badge>
                };
              })}
            />
          </Tab.Pane>
          <Tab.Pane eventKey={VIEW_TRANSFER}>
            <Transfer/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;
