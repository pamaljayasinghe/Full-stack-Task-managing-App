import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskService from "../services/task.service";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setTask((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!task.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    TaskService.createTask(task)
      .then((response) => {
        console.log("Task created successfully:", response.data);
        // Navigate back to tasks list which will trigger a refresh
        navigate("/tasks", { replace: true });
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        let errorMessage = "Error creating task: ";

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage += error.response.data || error.response.statusText;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage +=
            "No response from server. Please check your connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage += error.message;
        }

        setError(errorMessage);
        setLoading(false);
      });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card p-4">
            <h2 className="text-center mb-4">Create New Task</h2>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={task.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Task description"
                  value={task.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Due Date</Form.Label>
                <br />
                <DatePicker
                  selected={task.dueDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="form-control"
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate("/tasks")}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTask;
