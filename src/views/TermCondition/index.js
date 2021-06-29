import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishTermCondition } from 'store/termAndCondition/actions';

import PropTypes from 'prop-types';
const TermConditionPage = ({ translate }) => {
  const dispatch = useDispatch();
  const { publishTermAndConditionPage } = useSelector(state => state.termAndCondition);
  const { profile } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getPublishTermCondition({ lang: profile.language_id }));
  }, [dispatch, profile]);

  return (
    <>
      <h2>{translate('profile.tc')}</h2>
      {publishTermAndConditionPage &&
        <div className="page-wrapper">
          <div className="p-3 flex-grow-1" dangerouslySetInnerHTML={{ __html: publishTermAndConditionPage.content }} />
        </div>
      }
    </>
  );
};

TermConditionPage.propTypes = {
  translate: PropTypes.func
};

export default TermConditionPage;
