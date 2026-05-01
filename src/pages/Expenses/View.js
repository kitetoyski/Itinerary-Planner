// src/pages/ExpensesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  Switch,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaidIcon from '@mui/icons-material/Paid';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { keyframes, styled } from '@mui/system';
import api from '../../api/api.helper';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPaper = styled(Paper)(({ theme, paid }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  background: paid ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'white',
  border: paid ? '1px solid #22c55e' : '1px solid #e2e8f0',
  animation: `${fadeInUp} 0.4s ease-out`,
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  textAlign: 'center',
  background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
  border: `1px solid ${color}30`,
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', amount: '', paid: false });

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  useEffect(() => {
    let filtered = [...expenses];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus === 'paid') {
      filtered = filtered.filter(exp => exp.paid);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(exp => !exp.paid);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, filterStatus, sortBy]);

  const fetchAllExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses/all');
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching all expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePaid = async (id) => {
    try {
      const res = await api.patch(`/expenses/toggle/${id}`);
      setExpenses(expenses.map(exp => exp._id === id ? res.data : exp));
    } catch (err) {
      console.error('Error toggling paid status:', err);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  // const handleEditClick = (expense) => {
  //   setSelectedExpense(expense);
  //   setEditForm({
  //     title: expense.title,
  //     amount: expense.amount,
  //     paid: expense.paid,
  //   });
  //   setEditDialogOpen(true);
  // };

  const handleUpdateExpense = async () => {
    try {
      const res = await api.patch(`/expenses/${selectedExpense._id}`, editForm);
      setExpenses(expenses.map(exp => exp._id === selectedExpense._id ? res.data : exp));
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidAmount = expenses.filter(exp => exp.paid).reduce((sum, exp) => sum + exp.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, animation: `${fadeInUp} 0.5s ease-out` }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
          }}
        >
          Expense Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your travel expenses in one place
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#6366f1">
            <AttachMoneyIcon sx={{ fontSize: 40, color: '#6366f1', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#1e1b4b">
              ₱{totalAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#22c55e">
            <PaidIcon sx={{ fontSize: 40, color: '#22c55e', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#166534">
              ₱{paidAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">Paid</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#ef4444">
            <PendingIcon sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#991b1b">
              ₱{pendingAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">Pending</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#8b5cf6">
            <ReceiptIcon sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#4c1d95">
              {expenses.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Total Transactions</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search expenses..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{ borderRadius: 2 }}
          >
            {filterStatus === 'all' ? 'All' : filterStatus === 'paid' ? 'Paid' : 'Pending'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
            sx={{ borderRadius: 2 }}
          >
            Sort by {sortBy}
          </Button>
        </Box>
      </Paper>

      {/* Filter Menu */}
      <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={() => setFilterAnchorEl(null)}>
        <MenuItem onClick={() => { setFilterStatus('all'); setFilterAnchorEl(null); }}>
          <ListItemText>All Expenses</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setFilterStatus('paid'); setFilterAnchorEl(null); }}>
          <ListItemText>Paid Only</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setFilterStatus('pending'); setFilterAnchorEl(null); }}>
          <ListItemText>Pending Only</ListItemText>
        </MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
        <MenuItem onClick={() => { setSortBy('date'); setSortAnchorEl(null); }}>
          <ListItemText>Sort by Date (Newest)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('amount'); setSortAnchorEl(null); }}>
          <ListItemText>Sort by Amount (Highest)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('title'); setSortAnchorEl(null); }}>
          <ListItemText>Sort by Title (A-Z)</ListItemText>
        </MenuItem>
      </Menu>

      {/* Expenses List */}
      {loading ? (
        <Box>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 4 }} />
          ))}
        </Box>
      ) : filteredExpenses.length === 0 ? (
        <Fade in>
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
            <ReceiptIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No expenses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </Typography>
          {filteredExpenses.map((exp) => (
            <StyledPaper key={exp._id} paid={exp.paid}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.title}
                  </Typography>
                  {exp.paid ? (
                    <Chip label="Paid" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
                  ) : (
                    <Chip label="Pending" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ₱{exp.amount.toLocaleString()} • {new Date(exp.date).toLocaleDateString()}
                </Typography>
                {exp.itinerary && (
                  <Typography variant="caption" color="text.secondary">
                    Trip: {exp.itinerary.title}
                  </Typography>
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Switch
                  checked={exp.paid}
                  onChange={() => togglePaid(exp._id)}
                  color="success"
                />
                <IconButton color="error" onClick={() => deleteExpense(exp._id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </StyledPaper>
          ))}
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={editForm.amount}
            onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editForm.paid ? 'paid' : 'pending'}
              label="Status"
              onChange={(e) => setEditForm({ ...editForm, paid: e.target.value === 'paid' })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateExpense} sx={{ bgcolor: '#6366f1' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}