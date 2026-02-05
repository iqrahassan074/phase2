import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api/api';
import TaskForm from './TaskForm'; // Import the TaskForm component

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
}

interface TaskFormInputs {
  title: string;
  description?: string;
}

type Filter = 'all' | 'completed' | 'incomplete';

const Tasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const fetchTasks = async () => {
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await apiCall<Task[]>('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    }
    if (filter === 'incomplete') {
      return !task.completed;
    }
    return true;
  });

  const handleCreateTask = async (data: TaskFormInputs) => {
    if (!token) return;
    try {
      await apiCall<Task>('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      fetchTasks(); // Refresh tasks after creation
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (data: TaskFormInputs) => {
    if (!token || !editingTask) return;
    try {
      await apiCall<Task>(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      fetchTasks(); // Refresh tasks after update
      setShowForm(false);
      setEditingTask(undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!token) return;
    try {
      await apiCall<void>(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh tasks after deletion
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    if (!token) return;
    try {
      await apiCall<Task>(`/api/tasks/${taskId}/complete?completed=${completed}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh tasks after update
    } catch (err: any) {
      setError(err.message || 'Failed to toggle task completion');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Your Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTask(undefined);
            setShowForm(true);
          }}
        >
          Add New Task
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="contained" aria-label="task filter button group">
          <Button
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'inherit'}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('completed')}
            color={filter === 'completed' ? 'primary' : 'inherit'}
          >
            Completed
          </Button>
          <Button
            onClick={() => setFilter('incomplete')}
            color={filter === 'incomplete' ? 'primary' : 'inherit'}
          >
            Incomplete
          </Button>
        </ButtonGroup>
      </Box>
      {filteredTasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Completed</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id, !task.completed)}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => handleEditClick(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={showForm} onClose={handleCancelForm}>
        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <TaskForm
            initialData={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Tasks;
