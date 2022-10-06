import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishPrivacyPolicy } from 'store/privacyPolicy/actions';
import PropTypes from 'prop-types';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';
import GoogleTranslationAttribute from '../../components/GoogleTranslationAttribute';

const PrivacyPolicyPage = ({ translate }) => {
  const dispatch = useDispatch();
  const { publishPrivacyPolicy } = useSelector(state => state.privacyPolicy);
  const { profile } = useSelector(state => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);

  useEffect(() => {
    dispatch(getPublishPrivacyPolicy({ lang: profile.language_id }));
  }, [dispatch, profile]);

  return (
    <>
      <h2>{translate('profile.pp')}</h2>
      {publishPrivacyPolicy &&
        <div className="page-wrapper">
          <div className="p-3 flex-grow-1" dangerouslySetInnerHTML={{ __html: publishPrivacyPolicy.content }} />
        </div>
      }
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
      { publishPrivacyPolicy.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </>
  );
};

PrivacyPolicyPage.propTypes = {
  translate: PropTypes.func
};

export default PrivacyPolicyPage;
