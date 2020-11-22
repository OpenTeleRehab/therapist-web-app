import React from 'react';
import { Button } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Information = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { profile } = useSelector((state) => state.auth);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className="mt-4">
      { profile !== undefined && (
        <>
          <h1>{profile.last_name} {profile.first_name}</h1>
          <p>{profile.email}</p>
          <p>TODO: disply clinic name: {profile.clinic_id}</p>
          <p>TODO: disply country name: {profile.country_id}</p>

          <div>
            <Button disabled>
              {translate('common.edit')}
            </Button>
            <Button
              className="ml-2"
              variant="outline-dark"
              onClick={handleBack}
            >
              {translate('common.back')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Information;
