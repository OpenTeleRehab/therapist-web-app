import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { DropdownButton, Dropdown, Badge } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import CustomTable from 'components/Table';
import { getTreatmentPlans } from '../../store/treatmentPlan/actions';
import * as ROUTES from '../../variables/routes';
import { STATUS } from '../../variables/treatmentPlan';

let timer = null;
const TreatmentHistory = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { patientId } = useParams();
  const treatmentPlans = useSelector(state => state.treatmentPlan.treatmentPlans);

  const columns = [
    { name: 'name', title: 'Treatment Name' },
    { name: 'treatment_status', title: 'Status' },
    { name: 'start_date', title: 'Start Date' },
    { name: 'end_date', title: 'End Date' },
    { name: 'action', title: 'Actions' }
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
      if (searchValue || filters.length) {
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
      } else {
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
    }
  }, [currentPage, pageSize, searchValue, filters, patientId, dispatch]);

  const handleEdit = (id) => {
    history.push(ROUTES.TREATMENT_PLAN_EDIT.replace(':patientId', patientId).replace(':id', id));
  };

  return (
    <div className="mt-3">
      <h5>
        Treatment History
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
          const dropdown = (
            <DropdownButton alignRight variant="outline-dark" title={translate('common.actions')}>
              <Dropdown.Item onClick={() => handleEdit(treatmentPlan.id)}>{translate('treatment_plan.edit_treatment_info')}</Dropdown.Item>
              <Dropdown.Item href="#">{translate('treatment_plan.view_treatment_detail')}</Dropdown.Item>
            </DropdownButton>
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
            action: dropdown
          };
        })}
      />
    </div>
  );
};

export default TreatmentHistory;
