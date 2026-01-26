
export const getQuestionName = (id) => {
  return `question_${id}`;
};

export const evaluateLogic = (logic, targetValue) => {
  const isArray = Array.isArray(targetValue);
  const hasValue = isArray
    ? targetValue.length > 0
    : targetValue != null && targetValue !== '';

  switch (logic.condition_rule) {
    case 'equal':
      return isArray
        ? targetValue.includes(logic.target_option_id)
        : targetValue === logic.target_option_value;

    case 'not_equal':
      return isArray
        ? !targetValue.includes(logic.target_option_id)
        : targetValue !== logic.target_option_value;

    case 'was_answered':
      return hasValue;

    case 'was_not_answered':
      return !hasValue;

    default:
      return false;
  }
};
