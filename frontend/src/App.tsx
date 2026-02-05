import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
            {isAuthenticated && (
              <Button color="inherit" component={Link} to="/tasks">
                Tasks
              </Button>
            )}
          </Box>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className="App">
        <h1>Todo App</h1>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Login />} />
          {/* Default route or redirect can be added later */}
          <Route path="/" element={isAuthenticated ? <Tasks /> : <Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;