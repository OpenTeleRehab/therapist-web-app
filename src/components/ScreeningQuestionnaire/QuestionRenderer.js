import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { useFormContext, useController, useWatch } from 'react-hook-form';
import { Form, Row, Col, Image } from 'react-bootstrap';
import QuestionText from './QuestionText';
import { getQuestionName, evaluateLogic } from './logic';
import PropTypes from 'prop-types';

const questionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mandatory: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  question_text: PropTypes.string,
  question_type: PropTypes.string,
  logics: PropTypes.array,
  file: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    option_text: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    min_note: PropTypes.string,
    max_note: PropTypes.string,
    threshold: PropTypes.number,
    file: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  })),
});

const API_BASE_URL = process.env.REACT_APP_ADMIN_API_BASE_URL;

const getFileUrl = (file) => {
  if (!file?.id) return null;
  return `${API_BASE_URL}/file/${file.id}`;
};

const useQuestionSkipLogic = (question) => {
  const { control, unregister } = useFormContext();

  const fieldNames = useMemo(
    () =>
      question.logics?.map((l) => getQuestionName(l.target_question_id)) ?? [],
    [question.logics]
  );

  const fieldValues = useWatch({
    control,
    name: fieldNames,
  });

  // Compute skip condition
  const shouldSkip = useMemo(() => {
    if (!question.logics?.length) return false;
    return !question.logics.every((logic, index) =>
      evaluateLogic(logic, fieldValues?.[index])
    );
  }, [question.logics, fieldValues]);

  // Unregister field when skipped
  useEffect(() => {
    if (shouldSkip) {
      unregister(getQuestionName(question.id));
    }
  }, [shouldSkip, unregister, question.id]);

  return shouldSkip;
};

// --- Sub-Renderers ---

const NoteRender = ({ question }) => {
  const imageUrl = getFileUrl(question.file);
  return (
    <div className="mb-3">
      {imageUrl && (
        <div className="mb-2 text-center">
          <Image src={imageUrl} fluid className="mx-auto d-block" style={{ maxHeight: '200px' }} />
        </div>
      )}
      <QuestionText questionText={question.question_text} />
      {question.options?.[0] && (
        <div className="text-muted">{question.options[0].option_text}</div>
      )}
    </div>
  );
};

NoteRender.propTypes = {
  question: questionShape,
};

