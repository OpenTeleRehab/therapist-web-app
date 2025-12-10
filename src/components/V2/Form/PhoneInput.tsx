import React from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import ReactPhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';
import { getCountryIsoCode } from 'utils/country';

type InputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: any;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  as?: React.ElementType;
  label?: string;
  setValue: (name: string, value: any) => void;
} & Omit<FormControlProps, 'name'>;

const Input = <T extends FieldValues>({
  control,
  name,
  rules,
  as,
  label,
  setValue
}: InputProps<T>) => {
  const sanitizedControlId = name.replace(/\./g, '_');
  const definedCountries = useSelector((state: any) => state.country.definedCountries);

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
              {rules && rules.required && <span className="text-dark ml-1">*</span>}
            </Form.Label>
          )}

          <ReactPhoneInput
            inputProps={{
              id: sanitizedControlId,
              name,
              required: !!(rules && rules.required)
            }}
            countryCodeEditable={false}
            country={getCountryIsoCode().toLowerCase()}
            specialLabel=""
            onlyCountries={definedCountries.map((country: any) => country.iso_code.toLowerCase())}
            value={field.value ?? undefined}
            onChange={(value, country: any) => {
              setValue('dial_code', country.dialCode);
              field.onChange(value);
            }}
            containerClass={`react-tel-input ${fieldState.error ? 'react-tel-input-invalid' : ''}`}
            inputClass={`form-control ${fieldState.error ? 'is-invalid' : ''}`}
          />

          {fieldState.error && (
            <div className="invalid-feedback d-block">
              {fieldState.error.message}
            </div>
          )}
        </Form.Group>
      )}
    />
  );
};

export default Input;
