import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const SplashScreen = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <img
        src={'/images/logo-horizontal.svg'}
        alt='OpenTeleRehab Logo'
        width={200}
      />
      <Spinner className="mt-3" animation="border" variant="primary" />
    </div>
  );
};

export default SplashScreen;
