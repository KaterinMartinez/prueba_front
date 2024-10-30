import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './styles.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false); // Para controlar la visibilidad del formulario

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (task) => {
    if (editingTask) {
      await fetch(`http://localhost:8000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      setEditingTask(null);
    } else {
      await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
    }
    setShowForm(false); // Ocultar el formulario después de enviar
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true); // Mostrar el formulario para editar
  };

  const handleDelete = (taskId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar esta tarea!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
        fetchTasks();
        Swal.fire('Borrado!', 'La tarea ha sido borrada.', 'success');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Todo List</h1>
      <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>New Task</button>
      {showForm && (
        <TaskForm
          onSubmit={handleSubmit}
          editingTask={editingTask}
        />
      )}
      <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
