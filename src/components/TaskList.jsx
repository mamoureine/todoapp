import TaskItem from './TaskItem.jsx';

/**
 * Displays tasks or a helpful empty state for the current filter.
 */
export default function TaskList({ tasks, filter, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    const emptyMessage =
      filter === 'completed'
        ? 'Finished tasks will show up here.'
        : filter === 'active'
          ? 'You have no active tasks. Enjoy the breathing room.'
          : 'Your list is a blank page. Add one small thing to get started.';

    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">✦</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
