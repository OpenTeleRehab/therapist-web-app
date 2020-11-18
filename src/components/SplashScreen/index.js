import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const SplashScreen = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <img
        src={'/images/logo-horizontal.svg'}
        alt='HI Logo'
        width={100}
      />
      <Spinner className="mt-3" animation="border" variant="primary" />
    </div>
  );
};

export default SplashScreen;
