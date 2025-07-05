import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskService from "../services/task.service";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { format } from "date-fns";

const TodayTasks = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = () => {
    setLoading(true);
    TaskService.getTodayTasks()
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setTodayTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching today tasks:", error);
        const errorMessage =
          error.response?.data || error.message || "Unknown error occurred";
        setError("Error fetching today's tasks: " + errorMessage);
        setTodayTasks([]);
        setLoading(false);
      });
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      TaskService.deleteTask(id)
        .then(() => {
          setTodayTasks((prevTasks) =>
            Array.isArray(prevTasks)
              ? prevTasks.filter((task) => task.id !== id)
              : []
          );
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
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
      return format(date, "HH:mm");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date error";
    }
  };

  const refreshTasks = () => {
    fetchTodayTasks();
  };

  if (loading) {
    return <div className="text-center mt-5">Loading today's tasks...</div>;
  }

  return (
    <Container className="mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Today's Tasks</h2>
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

      <div className="mb-3 text-muted">
        <small>
          Showing tasks due today ({format(new Date(), "MMM dd, yyyy")})
        </small>
      </div>

      {todayTasks.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <h4 className="mb-3">No tasks due today!</h4>
          <p className="mb-3 text-muted">
            Great job! You don't have any tasks scheduled for today.
          </p>
          <Link to="/tasks/create">
            <Button variant="primary">Create a New Task</Button>
          </Link>
          <div className="mt-3">
            <Link to="/tasks">
              <Button variant="outline-primary">View All Tasks</Button>
            </Link>
          </div>
        </div>
      ) : (
        <Row>
          {todayTasks.map((task) => (
            <Col key={task.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 border-primary">
                <Card.Body>
                  <Card.Title className="text-primary">{task.title}</Card.Title>
                  <Card.Text>{task.description}</Card.Text>
                  <div className="mb-2">
                    <Badge bg="warning" text="dark">
                      Due: {formatDueDate(task.dueDate)}
                    </Badge>
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

      <div className="mt-4 text-center">
        <Link to="/tasks">
          <Button variant="outline-secondary">View All Tasks</Button>
        </Link>
      </div>
    </Container>
  );
};

export default TodayTasks;
