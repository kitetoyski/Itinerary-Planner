// src/pages/ItineraryView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  Chip,
  Divider,
  Fade,
  Zoom,
  Card,
  CardContent,
  Snackbar,
  CircularProgress,
  Tooltip,
  Avatar,
} from '@mui/material';
import { keyframes, styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
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

// const slideIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateX(-30px);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// `;

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  padding: theme.spacing(4, 0),
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 32,
  padding: theme.spacing(4),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '2px solid #e0e7ff',
  '& .MuiSvgIcon-root': {
    fontSize: 28,
    color: '#6366f1',
  },
  '& h5': {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  },
}));

const LocationCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
  borderRadius: 24,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 25px -12px rgba(99, 102, 241, 0.2)',
  },
}));

const DayCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: 20,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid #e0e7ff',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#6366f1',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
  },
}));

const ExpenseCard = styled(Paper)(({ theme, paid }) => ({
  background: paid ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
  borderRadius: 20,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: paid ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(8px)',
  },
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 40,
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: '#6366f1',
    color: '#6366f1',
    '&:hover': {
      borderColor: '#4f46e5',
      background: 'rgba(99, 102, 241, 0.05)',
    },
  }),
}));

// const InfoChip = styled(Chip)(({ theme, status }) => ({
//   fontWeight: 600,
//   ...(status === 'paid' && { bgcolor: '#22c55e', color: 'white' }),
//   ...(status === 'unpaid' && { bgcolor: '#f59e0b', color: 'white' }),
// }));

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0], paid: false, notes: '' });

  // useEffect(() => {
  //   fetchData();
  // }, [id]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const [itineraryRes, expensesRes] = await Promise.all([
  //       api.get(`/${id}`),
  //       api.get(`/${id}`)
  //     ]);
  //     setItinerary(itineraryRes.data);
  //     setExpenses(expensesRes.data);
  //   } catch (err) {
  //     console.error('Error fetching data:', err);
  //     setSnackbar({ open: true, message: 'Error loading itinerary', severity: 'error' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itineraryRes, expensesRes] = await Promise.all([
          api.get(`/${id}`),
          api.get(`/${id}`)
        ]);
        setItinerary(itineraryRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setSnackbar({ open: true, message: 'Error loading itinerary', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const handleFieldChange = (field, value) => {
    setItinerary({ ...itinerary, [field]: value });
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...itinerary.locations];
    newLocations[index].location = value;
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleAddLocation = () => {
    const newLocations = [
      ...itinerary.locations,
      { location: '', days: [{ day: itinerary.locations.length + 1, activities: [{ time: '', activity: '' }] }] },
    ];
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleRemoveLocation = (index) => {
    const newLocations = itinerary.locations.filter((_, i) => i !== index);
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleAddDay = (locIndex) => {
    const newLocations = [...itinerary.locations];
    const nextDay = newLocations[locIndex].days.length + 1;
    newLocations[locIndex].days.push({ day: nextDay, activities: [{ time: '', activity: '' }] });
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleRemoveDay = (locIndex, dayIndex) => {
    const newLocations = [...itinerary.locations];
    newLocations[locIndex].days = newLocations[locIndex].days.filter((_, i) => i !== dayIndex);
    // Renumber remaining days
    newLocations[locIndex].days = newLocations[locIndex].days.map((day, idx) => ({ ...day, day: idx + 1 }));
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleActivityChange = (locIndex, dayIndex, actIndex, field, value) => {
    const newLocations = [...itinerary.locations];
    newLocations[locIndex].days[dayIndex].activities[actIndex][field] = value;
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleAddActivity = (locIndex, dayIndex) => {
    const newLocations = [...itinerary.locations];
    newLocations[locIndex].days[dayIndex].activities.push({ time: '', activity: '' });
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleRemoveActivity = (locIndex, dayIndex, actIndex) => {
    const newLocations = [...itinerary.locations];
    newLocations[locIndex].days[dayIndex].activities = newLocations[locIndex].days[dayIndex].activities.filter(
      (_, i) => i !== actIndex
    );
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleSaveItinerary = async () => {
    setSaving(true);
    try {
      const payload = {
        ...itinerary,
        startDate: new Date(itinerary.startDate),
        endDate: new Date(itinerary.endDate),
      };
      const res = await api.put(`/${id}`, payload);
      setItinerary(res.data);
      setSnackbar({ open: true, message: 'Itinerary saved successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setSnackbar({ open: true, message: 'Error saving itinerary', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItinerary = async () => {
    if (!window.confirm("Are you sure you want to delete this itinerary and all its expenses?")) return;
    try {
      await api.delete(`/${itinerary._id}`);
      setSnackbar({ open: true, message: 'Itinerary deleted successfully', severity: 'success' });
      setTimeout(() => navigate("/itineraries"), 1500);
    } catch (err) {
      console.error("Error deleting itinerary:", err);
      setSnackbar({ open: true, message: 'Error deleting itinerary', severity: 'error' });
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) {
      setSnackbar({ open: true, message: 'Please enter title and amount', severity: 'warning' });
      return;
    }
    try {
      const res = await api.post(`/expenses/addExpense`, { ...newExpense, itineraryId: id, amount: parseFloat(newExpense.amount) });
      setExpenses([...expenses, res.data]);
      setNewExpense({ title: '', amount: '', date: new Date().toISOString().split('T')[0], paid: false, notes: '' });
      setSnackbar({ open: true, message: 'Expense added successfully', severity: 'success' });
    } catch (err) {
      console.error('Error adding expense:', err);
      setSnackbar({ open: true, message: 'Error adding expense', severity: 'error' });
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/expenses/${expenseId}`);
      setExpenses(expenses.filter(exp => exp._id !== expenseId));
      setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });
    } catch (err) {
      console.error("Error deleting expense:", err);
      setSnackbar({ open: true, message: 'Error deleting expense', severity: 'error' });
    }
  };

  const togglePaid = async (expenseId) => {
    try {
      const res = await api.patch(`/expenses/toggle/${expenseId}`);
      setExpenses(expenses.map(exp => exp._id === expenseId ? res.data : exp));
    } catch (err) {
      console.error('Error toggling paid status:', err);
      setSnackbar({ open: true, message: 'Error updating expense status', severity: 'error' });
    }
  };

  const getFlightStatusColor = (status) => {
    switch(status) {
      case 'on-time': return '#22c55e';
      case 'delayed': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'boarding': return '#8b5cf6';
      case 'departed': return '#06b6d4';
      default: return '#6366f1';
    }
  };

  const getFlightStatusLabel = (status) => {
    switch(status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      case 'boarding': return 'Boarding';
      case 'departed': return 'Departed';
      default: return 'Scheduled';
    }
  };

  if (loading) {
    return (
      <GradientBackground>
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Container>
      </GradientBackground>
    );
  }

  if (!itinerary) {
    return (
      <GradientBackground>
        <Container>
          <Typography color="white" textAlign="center">Itinerary not found</Typography>
        </Container>
      </GradientBackground>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses.filter(e => e.paid).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header with Actions */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/itineraries')}
                startIcon={<ArrowBackIcon />}
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Back to Itineraries
              </Button>
              <Box display="flex" gap={2}>
                <StyledButton 
                  variant="contained" 
                  onClick={handleSaveItinerary}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </StyledButton>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={handleDeleteItinerary}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>

        <GlassCard>
          {/* Flight Status Banner */}
          {itinerary.flightNumber && (
            <Zoom in>
              <Paper sx={{ p: 3, mb: 4, borderRadius: 4, background: `linear-gradient(135deg, ${getFlightStatusColor(itinerary.flightStatus)}20 0%, ${getFlightStatusColor(itinerary.flightStatus)}10 100%)`, border: `1px solid ${getFlightStatusColor(itinerary.flightStatus)}40` }}>
                <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                  <Avatar sx={{ bgcolor: getFlightStatusColor(itinerary.flightStatus), width: 56, height: 56 }}>
                    <FlightTakeoffIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">Flight {itinerary.flightNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">Track your flight status in real-time</Typography>
                  </Box>
                  <Chip 
                    icon={<FlightTakeoffIcon />}
                    label={getFlightStatusLabel(itinerary.flightStatus)} 
                    sx={{ bgcolor: getFlightStatusColor(itinerary.flightStatus), color: 'white', fontWeight: 600, px: 2, py: 2 }}
                  />
                </Box>
              </Paper>
            </Zoom>
          )}

          {/* Basic Information */}
          <SectionHeader>
            <EditIcon />
            <Typography variant="h5">Itinerary Details</Typography>
          </SectionHeader>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                value={itinerary.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Date"
                type="date"
                value={itinerary.startDate?.split('T')[0] || ''}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Date"
                type="date"
                value={itinerary.endDate?.split('T')[0] || ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Flight Number"
                value={itinerary.flightNumber || ''}
                onChange={(e) => handleFieldChange('flightNumber', e.target.value.toUpperCase())}
                fullWidth
                placeholder="e.g., AA123"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Flight Status</InputLabel>
                <Select
                  value={itinerary.flightStatus || 'scheduled'}
                  onChange={(e) => handleFieldChange('flightStatus', e.target.value)}
                  label="Flight Status"
                  sx={{ borderRadius: 4 }}
                  disabled={!itinerary.flightNumber}
                >
                  <MenuItem value="scheduled">🕐 Scheduled</MenuItem>
                  <MenuItem value="on-time">✅ On Time</MenuItem>
                  <MenuItem value="boarding">🚪 Boarding</MenuItem>
                  <MenuItem value="departed">🛫 Departed</MenuItem>
                  <MenuItem value="delayed">⏰ Delayed</MenuItem>
                  <MenuItem value="cancelled">❌ Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={itinerary.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  label="Payment Status"
                  sx={{ borderRadius: 4 }}
                >
                  <MenuItem value="unpaid">🟡 Unpaid</MenuItem>
                  <MenuItem value="paid">🟢 Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Locations Section */}
          <SectionHeader>
            <LocationOnIcon />
            <Typography variant="h5">Locations & Activities</Typography>
          </SectionHeader>

          {itinerary.locations?.map((loc, locIndex) => (
            <Zoom in key={locIndex} timeout={300}>
              <LocationCard>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <LocationOnIcon sx={{ color: '#6366f1' }} />
                  <TextField
                    label="Location Name"
                    value={loc.location}
                    onChange={(e) => handleLocationChange(locIndex, e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                  />
                  {itinerary.locations.length > 1 && (
                    <Tooltip title="Remove Location">
                      <IconButton color="error" onClick={() => handleRemoveLocation(locIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {loc.days?.map((day, dayIndex) => (
                  <DayCard key={dayIndex}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Chip 
                        icon={<EventIcon />} 
                        label={`Day ${day.day}`} 
                        sx={{ bgcolor: '#6366f1', color: 'white', fontWeight: 600 }}
                      />
                      {loc.days.length > 1 && (
                        <Tooltip title="Remove Day">
                          <IconButton size="small" color="error" onClick={() => handleRemoveDay(locIndex, dayIndex)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    {day.activities?.map((act, actIndex) => (
                      <Grid container spacing={2} alignItems="center" key={actIndex} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            size="small"
                            label="Time"
                            type="time"
                            value={act.time}
                            onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'time', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#6366f1', fontSize: 18 }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            size="small"
                            label="Activity"
                            value={act.activity}
                            onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'activity', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        {day.activities.length > 1 && (
                          <Grid item xs={12} sm={1}>
                            <Tooltip title="Remove Activity">
                              <IconButton color="error" onClick={() => handleRemoveActivity(locIndex, dayIndex, actIndex)} size="small">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                    <StyledButton variant="outlined" size="small" onClick={() => handleAddActivity(locIndex, dayIndex)} startIcon={<AddIcon />} sx={{ mt: 1 }}>
                      Add Activity
                    </StyledButton>
                  </DayCard>
                ))}
                <StyledButton variant="outlined" onClick={() => handleAddDay(locIndex)} startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Add Day
                </StyledButton>
              </LocationCard>
            </Zoom>
          ))}
          <StyledButton variant="contained" onClick={handleAddLocation} startIcon={<AddIcon />} sx={{ mt: 2, mb: 4 }}>
            Add Location
          </StyledButton>

          <Divider sx={{ my: 3 }} />

          {/* Expenses Section */}
          <SectionHeader>
            <AttachMoneyIcon />
            <Typography variant="h5">Expenses</Typography>
          </SectionHeader>

          {/* Expense Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 4, bgcolor: '#f0fdf4' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#22c55e">₱{totalExpenses.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 4, bgcolor: '#e0e7ff' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#6366f1">₱{paidExpenses.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Expenses List */}
          <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 3 }}>
            {expenses.map((exp) => (
              <ExpenseCard key={exp._id} paid={exp.paid}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{exp.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(exp.date).toLocaleDateString()}
                    </Typography>
                    {exp.notes && <Typography variant="caption" display="block" color="text.secondary">{exp.notes}</Typography>}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color={exp.paid ? '#22c55e' : '#ef4444'}>
                    ₱{exp.amount.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">{exp.paid ? 'Paid' : 'Unpaid'}</Typography>
                    <Switch checked={exp.paid} onChange={() => togglePaid(exp._id)} color="success" />
                    <Tooltip title="Delete Expense">
                      <IconButton color="error" onClick={() => deleteExpense(exp._id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </ExpenseCard>
            ))}
            {expenses.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc' }}>
                <ReceiptIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                <Typography color="text.secondary">No expenses added yet</Typography>
              </Paper>
            )}
          </Box>

          {/* Add Expense Form */}
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Add New Expense</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  placeholder="e.g., Hotel booking"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Amount (₱)"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Notes"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Optional"
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <StyledButton variant="contained" onClick={handleAddExpense} fullWidth startIcon={<AddIcon />}>
                  Add
                </StyledButton>
              </Grid>
            </Grid>
          </Paper>
        </GlassCard>
      </Container>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 4 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GradientBackground>
  );
}