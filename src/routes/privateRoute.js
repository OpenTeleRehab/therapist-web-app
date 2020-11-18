import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useKeycloak } from '@react-keycloak/web';

const PrivateRoute = ({ children, title, ...rest }) => {
  const { keycloak } = useKeycloak();

  return (
    <Route
      {...rest}
      render={() => {
        if (keycloak.authenticated === false) {
          console.log(keycloak.authenticated);
          keycloak.login();
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
