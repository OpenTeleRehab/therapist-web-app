import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import * as ROUTES from 'variables/routes';

const PrivateRoute = ({ children, title, ...rest }) => {
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const profile = useSelector((state) => state.auth.profile);

  return (
    <Route
      {...rest}
      render={() => {
        const { exact, path } = rest;
        if (keycloak.authenticated === false) {
          console.log(keycloak.authenticated);
          keycloak.login();
          return;
        } else if (exact && path === ROUTES.CHAT_OR_CALL && !profile.chat_user_id) {
          history.push(ROUTES.DASHBOARD);
          return;
        }
        return children;
      }
      }
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  location: PropTypes.object,
  title: PropTypes.string
};

export default PrivateRoute;