const RadioRender = ({ question, disabled, translate }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: [],
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });

  const imageUrl = getFileUrl(question.file);

  return (
    <div className="mb-3">
      {imageUrl && (
        <div className="mb-2 text-center">
          <Image src={imageUrl} fluid className="mx-auto d-block" style={{ maxHeight: '200px' }} />
        </div>
      )}
      <QuestionText
        questionText={question.question_text}
        required={question.mandatory}
      />

      <Row noGutters>
        {question.options.map((opt) => {
          const optImageUrl = getFileUrl(opt.file);
          return (
            <Col key={opt.id} md={6} className="mb-3">
              <Form.Check
                type="radio"
                id={`q-${question.id}-opt-${opt.id}`}
                label={opt.option_text}
                checked={field.value && field.value.includes(opt.id)}
                disabled={disabled}
                onChange={() => field.onChange([opt.id])} // Store as array to match RN
                isInvalid={!!error}
              />
              {optImageUrl && (
                <div
                  onClick={() => !disabled && field.onChange([opt.id])}
                  className='text-center'
                >
                  <Image src={optImageUrl} fluid style={{ maxHeight: '100px', marginTop: '5px' }} />
                </div>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

RadioRender.propTypes = {
  question: questionShape,
  disabled: PropTypes.bool,
  translate: PropTypes.func,
};

const CheckBoxRender = ({ question, disabled, translate }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: [],
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });

  const imageUrl = getFileUrl(question.file);

  return (
    <div className="mb-3">
      {imageUrl && (
        <div className="mb-2 text-center">
          <Image src={imageUrl} fluid className="mx-auto d-block" style={{ maxHeight: '200px' }} />
        </div>
      )}
      <QuestionText
        questionText={question.question_text}
        required={question.mandatory}
      />
      <Row noGutters>
        {question.options.map((opt) => {
          const isChecked = field.value?.includes(opt.id);
          const optImageUrl = getFileUrl(opt.file);

          const handleChange = () => {
            const current = field.value || [];
            if (current.includes(opt.id)) {
              field.onChange(current.filter((x) => x !== opt.id));
            } else {
              field.onChange([...current, opt.id]);
            }
          };

          return (
            <Col key={opt.id} md={6} className="mb-3">
              <Form.Check
                type="checkbox"
                id={`q-${question.id}-opt-${opt.id}`}
                label={opt.option_text}
                checked={isChecked}
                disabled={disabled}
                onChange={handleChange}
                isInvalid={!!error}
              />
              {optImageUrl && (
                <div
                  onClick={() => !disabled && handleChange()}
                  className='text-center'
                >
                  <Image src={optImageUrl} fluid style={{ maxHeight: '100px', marginTop: '5px' }} />
                </div>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

CheckBoxRender.propTypes = {
  question: questionShape,
  disabled: PropTypes.bool,
  translate: PropTypes.func,
};

const InputTextRender = ({ question, disabled, translate }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: '',
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });

  const imageUrl = getFileUrl(question.file);

  return (
    <div className="mb-3">
      {imageUrl && (
        <div className="mb-2 text-center">
          <Image src={imageUrl} fluid className="mx-auto d-block" style={{ maxHeight: '200px' }} />
        </div>
      )}
      <QuestionText
        questionText={question.question_text}
        required={question.mandatory}
      />
      <Form.Control
        as="textarea"
        value={field.value}
        rows={2}
        disabled={disabled}
        onChange={field.onChange}
        isInvalid={!!error}
      />
    </div>
  );
};

InputTextRender.propTypes = {
  question: questionShape,
  disabled: PropTypes.bool,
  translate: PropTypes.func,
};

const InputNumberRender = ({ question, disabled, translate }) => {
  const option = question.options?.[0];
  const {
    field,
    fieldState: { error },
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: '',
    rules: {
      required: question.mandatory && translate('error.message.required'),
      max: option?.threshold && {
        value: option.threshold,
        message: translate('error.message.max_number', {
          number: option.threshold,
        }),
      },
    },
  });

  const imageUrl = getFileUrl(question.file);

  return (
    <div className="mb-3">
      {imageUrl && (
        <div className="mb-2 text-center">
          <Image src={imageUrl} fluid className="mx-auto d-block" style={{ maxHeight: '200px' }} />
        </div>
      )}
      <QuestionText
        questionText={question.question_text}
        required={question.mandatory}
      />
      <Form.Control
        type="number"
        value={field.value}
        disabled={disabled}
        onChange={field.onChange}
        isInvalid={!!error}
      />
    </div>
  );
};

InputNumberRender.propTypes = {
  question: questionShape,
  disabled: PropTypes.bool,
  translate: PropTypes.func,
};

const SliderRender = ({ question, disabled, translate }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: question.options[0].min, // Default to min value if null? Logic says null in RN but slider needs value
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });

  // Ensure value is numeric for slider
  const currentValue = field.value !== null && field.value !== undefined ? field.value : question.options[0].min;

  const imageUrl = getFileUrl(question.file);

  return (
    <div className="mb-3">
      {imageUrl && (
        <div className="mb-2 text-center">
          <Image src={imageUrl} fluid className="mx-auto d-block" style={{ maxHeight: '200px' }} />
        </div>
      )}
      <QuestionText
        questionText={question.question_text}
        required={question.mandatory}
      />
      <div>Value: {currentValue}</div>
      <Form.Control
        type="range"
        value={currentValue}
        onChange={(e) => field.onChange(Number(e.target.value))}
        min={question.options[0].min}
        max={question.options[0].max}
        step={1}
        disabled={disabled}
      />
      <div className="d-flex justify-content-between text-muted small">
        <span>{question.options[0].min} - {question.options[0].min_note}</span>
        <span>{question.options[0].max} - {question.options[0].max_note}</span>
      </div>
    </div>
  );
};

SliderRender.propTypes = {
  question: questionShape,
  disabled: PropTypes.bool,
  translate: PropTypes.func,
};

const componentMap = {
  note: NoteRender,
  radio: RadioRender,
  'open-text': InputTextRender,
  'open-number': InputNumberRender,
  rating: SliderRender,
  checkbox: CheckBoxRender,
};

const QuestionRenderer = ({ question, disabled }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const shouldSkip = useQuestionSkipLogic(question);

  if (shouldSkip) return null;

  const Component = componentMap[question.question_type] ?? null;

  return Component ? (
    <Component disabled={disabled} question={question} translate={translate} />
  ) : null;
};

QuestionRenderer.propTypes = {
  question: questionShape.isRequired,
  disabled: PropTypes.bool,
};

export default QuestionRenderer;
