import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/api.helper';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const fetchAllExpenses = async () => {
    try {
      const res = await api.get('/all');
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching all expenses:', err);
    }
  };

  const togglePaid = async (id) => {
    try {
      const res = await api.patch(`/toggle/${id}`);
      setExpenses(expenses.map(exp => exp._id === id ? res.data : exp));
    } catch (err) {
      console.error('Error toggling paid status:', err);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" mb={3}>All Expenses</Typography>
      <Typography variant="h6" mb={2}>Total Expenses: Php {totalAmount.toFixed(2)}</Typography>

      {expenses.map(exp => (
        <Paper
          key={exp._id}
          sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Box>
            {exp.title} - Php {exp.amount.toFixed(2)}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Switch
              checked={exp.paid}
              onChange={() => togglePaid(exp._id)}
              color="primary"
            />
            <IconButton color="error" onClick={() => deleteExpense(exp._id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Container>
  );
}
