import React, { useContext, useState } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
import * as ROUTES from 'variables/routes';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import { unSubscribeEvent, chatLogout } from 'utils/rocketchat';
import RocketchatContext from 'context/RocketchatContext';

const Navigation = ({ translate }) => {
  const { keycloak } = useKeycloak();
  const chatSocket = useContext(RocketchatContext);
  const { profile } = useSelector((state) => state.auth);
  const { chatRooms, isChatConnected, subscribeIds } = useSelector((state) => state.rocketchat);
  const { appointments } = useSelector((state) => state.appointment);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = () => {
    if (isChatConnected) {
      unSubscribeEvent(chatSocket, subscribeIds.roomMessageId);
      unSubscribeEvent(chatSocket, subscribeIds.notifyLoggedId);
      chatLogout(chatSocket, subscribeIds.loginId);
    }
    if (keycloak.authenticated) {
      keycloak.logout();
    }
  };

  // total unread
  let unreadMessage = 0;
  chatRooms.forEach(room => {
    unreadMessage += room.unread;
  });

  // dynamic classes base on unread and appointments
  let navClassesUnread = '';
  let badgeClassesUnread = '';
  let navClassesAppointments = '';
  let badgeClassesAppointments = '';

  const getBadgeClass = (quantities) => {
    const digit = quantities.toString().length;
    return {
      navClasses: digit === 3 ? ' has-badge lg' : digit === 2 ? ' has-badge md' : ' has-badge',
      badgeClasses: digit === 3 ? ' lg' : digit === 2 ? ' md' : ''
    };
  };

  if (unreadMessage > 0) {
    const unread = getBadgeClass(unreadMessage);
    navClassesUnread = unread.navClasses;
    badgeClassesUnread = unread.badgeClasses;
  }

  if (appointments.upcomingAppointments > 0) {
    const upcomings = getBadgeClass(appointments.upcomingAppointments);
    navClassesAppointments = upcomings.navClasses;
    badgeClassesAppointments = upcomings.badgeClasses;
  }

  return (
    <Navbar bg="primary" variant="dark" expand="xl" sticky="top" className="main-nav">
      <Navbar.Brand>
        <Link to={ROUTES.PATIENT}>
          <img
            src="/images/logo.png"
            className="d-inline-block align-top"
            alt="OpenTeleRehap logo"
            width="125"
          />
        </Link>
      </Navbar.Brand>
      <span className="portal-name ml-3">
        {translate('portal.name')}
      </span>
      <Navbar.Toggle aria-controls="basic-navbar-nav ml-auto" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto" variant="pills">
          <NavLink
            exact
            to={ROUTES.DASHBOARD}
            key="nav-dashboard"
            className="d-flex align-items-center nav-link"
          >
            {translate('dashboard')}
          </NavLink>
          <NavLink
            to={ROUTES.PATIENT}
            key="nav-patient"
            className="d-flex align-items-center nav-link"
          >
            {translate('patient')}
          </NavLink>
          <NavLink
            to={ROUTES.LIBRARY}
            key="nav-library"
            className="d-flex align-items-center nav-link"
          >
            {translate('library')}
          </NavLink>
          <NavLink
            to={ROUTES.APPOINTMENT}
            key='nav-appointment'
            className={`d-flex align-items-center nav-link${navClassesAppointments}`}
          >
            {translate('appointment')}
            {appointments.upcomingAppointments > 0 && (
              <Badge variant="danger" className={`circle text-light d-md-block${badgeClassesAppointments}`}>
                {appointments.upcomingAppointments}
              </Badge>
            )}
          </NavLink>
          {profile && profile.chat_user_id && (
            <NavLink
              to={ROUTES.CHAT_OR_CALL}
              key="nav-chat-or-call"
              className={`d-flex align-items-center nav-link${navClassesUnread}`}
            >
              {translate('chat_or_call')}
              {unreadMessage > 0 && (
                <Badge variant="danger" className={`circle text-light d-md-block${badgeClassesUnread}`}>
                  {unreadMessage}
                </Badge>
              )}
            </NavLink>
          )}

          { profile !== undefined && (
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                {translate('common.welcome')} {profile.last_name} {profile.first_name}
                <br/>
                {profile.email}
              </Dropdown.Toggle>

              <Dropdown.Menu
                alignRight={true}
              >
                <Dropdown.Item as={Link} to={ROUTES.PROFILE}>
                  {translate('profile.setting')}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={ROUTES.FAQ}>
                  {translate('profile.faq')}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={ROUTES.TC}>
                  {translate('profile.tc')}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={ROUTES.PP}>
                  {translate('profile.pp')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShow}>{translate('logout')}</Dropdown.Item>
                <Dialog
                  show={show}
                  title={translate('logout.confirmation')}
                  cancelLabel={translate('logout.cancel')}
                  onCancel={handleClose}
                  confirmLabel={translate('logout.confirm')}
                  onConfirm={handleConfirm}
                >
                  <p>{translate('logout.message')}</p>
                </Dialog>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

Navigation.propTypes = {
  translate: PropTypes.func
};

export default withRouter(Navigation);
