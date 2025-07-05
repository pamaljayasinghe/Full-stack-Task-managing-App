import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskService from "../services/task.service";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { format } from "date-fns";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add focus listener to refresh data when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchTasks();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    setError("");
    TaskService.getAllTasks()
      .then((response) => {
        // Ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data || error.message || "Unknown error occurred";
        setError("Error fetching tasks: " + errorMessage);
        // Set empty array on error
        setTasks([]);
        setLoading(false);
      });
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      TaskService.deleteTask(id)
        .then(() => {
          // Refresh data after successful deletion
          fetchTasks();
        })
        .catch((error) => {
          let errorMessage = "Error deleting task: ";

          if (error.response) {
            errorMessage += error.response.data || error.response.statusText;
          } else if (error.request) {
            errorMessage +=
              "No response from server. Please check your connection.";
          } else {
            errorMessage += error.message;
          }

          setError(errorMessage);
        });
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return "No due date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Date error";
    }
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  if (loading) {
    return <div className="text-center mt-5">Loading tasks...</div>;
  }

  return (
    <Container className="mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Tasks</h2>
        <div>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={refreshTasks}
          >
            Refresh
          </Button>
          <Link to="/tasks/create">
            <Button variant="primary">Add New Task</Button>
          </Link>
        </div>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <small className="text-muted">Total tasks: {tasks.length}</small>
        <Link to="/tasks/today">
          <Button variant="outline-info" size="sm">
            View Today's Tasks
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <h4 className="mb-3">No tasks found!</h4>
          <p className="mb-3 text-muted">
            Create your first task to get started with task management.
          </p>
          <Link to="/tasks/create">
            <Button variant="primary">Create Your First Task</Button>
          </Link>
        </div>
      ) : (
        <Row>
          {tasks.map((task) => (
            <Col key={task.id} lg={4} md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Text>{task.description}</Card.Text>
                  <div className="mb-2">
                    <Badge bg="info">Due: {formatDueDate(task.dueDate)}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mt-auto">
                    <Link to={`/tasks/edit/${task.id}`}>
                      <Button variant="outline-primary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default TaskList;
