interface FieldErrorProps {
  message?: string;
  id?: string;
}

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      <span aria-hidden="true">⚠</span> {message}
    </p>
  );
}
