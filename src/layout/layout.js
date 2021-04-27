import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import Navigation from 'layout/navigation';
import ToastNotification from 'components/ToastNotification';
import SpinnerOverlay from 'components/SpinnerOverlay';
import { getLayoutDirection } from '../utils/layoutDirection';

const Layout = ({ component: Component, title }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { profile } = useSelector((state) => state.auth);
  const languages = useSelector(state => state.language.languages);

  // set page title and body layout direction
  useEffect(() => {
    document.title = `${translate(title)} - ${process.env.REACT_APP_SITE_TITLE}`;
    document.body.dir = getLayoutDirection(profile.language_id, languages);
  });

  return (
    <>
      <Navigation translate={translate} />
      <main role="main" className="pt-3">
        <Container fluid>
          <Component translate={translate} />
        </Container>
      </main>

      <ToastNotification />
      <SpinnerOverlay />
    </>
  );
};

Layout.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  title: PropTypes.string
};

export default Layout;
