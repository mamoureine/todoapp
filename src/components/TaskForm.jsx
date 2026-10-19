import { useEffect, useState } from 'react';

const EMPTY_VALUES = { name: '', description: '' };

/**
 * Renders the shared add/edit form and validates both required text fields.
 */
export default function TaskForm({
  initialValues = EMPTY_VALUES,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setErrors({});
  }, [initialValues]);

  /** Validates the inputs and submits trimmed task details when valid. */
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Enter a task name.';
    if (!description.trim()) nextErrors.description = 'Enter a short description.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ name: name.trim(), description: description.trim() });
      if (!onCancel) {
        setName('');
        setDescription('');
      }
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={onCancel ? 'edit-task-name' : 'new-task-name'}>Task name</label>
        <input
          id={onCancel ? 'edit-task-name' : 'new-task-name'}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Plan the week"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'task-name-error' : undefined}
          maxLength={100}
        />
        {errors.name && <span className="field-error" id="task-name-error">{errors.name}</span>}
      </div>
      <div className="form-field">
        <label htmlFor={onCancel ? 'edit-task-description' : 'new-task-description'}>Description</label>
        <textarea
          id={onCancel ? 'edit-task-description' : 'new-task-description'}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a few details to help you get started..."
          rows="3"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'task-description-error' : undefined}
          maxLength={500}
        />
        {errors.description && (
          <span className="field-error" id="task-description-error">{errors.description}</span>
        )}
      </div>
      <div className="form-actions">
        {onCancel && (
          <button className="button button-quiet" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="button button-primary" type="submit">
          <span aria-hidden="true">{onCancel ? '✓' : '+'}</span> {submitLabel}
        </button>
      </div>
    </form>
  );
}
