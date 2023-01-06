import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

const useTranslate = () => {
  const localize = useSelector(state => state.localize);

  return getTranslate(localize);
};

export default useTranslate;
