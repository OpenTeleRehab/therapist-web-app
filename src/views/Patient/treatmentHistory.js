import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import CustomTable from 'components/Table';
import { EditAction, ViewAction } from 'components/ActionIcons';
import { getTreatmentPlans } from 'store/treatmentPlan/actions';
import * as ROUTES from 'variables/routes';
import { STATUS } from 'variables/treatmentPlan';

let timer = null;
const TreatmentHistory = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { patientId } = useParams();
  const treatmentPlans = useSelector(state => state.treatmentPlan.treatmentPlans);

  const columns = [
    { name: 'name', title: translate('common.treatment_name') },
    { name: 'treatment_status', title: translate('common.status') },
    { name: 'start_date', title: translate('common.start_date') },
    { name: 'end_date', title: translate('common.end_date') },
    { name: 'action', title: translate('common.action') }
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
    if (patientId) {
      clearTimeout(timer);
      timer = setTimeout(() => {
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
      }, 500);
    }
  }, [currentPage, pageSize, searchValue, filters, patientId, dispatch]);

  const handleEdit = (id) => {
    history.push(ROUTES.TREATMENT_PLAN_EDIT.replace(':patientId', patientId).replace(':id', id));
  };

  return (
    <div className="mt-3">
      <h5>
        {translate('treatment_plan.treatment_history')}
      </h5>
      <CustomTable
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
        rows={treatmentPlans.map(treatmentPlan => {
          const action = (
            <>
              <ViewAction disabled />
              <EditAction className="ml-1" onClick={() => handleEdit(treatmentPlan.id)} />
            </>
          );

          return {
            name: treatmentPlan.name,
            treatment_status: treatmentPlan.status === STATUS.planned
              ? (
                <Badge pill
                  variant="info"
                >
                  {translate('common.planned')}
                </Badge>
              )
              : (
                <Badge pill
                  variant={treatmentPlan.status === STATUS.finished ? 'danger' : 'primary'}
                >
                  {translate('common.' + treatmentPlan.status)}
                </Badge>
              ),
            start_date: treatmentPlan.start_date,
            end_date: treatmentPlan.end_date,
            action
          };
        })}
      />
    </div>
  );
};

export default TreatmentHistory;
