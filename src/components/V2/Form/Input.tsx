import React from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type InputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: any;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  as?: React.ElementType;
  controlAs?: React.ElementType;
  rows?: number;
  label?: string;
} & Omit<FormControlProps, 'name'>;

const Input = <T extends FieldValues>({
  control,
  name,
  rules,
  as,
  label,
  controlAs,
  rows,
  ...props
}: InputProps<T>) => {
  const sanitizedControlId = name.replace(/\./g, '_');

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Group as={as} controlId={sanitizedControlId}>
          {label && (
            <Form.Label>
              {label}
              {rules?.required && <span className="text-dark ml-1">*</span>}
            </Form.Label>
          )}
          <Form.Control
            {...props}
            {...field}
            rows={rows}
            as={controlAs}
            isInvalid={!!fieldState.error}
          />

          {fieldState.error && (
            <Form.Control.Feedback type="invalid">
              {fieldState.error.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}
    />
  );
};

export default Input;
