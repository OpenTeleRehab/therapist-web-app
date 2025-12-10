import { Form, FormCheckProps } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type OptionType<T> = {
  label: string;
  value: T;
};

type RadioProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  label?: string;
  options: OptionType<T>[];
} & Omit<FormCheckProps, 'name'>;

const Radio = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  options = [],
  ...props
}: RadioProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const sanitizedControlId = name.replace(/\./g, '_');

        return (
          <Form.Group controlId={sanitizedControlId}>
            {label && (
              <Form.Label>
                {label}
                {rules && rules.required && <span className="text-dark ml-1">*</span>}
              </Form.Label>
            )}

            {options.map((opt, index) => {
              const optionId = `${sanitizedControlId}_${index}`;

              return (
                <Form.Check
                  key={index}
                  {...props}
                  id={optionId}
                  label={opt.label}
                  name={name}
                  type="radio"
                  value={opt.value as any}
                  checked={field.value === opt.value}
                  onChange={() => field.onChange(opt.value)}
                  isInvalid={!!fieldState.error}
                />
              );
            })}

            {fieldState.error && (
              <Form.Control.Feedback type="invalid">
                {fieldState.error.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        );
      }}
    />
  );
};

export default Radio;
