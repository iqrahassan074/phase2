import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Container } from '@mui/material';

interface TaskFormInputs {
  title: string;
  description?: string;
}

interface TaskFormProps {
  initialData?: TaskFormInputs;
  onSubmit: (data: TaskFormInputs) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ title: '', description: '' });
    }
  }, [initialData, reset]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Task Title"
            autoFocus
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            multiline
            rows={4}
            {...register('description')}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {initialData ? 'Update Task' : 'Create Task'}
            </Button>

            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TaskForm;
