import { useEffect, useState } from "react";

function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function inputDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(inputDate(task.dueDate));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(inputDate(task.dueDate));
  }, [task]);

  async function save() {
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onUpdate(task._id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleComplete() {
    await onUpdate(task._id, {
      isCompleted: !task.isCompleted
    });
  }

  if (editing) {
    return (
      <article className="task-card edit-card">
        <label>Title
          <input value={title} maxLength={100} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>Description
          <textarea value={description} maxLength={1000} rows="4" onChange={e => setDescription(e.target.value)} />
        </label>
        <label>Due date
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </label>
        <div className="task-actions">
          <button className="btn primary" disabled={saving || !title.trim()} onClick={save}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn secondary" disabled={saving} onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={`task-card ${task.isCompleted ? "completed" : ""}`}>
      <div className="task-top">
        <button
          className={`check-btn ${task.isCompleted ? "checked" : ""}`}
          onClick={toggleComplete}
          aria-label={task.isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {task.isCompleted ? "✓" : ""}
        </button>

        <div className="task-heading">
          <h3>{task.title}</h3>
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>

      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-actions">
        <button className="btn secondary" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </article>
  );
}
