import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import {
  DeleteAction,
  EditAction,
  ViewAction
} from 'components/ActionIcons';
import CustomTable from 'components/Table';
import { getTreatmentPlans } from 'store/treatmentPlan/actions';

let timer = null;
const PresetTreatment = ({ translate }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { treatmentPlans } = useSelector(state => state.treatmentPlan);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const columns = [
    { name: 'name', title: translate('treatment_plan.name') },
    { name: 'description', title: translate('common.description') },
    { name: 'total_of_weeks', title: translate('common.duration') },
    { name: 'action', title: translate('common.action') }
  ];

  useEffect(() => {
    if (profile !== undefined) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(getTreatmentPlans({
          filters,
          type: 'preset',
          search_value: searchValue,
          page_size: pageSize,
          page: currentPage + 1
        }));
      }, 500);
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile]);

  return (
    <CustomTable
      pageSize={pageSize}
      setPageSize={setPageSize}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      setSearchValue={setSearchValue}
      setFilters={setFilters}
      filters={filters}
      columns={columns}
      rows={treatmentPlans.map(treatmentPlan => {
        const action = (
          <>
            <ViewAction className="ml-1" />
            <EditAction className="ml-1" />
            <DeleteAction className="ml-1" disabled />
          </>
        );
        const numberOfWeeks = treatmentPlan.total_of_weeks;
        return {
          name: treatmentPlan.name,
          description: treatmentPlan.description,
          total_of_weeks: `${numberOfWeeks} ${translate(numberOfWeeks > 1 ? 'common.weeks' : 'common.week')}`,
          action
        };
      })}
    />
  );
};

PresetTreatment.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(PresetTreatment);
