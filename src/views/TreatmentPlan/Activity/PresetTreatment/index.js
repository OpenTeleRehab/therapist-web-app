import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable from 'components/Table';
import { getPresetTreatmentPlans } from 'store/treatmentPlan/actions';
import Dialog from '../../../../components/Dialog';
import ViewTreatmentPlan from './detail';
import { Form } from 'react-bootstrap';

let timer = null;
const PresetTreatment = ({ translate, presetId, onSectionChange, setViewPreset, viewPreset }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { presetTreatmentPlans } = useSelector(state => state.treatmentPlan);

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState('');

  const columns = [
    { name: 'selection', title: 'Selection' },
    { name: 'name', title: translate('treatment_plan.preset.name') },
    { name: 'total_of_weeks', title: translate('common.duration') }
  ];

  const columnExtensions = [
    { columnName: 'selection', align: 'center', width: 50 }
  ];

  useEffect(() => {
    if (profile !== undefined) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(getPresetTreatmentPlans({
          filters,
          type: 'preset',
          search_value: searchValue,
          page_size: pageSize,
          page: currentPage + 1
        }));
      }, 500);
    }
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile]);

  const handleRowClick = (row) => {
    setViewPreset(true);
    setId(row.id);
    setName(row.name);
  };

  const handleViewClose = () => {
    setViewPreset(false);
  };

  return (
    <>
      <div className={'indent-first-heading'}>
        <CustomTable
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setSearchValue={setSearchValue}
          setFilters={setFilters}
          filters={filters}
          columns={columns}
          columnExtensions={columnExtensions}
          onRowClick={handleRowClick}
          rows={presetTreatmentPlans.map(treatmentPlan => {
            const numberOfWeeks = treatmentPlan.total_of_weeks;
            const action = (
              <Form.Check
                type="checkbox"
                checked={presetId === treatmentPlan.id}
                onChange={(e) => onSectionChange(e.currentTarget.checked, treatmentPlan.id)}
                name={`preset-${treatmentPlan.id}`}
                aria-label="checkbox"
              />
            );
            return {
              id: treatmentPlan.id,
              selection: action,
              name: treatmentPlan.name,
              total_of_weeks: `${numberOfWeeks} ${translate(numberOfWeeks > 1 ? 'common.weeks' : 'common.week')}`
            };
          })}
        />
        {viewPreset &&
        <Dialog
          show={viewPreset}
          title={name}
          cancelLabel={translate('common.close')}
          onCancel={handleViewClose}
          size="xl"
        >
          <ViewTreatmentPlan id={id}/>
        </Dialog>
        }
      </div>
    </>
  );
};

PresetTreatment.propTypes = {
  translate: PropTypes.func,
  presetId: PropTypes.number,
  onSectionChange: PropTypes.func,
  viewPreset: PropTypes.bool,
  setViewPreset: PropTypes.func
};

export default withLocalize(PresetTreatment);
