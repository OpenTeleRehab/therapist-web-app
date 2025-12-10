import React from 'react';
import ReactSelect, { Props as ReactSelectProps, SingleValue } from 'react-select';
import { Form } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export type OptionType<TValue, TExtra = any> = {
  label: string;
  value: TValue;
} & TExtra;

export type SelectProps<
  TFieldValues extends FieldValues,
  TValue = any,
  TExtra = any
> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  > | undefined;
  label?: string;
  options: OptionType<TValue, TExtra>[];
  as?: React.ElementType;
  isMulti?: boolean;
  getOptionLabel?: (opt: OptionType<TValue, TExtra>) => string;
  getOptionValue?: (opt: OptionType<TValue, TExtra>) => TValue;
} & Omit<ReactSelectProps<OptionType<TValue, TExtra>>, 'options' | 'value' | 'onChange' | 'isMulti'>;

const Select = <
  TFieldValues extends FieldValues,
  TValue = any,
  TExtra = any
>({
  control,
  name,
  rules,
  label,
  options,
  as,
  isMulti = false,
  getOptionLabel = (opt) => opt.label,
  getOptionValue = (opt: any) => opt.value,
  ...props
}: SelectProps<TFieldValues, TValue, TExtra>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const selectedValue = isMulti
          ? options.filter(opt =>
              Array.isArray(field.value)
                ? field.value.some((val: any) => val === getOptionValue(opt))
                : false
            )
          : options.find(opt => getOptionValue(opt) === field.value) || null;

        const sanitizedControlId = name.replace(/\./g, '_');

        return (
          <Form.Group as={as} controlId={sanitizedControlId}>
            {label && (
              <Form.Label>
                {label}
                {rules?.required && <span className="text-dark ml-1">*</span>}
              </Form.Label>
            )}

            <ReactSelect
              {...props}
              isMulti={isMulti}
              inputId={sanitizedControlId}
              options={options}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              value={selectedValue as any}
              onChange={(val) => {
                if (isMulti) {
                  field.onChange(val ? (val as OptionType<TValue, TExtra>[]).map(v => getOptionValue(v)) : []);
                } else {
                  field.onChange(val ? (val as SingleValue<OptionType<TValue, TExtra>>)?.value : null);
                }
              }}
              onBlur={field.onBlur}
              classNamePrefix="select"
              className={fieldState.error ? 'is-invalid' : ''}
            />

            {fieldState.error && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {fieldState.error.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        );
      }}
    />
  );
};

export default Select;
