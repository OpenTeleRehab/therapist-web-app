import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <>
      <div className="loading-shading">
        <Spinner className="loading-icon" animation="border" variant="primary"/>
      </div>
    </>
  );
};

Loading.propTypes = {

};

Loading.defaultProps = {

};

export default Loading;
