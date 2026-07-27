'use client';

import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

/**
 * Wraps a native form control (input/select/textarea) to add:
 * - a visible required-field marker next to the label
 * - `aria-invalid` + `aria-describedby` wired to an inline error message,
 *   populated from the browser's own validation message on an invalid submit
 *   attempt, and cleared as soon as the field becomes valid again.
 *
 * The child control must accept `id`, `aria-invalid`, and `aria-describedby`
 * props via `React.cloneElement`-style injection, so this takes a render
 * function rather than a plain child.
 */
interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: (fieldProps: {
    id: string;
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
    onInvalid: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onInput: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  }) => ReactNode;
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
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
        onInvalid: (e) => {
          setError(e.currentTarget.validationMessage || 'This field is invalid.');
        },
        onInput: (e) => {
          if (e.currentTarget.validity.valid) {
            setError(null);
          }
        },
      })}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
