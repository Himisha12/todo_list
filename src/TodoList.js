import React, { useState, useEffect } from 'react';
import './App.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') {
      alert('Task cannot be empty');
      return;
    }
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask('');
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTaskCompletion = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getFilteredTasks = () => {
    if (sort === 'completion') {
      return tasks.filter(task => task.completed);
    }
    return tasks.filter((task) => {
      if (filter === 'completed') {
        return task.completed;
      }
      if (filter === 'active') {
        return !task.completed;
      }
      return true;
    });
  };

  const getSortedTasks = (filteredTasks) => {
    if (sort === 'alphabetical') {
      return [...filteredTasks].sort((a, b) => a.text.localeCompare(b.text));
    }
    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();
  const sortedTasks = getSortedTasks(filteredTasks);

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} disabled={!newTask.trim()} id='addtask'>
          Add Task
        </button>
      </div>
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">None</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="completion">Completion</option>
        </select>
      </div>
      <ul>
        {sortedTasks.map((task, index) => (
          <li key={index}>
            <div className={task.completed ? 'completed task-text' : 'task-text'}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
              />
              {task.text}
            </div>
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
