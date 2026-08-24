import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSkeleton from "../components/LoadingSkeleton";
import TaskCard from "../components/TaskCard";
import { api } from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      if (err.status === 401) {
        setError("Your session is no longer valid. Please sign in again.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask(e) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSaving(true);
    try {
      const data = await api.createTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null
      });

      setTasks(current => [data.task, ...current]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setNotice("Task created successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateTask(id, update) {
    setError("");
    setNotice("");

    try {
      const data = await api.updateTask(id, update);
      setTasks(current => current.map(t => t._id === id ? data.task : t));
      setNotice("Task updated successfully.");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setError("");
    setNotice("");

    try {
      // Requirement: update local state only after successful server deletion.
      const response = await api.deleteTask(id);
      if (response.success) {
        setTasks(current => current.filter(t => t._id !== id));
        setNotice("Task deleted successfully.");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const completed = useMemo(
    () => tasks.filter(t => t.isCompleted).length,
    [tasks]
  );

  return (
    <div className="app">
      <Navbar />

      <main className="dashboard">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h1>My Tasks</h1>
            <p className="muted">Create, update, complete and manage your database-persisted tasks.</p>
          </div>

          <div className="stats">
            <div><strong>{tasks.length}</strong><span>Total</span></div>
            <div><strong>{completed}</strong><span>Completed</span></div>
            <div><strong>{tasks.length - completed}</strong><span>Remaining</span></div>
          </div>
        </section>

        <Alert message={error} onClose={() => setError("")} />
        <Alert message={notice} type="success" onClose={() => setNotice("")} />

        <section className="create-card">
          <div className="section-title">
            <h2>Add a task</h2>
            <p>New tasks are persisted in MongoDB through the REST API.</p>
          </div>

          <form onSubmit={createTask} className="create-form">
            <label>Title
              <input value={title} maxLength={100} required
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to be done?" />
              <small>{title.length}/100</small>
            </label>

            <label>Description
              <textarea value={description} maxLength={1000} rows="4"
                onChange={e => setDescription(e.target.value)}
                placeholder="Add details..." />
              <small>{description.length}/1000</small>
            </label>

            <div className="form-row">
              <label>Due date
                <input type="date" value={dueDate}
                  onChange={e => setDueDate(e.target.value)} />
              </label>

              <button className="btn primary add-btn" disabled={saving || !title.trim()}>
                {saving ? "Saving..." : "+ Add Task"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="section-title">
            <h2>Your tasks</h2>
            <p>{tasks.length} task{tasks.length === 1 ? "" : "s"}</p>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : tasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Create your first task above.</p>
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task}
                  onUpdate={updateTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
