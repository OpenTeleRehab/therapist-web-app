import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';

const SpinnerOverlay = () => {
  const showSpinner = useSelector(state => state.spinnerOverlay.showSpinner);

  return (
    <>
      {showSpinner && (
        <div className="loading-shading">
          <Spinner animation="border" variant="primary"/>
        </div>
      )}
    </>
  );
};

export default SpinnerOverlay;
