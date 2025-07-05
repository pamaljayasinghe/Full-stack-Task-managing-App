import api from "./api";

const TaskService = {
  getAllTasks: () => {
    return api.get("/tasks");
  },

  getTodayTasks: () => {
    return api.get("/tasks/today");
  },

  getTaskById: (id) => {
    return api.get(`/tasks/${id}`);
  },

  createTask: (taskData) => {
    // Format the date properly before sending to the backend
    const formattedTask = {
      ...taskData,
      dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
    };
    return api.post("/tasks", formattedTask);
  },

  updateTask: (id, taskData) => {
    // Format the date properly before sending to the backend
    const formattedTask = {
      ...taskData,
      dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
    };
    return api.put(`/tasks/${id}`, formattedTask);
  },

  deleteTask: (id) => {
    return api.delete(`/tasks/${id}`);
  },
};

export default TaskService;
