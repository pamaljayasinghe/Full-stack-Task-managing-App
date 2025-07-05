import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import TodayTasks from "./components/TodayTasks";
import CreateTask from "./components/CreateTask";
import EditTask from "./components/EditTask";
import PrivateRoute from "./components/PrivateRoute";
import AuthService from "./services/auth.service";

function App() {
  // Helper component for root redirect
  const RootRedirect = () => {
    const isAuthenticated = AuthService.isAuthenticated();
    return <Navigate to={isAuthenticated ? "/tasks" : "/login"} />;
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/today" element={<TodayTasks />} />
            <Route path="/tasks/create" element={<CreateTask />} />
            <Route path="/tasks/edit/:id" element={<EditTask />} />
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
