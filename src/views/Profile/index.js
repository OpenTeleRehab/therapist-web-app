import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import Information from 'views/Profile/Information';
import Editing from 'views/Profile/Editing';
import Password from 'views/Profile/Password';
import * as ROUTES from 'variables/routes';

const VIEW_PROFILE = 'info';
const VIEW_EDIT = 'edit';
const VIEW_PASSWORD = 'password';

const Profile = ({ translate }) => {
  const { hash } = useLocation();
  const [view, setView] = useState(VIEW_PROFILE);
  const [tab, setTab] = useState(VIEW_PROFILE);

  useEffect(() => {
    if (hash.includes('#edit')) {
      setView(VIEW_EDIT);
      setTab(VIEW_PROFILE);
    } else if (hash.includes('#password')) {
      setView(VIEW_PASSWORD);
      setTab(VIEW_PASSWORD);
    } else {
      setView(VIEW_PROFILE);
      setTab(VIEW_PROFILE);
    }
  }, [hash]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('profile.personal')}</h1>
      </div>

      <Nav variant="tabs" activeKey={tab}>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.PROFILE} eventKey={VIEW_PROFILE}>
            {translate('profile.information')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.PROFILE_PASSWORD} eventKey={VIEW_PASSWORD}>
            {translate('profile.password')}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      { view === VIEW_PROFILE && <Information /> }
      { view === VIEW_EDIT && <Editing /> }
      { view === VIEW_PASSWORD && <Password /> }
    </>
  );
};

Profile.propTypes = {
  translate: PropTypes.func
};

export default Profile;
