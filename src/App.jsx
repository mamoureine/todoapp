import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

const STORAGE_KEY = 'daymark.tasks';
const FILTERS = ['all', 'active', 'completed'];

/**
 * Reads and validates saved tasks, reporting storage or data errors to the app.
 */
function readStoredTasks() {
  try {
    const savedTasks = window.localStorage.getItem(STORAGE_KEY);
    if (savedTasks === null) {
      return { tasks: [], error: '' };
    }

    const parsedTasks = JSON.parse(savedTasks);
    const isValid =
      Array.isArray(parsedTasks) &&
      parsedTasks.every(
        (task) =>
          task &&
          typeof task.id === 'string' &&
          typeof task.name === 'string' &&
          typeof task.description === 'string' &&
          typeof task.completed === 'boolean',
      );

    if (!isValid) {
      return {
        tasks: [],
        error: 'Saved tasks could not be read. Your existing browser data was left unchanged.',
      };
    }

    return { tasks: parsedTasks, error: '' };
  } catch {
    return {
      tasks: [],
      error: 'Browser storage is unavailable. Tasks will only be kept for this session.',
    };
  }
}

/**
 * Owns task state, persistence, filtering, and the task actions for the app.
 */
export default function App() {
  const [initialStorage] = useState(readStoredTasks);
  const [tasks, setTasks] = useState(initialStorage.tasks);
  const [storageError, setStorageError] = useState(initialStorage.error);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (initialStorage.error) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setStorageError('');
    } catch {
      setStorageError('Could not save tasks to browser storage. Your changes remain on this page.');
    }
  }, [initialStorage.error, tasks]);

  /** Adds a validated task to the top of the list. */
  function addTask({ name, description }) {
    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        name,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTasks,
    ]);
  }

  /** Updates a task's editable fields and closes its edit form. */
  function updateTask({ name, description }) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingTask.id ? { ...task, name, description } : task,
      ),
    );
    setEditingTask(null);
  }

  /** Toggles completion without changing the task's other details. */
  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  /** Confirms destructive removal before deleting a task. */
  function deleteTask(task) {
    const confirmed = window.confirm(`Delete "${task.name}"? This cannot be undone.`);
    if (confirmed) {
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== task.id));
      if (editingTask?.id === task.id) {
        setEditingTask(null);
      }
    }
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span>daymark</span>
        </a>
        <span className="topbar-note">A little more focus, every day.</span>
      </header>

      <section className="workspace" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1 id="page-title">Make room for<br /><span>what matters.</span></h1>
          <p className="intro-copy">Capture your thoughts, take one step at a time, and celebrate the progress.</p>
        </div>

        <section className="composer panel" aria-labelledby="add-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">GET IT OUT OF YOUR HEAD</p>
              <h2 id="add-heading">Add a task</h2>
            </div>
            <span className="heading-spark" aria-hidden="true">✳</span>
          </div>
          <TaskForm onSubmit={addTask} submitLabel="Add task" />
        </section>

        {editingTask && (
          <section className="edit-panel panel" aria-labelledby="edit-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MAKE AN UPDATE</p>
                <h2 id="edit-heading">Edit task</h2>
              </div>
            </div>
            <TaskForm
              initialValues={editingTask}
              onSubmit={updateTask}
              onCancel={() => setEditingTask(null)}
              submitLabel="Save changes"
            />
          </section>
        )}

        <section className="task-section" aria-labelledby="tasks-heading">
          <div className="list-header">
            <div>
              <p className="eyebrow">YOUR PLAN</p>
              <h2 id="tasks-heading">Tasks <span className="task-count">{tasks.length}</span></h2>
            </div>
            {tasks.length > 0 && (
              <p className="progress-copy">
                <span className="progress-dot" aria-hidden="true" />
                {completedCount === tasks.length
                  ? 'Everything is done'
                  : `${completedCount} of ${tasks.length} done`}
              </p>
            )}
          </div>

          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {FILTERS.map((filterOption) => (
              <button
                className={`filter-tab${filter === filterOption ? ' is-selected' : ''}`}
                key={filterOption}
                type="button"
                aria-pressed={filter === filterOption}
                onClick={() => setFilter(filterOption)}
              >
                {filterOption[0].toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          <TaskList
            tasks={visibleTasks}
            filter={filter}
            onToggle={toggleTask}
            onEdit={setEditingTask}
            onDelete={deleteTask}
          />
        </section>

        {storageError && (
          <p className="storage-notice" role="status">{storageError}</p>
        )}
      </section>

      <footer className="footer">Small steps still move you forward.</footer>
    </main>
  );
}
