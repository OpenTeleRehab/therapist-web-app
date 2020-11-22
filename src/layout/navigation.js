import React, { useState } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import * as ROUTES from 'variables/routes';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from 'store/auth/actions';

const Navigation = ({ translate }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const [show, setShow] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const { profile } = useSelector((state) => state.auth);

  if (!isProfileLoaded && keycloak.authenticated) {
    dispatch(getProfile());
    setIsProfileLoaded(true);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = () => {
    if (keycloak.authenticated) {
      keycloak.logout();
    }
  };

  return (
    <Navbar bg="secondary" variant="dark" expand="xl" sticky="top" className="main-nav">
      <Navbar.Brand>
        <Link to={ROUTES.DASHBOARD}>
          <img
            src="/images/logo.png"
            className="d-inline-block align-top"
            alt="Handicap International logo"
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
            key='nav-dashboard'
            className="nav-link"
          >
            {translate('dashboard')}
          </NavLink>

          { profile !== undefined && (
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                {translate('common.welcome')} {profile.last_name} {profile.first_name}
                <br/>
                {profile.email}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Update profile</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Change password</Dropdown.Item>
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
