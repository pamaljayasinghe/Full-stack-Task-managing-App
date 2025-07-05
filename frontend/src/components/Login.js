import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    AuthService.login(username, password)
      .then((response) => {
        navigate("/tasks");
      })
      .catch((error) => {
        console.error("Login error details:", error);
        const resMessage =
          (error.response && error.response.data) ||
          error.message ||
          "An error occurred during login. Please try again.";
        setMessage(
          typeof resMessage === "object"
            ? JSON.stringify(resMessage)
            : resMessage
        );
        setLoading(false);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="card p-4">
            <h2 className="text-center mb-4">Login</h2>

            {message && (
              <Alert variant="danger" className="mb-3">
                {message}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </Form>

            <div className="mt-3 text-center">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <div className="mt-3 text-center">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
