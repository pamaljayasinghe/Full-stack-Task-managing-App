import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../services/task.service";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    TaskService.getTaskById(id)
      .then((response) => {
        const taskData = response.data;
        setTask({
          ...taskData,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date(),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
        let errorMessage = "Error fetching task: ";

        if (error.response) {
          errorMessage += error.response.data || error.response.statusText;
        } else if (error.request) {
          errorMessage +=
            "No response from server. Please check your connection.";
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
        setLoading(false);
      });
  }, [id]);

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
    setSaving(true);
    setError("");

    if (!task.title.trim()) {
      setError("Title is required");
      setSaving(false);
      return;
    }

    TaskService.updateTask(id, task)
      .then(() => {
        navigate("/tasks");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        let errorMessage = "Error updating task: ";

        if (error.response) {
          errorMessage += error.response.data || error.response.statusText;
        } else if (error.request) {
          errorMessage +=
            "No response from server. Please check your connection.";
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
        setSaving(false);
      });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading task...</div>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card p-4">
            <h2 className="text-center mb-4">Edit Task</h2>

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
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditTask;
