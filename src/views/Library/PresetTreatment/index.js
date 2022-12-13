import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import CustomTable from 'components/Table';
import { getPresetTreatmentPlans } from 'store/treatmentPlan/actions';
import * as ROUTES from 'variables/routes';
import customColorScheme from '../../../utils/customColorScheme';

const PresetTreatment = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { profile } = useSelector((state) => state.auth);
  const { presetTreatmentPlans, loading } = useSelector(state => state.treatmentPlan);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const columns = [
    { name: 'name', title: translate('treatment_plan.preset.name') },
    { name: 'total_of_weeks', title: translate('common.duration') }
  ];

  useEffect(() => {
    if (profile !== undefined) {
      dispatch(getPresetTreatmentPlans({
        filters,
        type: 'preset',
        search_value: searchValue,
        page_size: pageSize,
        page: currentPage + 1
      }));
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile]);

  const handleRowClick = (row) => {
    history.push(ROUTES.LIBRARY_TREATMENT_PLAN_DETAIL.replace(':id', row.id));
  };

  return (
    <>
      <CustomTable
        loading={loading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        onRowClick={handleRowClick}
        rows={presetTreatmentPlans.map(treatmentPlan => {
          const numberOfWeeks = treatmentPlan.total_of_weeks;
          return {
            id: treatmentPlan.id,
            name: treatmentPlan.name,
            total_of_weeks: `${numberOfWeeks} ${translate(numberOfWeeks > 1 ? 'common.weeks' : 'common.week')}`
          };
        })}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

PresetTreatment.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(PresetTreatment);
