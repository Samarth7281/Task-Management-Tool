import { useState, useEffect } from "react";
import axios from "axios";
import Search from "./TasksComponents/Search";
import TaskForm from "./TasksComponents/TasksForm";
import { FiEdit, FiTrash } from "react-icons/fi";

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [filteredTasks, setFilteredTasks] = useState([]); // Tasks filtered by search
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to track search query

  // Fetch tasks from the backend API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const response = await axios.get("http://localhost:4000/api/tasks", {
          headers: {
            Authorization: `${token}`, // Include the token in the header
          },
        });
        setTasks(response.data);
        setFilteredTasks(response.data); // Initialize filtered tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Handle search input change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  // Handle adding or updating tasks
  const handleTaskSubmit = async (task) => {
    const token = localStorage.getItem("token"); // Retrieve the token
    if (taskToEdit) {
      // Update task
      try {
        const updatedTask = await axios.put(
          `http://localhost:4000/api/tasks/${taskToEdit._id}`,
          task,
          {
            headers: {
              Authorization: `${token}`, // Include the token
            },
          }
        );
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskToEdit._id ? updatedTask.data : t))
        );
        setFilteredTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskToEdit._id ? updatedTask.data : t))
        );
      } catch (error) {
        console.error("Error updating task:", error);
      }
      setTaskToEdit(null); // Reset editing state
    } else {
      // Add new task
      try {
        const response = await axios.post(
          "http://localhost:4000/api/tasks",
          task,
          {
            headers: {
              Authorization: `${token}`, // Include the token
            },
          }
        );
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setFilteredTasks((prevTasks) => [...prevTasks, response.data]);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
    setShowForm(false); // Hide form after submission
  };

  // Handle task editing
  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowForm(true); // Show the form for editing
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token"); // Retrieve the token
    try {
      await axios.delete(`http://localhost:4000/api/${taskId}`, {
        headers: {
          Authorization: `${token}`, // Include the token
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setFilteredTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      {/* Static Columns */}
      <div className="mt-4 px-4">
        <div className="grid grid-cols-6 gap-4 bg-blue-100 p-4 rounded-lg shadow-md border border-blue-500">
          <div className="font-semibold text-blue-700">Name</div>
          <div className="font-semibold text-blue-700">Assignee</div>
          <div className="font-semibold text-blue-700">Due Date</div>
          <div className="font-semibold text-blue-700">Priority</div>
          <div className="font-semibold text-blue-700">Status</div>
          <div className="font-semibold text-blue-700 text-right">Actions</div>
        </div>
      </div>

      {/* Display Filtered Tasks */}
      <div className="px-4 mt-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow-md border border-gray-300 mb-2"
          >
            <div>{task.title}</div>
            <div>{task.assignee}</div>
            <div>{task.dueDate}</div>
            <div>{task.priority}</div>
            <div>{task.status}</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleEdit(task)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FiEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <button
          onClick={() => {
            setTaskToEdit(null);
            setShowForm((prev) => !prev);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setShowForm(false);
            setTaskToEdit(null);
          }}
          task={taskToEdit}
        />
      )}
    </div>
  );
};

export default Tasks;
