/**
 * Shows one task with controls for completion, editing, and deletion.
 */
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <li className={`task-card${task.completed ? ' is-complete' : ''}`}>
      <button
        className="completion-toggle"
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Mark ${task.name} as active` : `Complete ${task.name}`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>
      <div className="task-content">
        <button className="task-name" type="button" onClick={() => onEdit(task)}>
          {task.name}
        </button>
        <p className="task-description">{task.description}</p>
      </div>
      <div className="task-actions">
        <button
          className="icon-button"
          type="button"
          aria-label={`Edit ${task.name}`}
          title="Edit task"
          onClick={() => onEdit(task)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 5 4 4M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" />
          </svg>
        </button>
        <button
          className="icon-button delete-button"
          type="button"
          aria-label={`Delete ${task.name}`}
          title="Delete task"
          onClick={() => onDelete(task)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </svg>
        </button>
      </div>
    </li>
  );
}
