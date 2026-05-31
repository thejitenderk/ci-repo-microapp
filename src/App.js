import React, { useState, useEffect } from 'react';
import './App.css';

const FILTERS = ['All', 'Active', 'Done'];

const VERSION = process.env.REACT_APP_VERSION || '1.0.0';
const ENV = process.env.REACT_APP_ENV || 'development';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow-tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Set up GitHub Actions workflow', done: true, priority: 'high' },
      { id: 2, text: 'Write Dockerfile for the app', done: false, priority: 'high' },
      { id: 3, text: 'Push image to Docker Hub', done: false, priority: 'medium' },
      { id: 4, text: 'Deploy to staging environment', done: false, priority: 'low' },
    ];
  });

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('All');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false, priority }
    ]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
    setEditId(null);
  };

  const clearDone = () => {
    setTasks(prev => prev.filter(t => !t.done));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'Active') return !t.done;
    if (filter === 'Done') return t.done;
    return true;
  });

  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="logo">⬡ TaskFlow</span>
          <span className="env-badge">{ENV}</span>
        </div>
        <div className="version-tag">v{VERSION}</div>
      </header>

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <h1 className="title">Ship it.<br /><span className="accent">Track it.</span></h1>
          <p className="subtitle">A React app for CI/CD pipeline practice.</p>
        </section>

        {/* Progress */}
        <div className="progress-card">
          <div className="progress-header">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-value">{doneCount}/{tasks.length} tasks</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-pct">{progress}%</span>
        </div>

        {/* Add Task */}
        <div className="add-card">
          <div className="add-row">
            <input
              className="task-input"
              type="text"
              placeholder="Add a new task..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <select
              className="priority-select"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <button className="add-btn" onClick={addTask}>+ Add</button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          {doneCount > 0 && (
            <button className="clear-btn" onClick={clearDone}>
              Clear done
            </button>
          )}
        </div>

        {/* Task List */}
        <ul className="task-list">
          {filtered.length === 0 && (
            <li className="empty-state">No tasks here. Add one above ↑</li>
          )}
          {filtered.map(task => (
            <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <button
                className={`check-btn priority-${task.priority}`}
                onClick={() => toggleTask(task.id)}
                aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.done ? '✓' : ''}
              </button>

              {editId === task.id ? (
                <input
                  className="edit-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(task.id); if (e.key === 'Escape') setEditId(null); }}
                  autoFocus
                />
              ) : (
                <span className="task-text">{task.text}</span>
              )}

              <div className="task-actions">
                <span className={`priority-dot priority-${task.priority}`} title={task.priority} />
                {editId === task.id ? (
                  <button className="action-btn save" onClick={() => saveEdit(task.id)}>Save</button>
                ) : (
                  <button className="action-btn edit" onClick={() => startEdit(task)}>Edit</button>
                )}
                <button className="action-btn delete" onClick={() => deleteTask(task.id)}>✕</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer info */}
        <div className="info-strip">
          <span>🐳 Docker-ready</span>
          <span>⚙️ CI/CD enabled</span>
          <span>⚛️ React 18</span>
        </div>
      </main>
    </div>
  );
}

export default App;
