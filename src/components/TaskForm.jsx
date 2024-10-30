import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const TaskForm = ({ onSubmit, editingTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Cargar las categorías desde la API
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title);
      setTaskDescription(editingTask.description);
      setSelectedCategory(editingTask.category_id);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: taskTitle, description: taskDescription, category_id: selectedCategory });
    setTaskTitle('');
    setTaskDescription('');
    setSelectedCategory('');
  };

  const handleNewCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: 'Nueva Categoría',
      input: 'text',
      inputLabel: 'Nombre de la categoría',
      inputPlaceholder: 'Ingrese el nombre de la categoría',
      showCancelButton: true,
    });

    if (categoryName) {
      await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });
      // Refrescar categorías
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h3 className="text-center">New Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task Title"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task Description"
            required
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 text-center">
          <button type="button" className="btn btn-secondary mb-2 boton_new_category" onClick={handleNewCategory}>
          + New Category
          </button>
        </div>
        <div className="mb-3 text-center">
          <button type="submit" className="btn btn-primary boton_new_guardar">
            + Add Task
          </button>
          </div>
      </form>
    </div>
  );
};

export default TaskForm;
