'use client';

import { cloneElement, isValidElement, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';

/**
 * Wraps a native form control (input/select/textarea) to add:
 * - a visible required-field marker next to the label
 * - `aria-invalid` + `aria-describedby` wired to an inline error message,
 *   populated from the browser's own validation message on an invalid submit
 *   attempt, and cleared as soon as the field becomes valid again.
 *
 * Takes the field as a single JSX element child (a plain, serializable
 * React element — safe to pass from a Server Component) and clones it with
 * the extra props injected client-side, rather than taking a render-prop
 * function (which cannot cross the server/client boundary).
 */
type FieldElement = ReactElement<{
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  onInvalid?: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onInput?: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}>;

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: FieldElement;
  className?: string;
  labelClassName?: string;
}

export function FormField({
  id,
  label,
  required = false,
  children,
  className,
  labelClassName = 'mb-2 block text-sm font-medium text-ink',
}: FormFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const errorId = `${id}-error`;

  const field = isValidElement(children)
    ? cloneElement(children as FieldElement, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
        onInvalid: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          setError(e.currentTarget.validationMessage || 'This field is invalid.');
        },
        onInput: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          if (e.currentTarget.validity.valid) {
            setError(null);
          }
        },
      })
    : children;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {field}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
