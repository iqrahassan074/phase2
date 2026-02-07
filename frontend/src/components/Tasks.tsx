import React, { useEffect, useState, useCallback } from 'react';
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
import TaskForm from './TaskForm';

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

  // ✅ FIX: useCallback
  const fetchTasks = useCallback(async () => {
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
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ FIX: dependency correct
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const handleCreateTask = async (data: TaskFormInputs) => {
    if (!token) return;
    try {
      await apiCall<Task>('/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      fetchTasks();
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      fetchTasks();
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
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
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
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Your Tasks</Typography>
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

      <ButtonGroup sx={{ mb: 2 }}>
        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'contained' : 'outlined'}>
          All
        </Button>
        <Button
          onClick={() => setFilter('completed')}
          variant={filter === 'completed' ? 'contained' : 'outlined'}
        >
          Completed
        </Button>
        <Button
          onClick={() => setFilter('incomplete')}
          variant={filter === 'incomplete' ? 'contained' : 'outlined'}
        >
          Incomplete
        </Button>
      </ButtonGroup>

      {filteredTasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
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
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id, !task.completed)}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditClick(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTask(task.id)}>
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
