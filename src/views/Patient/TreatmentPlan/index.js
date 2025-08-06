import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import CustomTable from 'components/Table';
import { getTreatmentPlans } from 'store/treatmentPlan/actions';
import * as ROUTES from 'variables/routes';
import CreateButton from 'views/Patient/Partials/createButton';
import { renderStatusBadge } from 'utils/treatmentPlan';
import BackButton from '../Partials/backButton';

const TreatmentHistory = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { patientId } = useParams();
  const { treatmentPlans, loading } = useSelector(state => state.treatmentPlan);
  const { profile } = useSelector((state) => state.auth);
  const { countries } = useSelector((state) => state.country);

  const columns = [
    { name: 'name', title: translate('common.treatment_name') },
    { name: 'treatment_status', title: translate('common.status') },
    { name: 'start_date', title: translate('common.start_date') },
    { name: 'end_date', title: translate('common.end_date') }
  ];
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const columnExtensions = [
    { columnName: 'name', wordWrapEnabled: true }
  ];

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (patientId && profile && countries.length) {
      dispatch(getTreatmentPlans({
        patient_id: patientId,
        search_value: searchValue,
        filters: filters,
        page_size: pageSize,
        page: currentPage + 1
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }
  }, [currentPage, pageSize, searchValue, filters, patientId, dispatch, countries, profile]);

  const handleRowClick = (row) => {
    history.push(ROUTES.VIEW_TREATMENT_PLAN_DETAIL.replace(':patientId', patientId).replace(':id', row.id));
  };

  return (
    <>
      <div className="mt-4 d-flex">
        <h5>
          {translate('treatment_plan.treatment_history')}
        </h5>
        <BackButton />
        <CreateButton />
      </div>
      <div className="mt-3">
        <CustomTable
          loading={loading}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
          setSearchValue={setSearchValue}
          setFilters={setFilters}
          filters={filters}
          columns={columns}
          columnExtensions={columnExtensions}
          onRowClick={handleRowClick}
          hover="hover-primary"
          rows={treatmentPlans.map(treatmentPlan => {
            return {
              id: treatmentPlan.id,
              name: treatmentPlan.name,
              treatment_status: renderStatusBadge(treatmentPlan),
              start_date: treatmentPlan.start_date,
              end_date: treatmentPlan.end_date
            };
          })}
        />
      </div>
    </>
  );
};

export default TreatmentHistory;
