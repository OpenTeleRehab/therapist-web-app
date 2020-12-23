import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { BiChevronLeftCircle } from 'react-icons/bi';

import ListExerciseCard from 'views/TreatmentPlan/Activity/Exercise/listCard';

const PreviewExerciseList = ({ selectedExercises, onSectionChange }) => {
  const [isShow, setIsShow] = useState(false);

  const handleShow = () => {
    const test = !isShow;
    setIsShow(test);
  };

  return (
    <>
      <div className="position-absolute p-2 show-select-exercise-button">
        <BiChevronLeftCircle size={25} onClick={handleShow}/>
      </div>
      { isShow &&
        <div className="position-absolute w-25 selected-exercise-wrapper">
          <ListExerciseCard exerciseIds={selectedExercises} onSectionChange={onSectionChange} />
        </div>
      }
    </>
  );
};

PreviewExerciseList.propTypes = {
  translate: PropTypes.func,
  selectedExercises: PropTypes.array,
  onSectionChange: PropTypes.func
};

export default withLocalize(PreviewExerciseList);
