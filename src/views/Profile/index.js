import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Information from 'views/Profile/Information';
import Password from 'views/Profile/Password';

const Profile = ({ translate }) => {
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('profile.personal')}</h1>
      </div>

      <Tabs transition={false}>
        <Tab eventKey="information" title={translate('profile.information')}>
          <Information />
        </Tab>
        <Tab eventKey="password" title={translate('profile.passwords')}>
          <Password />
        </Tab>
      </Tabs>
    </>
  );
};

Profile.propTypes = {
  translate: PropTypes.func
};

export default Profile;
