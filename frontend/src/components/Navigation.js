import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import AuthService from "../services/auth.service";

const Navigation = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isAuthenticated()
  );
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        if (typeof user === "object") {
          // Try different properties in case the API response format varies
          setUserName(user.firstName || user.username || user.email || "");
        } else {
          setUserName(user);
        }
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserName("");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Task Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/tasks">
                  Tasks
                </Nav.Link>
                <Nav.Link as={Link} to="/tasks/today">
                  Today's Tasks
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  {currentUser && typeof currentUser === "object"
                    ? `Welcome, ${
                        currentUser.firstName ||
                        currentUser.username ||
                        currentUser.email ||
                        "User"
                      }`
                    : "Welcome"}
                </span>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
