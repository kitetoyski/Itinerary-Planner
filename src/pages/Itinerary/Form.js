// src/pages/ItineraryForm.jsx (Updated with Flight Number)
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
  Fade,
  Zoom,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { keyframes, styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightIcon from '@mui/icons-material/Flight';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../api/api.helper';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
  100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
`;

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
  '& h6': {
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

const ExpenseCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
  borderRadius: 20,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(16, 185, 129, 0.2)',
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

const GradientTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    transition: 'all 0.3s ease',
    '&:hover fieldset': {
      borderColor: '#6366f1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      borderWidth: 2,
    },
  },
}));

const getDefaultLocation = () => ({
  location: '',
  days: [{ day: 1, activities: [{ time: '', activity: '' }] }],
});

const getDefaultExpense = () => ({
  title: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  paid: false,
  notes: '',
});

export default function ItineraryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightStatus, setFlightStatus] = useState('scheduled');
  const [locations, setLocations] = useState([getDefaultLocation()]);
  const [expenses, setExpenses] = useState([getDefaultExpense()]);
  const [status, setStatus] = useState('unpaid');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (id) {
      const fetchItinerary = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/itineraries/${id}`);
          const data = res.data;
          setTitle(data.title);
          setStartDate(data.startDate?.split('T')[0] || '');
          setEndDate(data.endDate?.split('T')[0] || '');
          setFlightNumber(data.flightNumber || '');
          setFlightStatus(data.flightStatus || 'scheduled');
          setLocations(data.locations?.length ? data.locations : [getDefaultLocation()]);
          setStatus(data.status || 'unpaid');

          const expRes = await api.get(`/itinerary/${id}`);
          setExpenses(expRes.data.length ? expRes.data : [getDefaultExpense()]);
        } catch (err) {
          console.error('Error fetching itinerary:', err);
          setSnackbar({ open: true, message: 'Error loading itinerary', severity: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchItinerary();
    }
  }, [id]);

  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setFlightNumber('');
    setFlightStatus('scheduled');
    setLocations([getDefaultLocation()]);
    setExpenses([getDefaultExpense()]);
    setStatus('unpaid');
    setActiveStep(0);
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index].location = value;
    setLocations(newLocations);
  };

  const handleAddLocation = () => {
    setLocations([...locations, getDefaultLocation()]);
  };

  const handleRemoveLocation = (index) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index));
    } else {
      setSnackbar({ open: true, message: 'You need at least one location', severity: 'warning' });
    }
  };

  const handleAddDay = (locIndex) => {
    const newLocations = [...locations];
    const nextDay = newLocations[locIndex].days.length + 1;
    newLocations[locIndex].days.push({ 
      day: nextDay, 
      activities: [{ time: '', activity: '' }] 
    });
    setLocations(newLocations);
  };

  const handleRemoveDay = (locIndex, dayIndex) => {
    const newLocations = [...locations];
    if (newLocations[locIndex].days.length > 1) {
      newLocations[locIndex].days = newLocations[locIndex].days.filter((_, i) => i !== dayIndex);
      newLocations[locIndex].days = newLocations[locIndex].days.map((day, idx) => ({ ...day, day: idx + 1 }));
      setLocations(newLocations);
    } else {
      setSnackbar({ open: true, message: 'You need at least one day per location', severity: 'warning' });
    }
  };

  const handleActivityChange = (locIndex, dayIndex, actIndex, field, value) => {
    const newLocations = [...locations];
    newLocations[locIndex].days[dayIndex].activities[actIndex][field] = value;
    setLocations(newLocations);
  };

  const handleAddActivity = (locIndex, dayIndex) => {
    const newLocations = [...locations];
    newLocations[locIndex].days[dayIndex].activities.push({ time: '', activity: '' });
    setLocations(newLocations);
  };

  const handleRemoveActivity = (locIndex, dayIndex, actIndex) => {
    const newLocations = [...locations];
    if (newLocations[locIndex].days[dayIndex].activities.length > 1) {
      newLocations[locIndex].days[dayIndex].activities = newLocations[locIndex].days[dayIndex].activities.filter(
        (_, i) => i !== actIndex
      );
      setLocations(newLocations);
    } else {
      setSnackbar({ open: true, message: 'You need at least one activity per day', severity: 'warning' });
    }
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, getDefaultExpense()]);
  };

  const handleRemoveExpense = (index) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    } else {
      setSnackbar({ open: true, message: 'You need at least one expense record', severity: 'warning' });
    }
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setSnackbar({ open: true, message: 'Please enter a title', severity: 'error' });
      return;
    }
    if (!startDate || !endDate) {
      setSnackbar({ open: true, message: 'Please select dates', severity: 'error' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setSnackbar({ open: true, message: 'Start date cannot be after end date', severity: 'error' });
      return;
    }

    const hasValidLocation = locations.some(loc => loc.location.trim());
    if (!hasValidLocation) {
      setSnackbar({ open: true, message: 'Please add at least one location', severity: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      let itineraryId;

      if (id) {
        const res = await api.put(`/itineraries/${id}`, { 
          title, startDate, endDate, locations, status, 
          flightNumber, flightStatus 
        });
        itineraryId = res.data._id;
        await api.delete(`/itinerary/${id}`);
        
        for (let exp of expenses) {
          if (exp.title && exp.amount) {
            await api.post('/addExpense', { ...exp, itineraryId, amount: parseFloat(exp.amount) });
          }
        }
        setSnackbar({ open: true, message: 'Itinerary updated successfully!', severity: 'success' });
      } else {
        const res = await api.post('/itineraries/addItinerary', { 
          title, startDate, endDate, locations, status,
          flightNumber, flightStatus
        });
        itineraryId = res.data._id;
        
        for (let exp of expenses) {
          if (exp.title && exp.amount) {
            await api.post('/addExpense', { ...exp, itineraryId, amount: parseFloat(exp.amount) });
          }
        }
        setSnackbar({ open: true, message: 'Itinerary created successfully!', severity: 'success' });
        resetForm();
      }

      setTimeout(() => {
        navigate('/itineraries');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error saving itinerary', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <GradientBackground>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Container>
      </GradientBackground>
    );
  }

  const steps = ['Basic Info', 'Locations', 'Expenses', 'Review'];

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

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                mb: 1,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            >
              {id ? '✏️ Edit Your Journey' : '✈️ Create New Adventure'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {id ? 'Modify your travel plans' : 'Plan your perfect trip with detailed itineraries'}
            </Typography>
          </Box>
        </Fade>

        <GlassCard>
          <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4, overflowX: 'auto' }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {activeStep === 0 && (
              <Fade in>
                <Box>
                  <SectionHeader>
                    <TitleIcon />
                    <Typography variant="h6">Itinerary Details</Typography>
                  </SectionHeader>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <GradientTextField
                        fullWidth
                        label="Itinerary Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g., Summer Vacation in Bali"
                        InputProps={{
                          startAdornment: <TitleIcon sx={{ mr: 1, color: '#6366f1' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <GradientTextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                        InputProps={{
                          startAdornment: <EventIcon sx={{ mr: 1, color: '#6366f1' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <GradientTextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                        InputProps={{
                          startAdornment: <EventIcon sx={{ mr: 1, color: '#6366f1' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <GradientTextField
                        fullWidth
                        label="Flight Number (Optional)"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                        placeholder="e.g., AA123, DL456"
                        InputProps={{
                          startAdornment: <FlightIcon sx={{ mr: 1, color: '#6366f1' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Flight Status</InputLabel>
                        <Select 
                          value={flightStatus} 
                          onChange={(e) => setFlightStatus(e.target.value)} 
                          label="Flight Status"
                          sx={{ borderRadius: 4 }}
                          disabled={!flightNumber}
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
                          value={status} 
                          onChange={(e) => setStatus(e.target.value)} 
                          label="Payment Status"
                          sx={{ borderRadius: 4 }}
                        >
                          <MenuItem value="unpaid">🟡 Unpaid</MenuItem>
                          <MenuItem value="paid">🟢 Paid</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {flightNumber && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f0fdf4', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FlightTakeoffIcon sx={{ color: '#22c55e' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">Flight {flightNumber}</Typography>
                        <Chip 
                          label={getFlightStatusLabel(flightStatus)} 
                          size="small" 
                          sx={{ bgcolor: getFlightStatusColor(flightStatus), color: 'white', mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <StyledButton variant="contained" onClick={() => setActiveStep(1)}>
                      Next: Locations →
                    </StyledButton>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Step 2: Locations */}
            {activeStep === 1 && (
              <Fade in>
                <Box>
                  <SectionHeader>
                    <LocationOnIcon />
                    <Typography variant="h6">Locations & Activities</Typography>
                    <Chip label="Add your stops" size="small" sx={{ ml: 'auto', bgcolor: '#e0e7ff' }} />
                  </SectionHeader>

                  {locations.map((loc, locIndex) => (
                    <Zoom in key={locIndex} timeout={300}>
                      <LocationCard>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                          <LocationOnIcon sx={{ color: '#6366f1' }} />
                          <GradientTextField 
                            label="Location Name" 
                            value={loc.location} 
                            onChange={(e) => handleLocationChange(locIndex, e.target.value)} 
                            fullWidth 
                            required 
                            placeholder="e.g., Paris, France"
                            size="small"
                          />
                          {locations.length > 1 && (
                            <IconButton color="error" onClick={() => handleRemoveLocation(locIndex)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>

                        {loc.days.map((day, dayIndex) => (
                          <DayCard key={dayIndex}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                              <Chip 
                                icon={<EventIcon />} 
                                label={`Day ${day.day}`} 
                                sx={{ bgcolor: '#6366f1', color: 'white', fontWeight: 600 }}
                              />
                              {loc.days.length > 1 && (
                                <IconButton size="small" color="error" onClick={() => handleRemoveDay(locIndex, dayIndex)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>

                            {day.activities.map((act, actIndex) => (
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
                                    InputProps={{
                                      startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#6366f1', fontSize: 18 }} />,
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                  <TextField 
                                    size="small"
                                    label="Activity" 
                                    value={act.activity} 
                                    onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'activity', e.target.value)} 
                                    fullWidth 
                                    placeholder="e.g., Visit Eiffel Tower"
                                  />
                                </Grid>
                                {day.activities.length > 1 && (
                                  <Grid item xs={12} sm={1}>
                                    <IconButton 
                                      color="error" 
                                      onClick={() => handleRemoveActivity(locIndex, dayIndex, actIndex)}
                                      size="small"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Grid>
                                )}
                              </Grid>
                            ))}
                            <StyledButton 
                              variant="outlined" 
                              size="small" 
                              onClick={() => handleAddActivity(locIndex, dayIndex)}
                              startIcon={<AddIcon />}
                              sx={{ mt: 1 }}
                            >
                              Add Activity
                            </StyledButton>
                          </DayCard>
                        ))}
                        <StyledButton variant="outlined" onClick={() => handleAddDay(locIndex)} startIcon={<AddIcon />} sx={{ mt: 1 }}>
                          Add Day
                        </StyledButton>
                      </LocationCard>
                    </Zoom>
                  ))}
                  
                  <StyledButton variant="contained" onClick={handleAddLocation} startIcon={<AddLocationIcon />} sx={{ mb: 4 }}>
                    Add Location
                  </StyledButton>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <StyledButton variant="outlined" onClick={() => setActiveStep(0)}>
                      ← Back
                    </StyledButton>
                    <StyledButton variant="contained" onClick={() => setActiveStep(2)}>
                      Next: Expenses →
                    </StyledButton>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Step 3: Expenses */}
            {activeStep === 2 && (
              <Fade in>
                <Box>
                  <SectionHeader>
                    <AttachMoneyIcon />
                    <Typography variant="h6">Expenses</Typography>
                    <Chip 
                      label={`Total: ₱${calculateTotalExpenses().toLocaleString()}`} 
                      size="small" 
                      sx={{ ml: 'auto', bgcolor: '#22c55e', color: 'white', fontWeight: 600 }}
                    />
                  </SectionHeader>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    These expenses will automatically appear in your Expenses page
                  </Typography>

                  {expenses.map((exp, index) => (
                    <ExpenseCard key={index}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <TextField 
                            size="small"
                            label="Expense Title" 
                            value={exp.title} 
                            onChange={(e) => handleExpenseChange(index, 'title', e.target.value)} 
                            fullWidth 
                            required 
                            placeholder="e.g., Flight ticket"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField 
                            size="small"
                            label="Amount (₱)" 
                            type="number" 
                            value={exp.amount} 
                            onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)} 
                            fullWidth 
                            required 
                            InputProps={{ startAdornment: <CurrencyExchangeIcon sx={{ mr: 0.5, fontSize: 18 }} /> }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField 
                            size="small"
                            label="Date" 
                            type="date" 
                            value={exp.date ? (exp.date.split('T')[0] || exp.date) : ''} 
                            onChange={(e) => handleExpenseChange(index, 'date', e.target.value)} 
                            fullWidth 
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Paid Status</InputLabel>
                            <Select 
                              value={exp.paid} 
                              onChange={(e) => handleExpenseChange(index, 'paid', e.target.value === 'true')}
                              label="Paid Status"
                            >
                              <MenuItem value={false}><CancelIcon fontSize="small" sx={{ mr: 1, color: '#ef4444' }} /> Unpaid</MenuItem>
                              <MenuItem value={true}><CheckCircleIcon fontSize="small" sx={{ mr: 1, color: '#22c55e' }} /> Paid</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField 
                            size="small"
                            label="Notes" 
                            value={exp.notes} 
                            onChange={(e) => handleExpenseChange(index, 'notes', e.target.value)} 
                            fullWidth 
                            placeholder="Optional"
                          />
                        </Grid>
                      </Grid>
                      {expenses.length > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button size="small" color="error" onClick={() => handleRemoveExpense(index)} startIcon={<DeleteIcon />}>
                            Remove
                          </Button>
                        </Box>
                      )}
                    </ExpenseCard>
                  ))}
                  
                  <StyledButton variant="outlined" onClick={handleAddExpense} startIcon={<AddIcon />} sx={{ mb: 4 }}>
                    Add Expense
                  </StyledButton>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <StyledButton variant="outlined" onClick={() => setActiveStep(1)}>
                      ← Back
                    </StyledButton>
                    <StyledButton variant="contained" onClick={() => setActiveStep(3)}>
                      Next: Review →
                    </StyledButton>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Step 4: Review */}
            {activeStep === 3 && (
              <Fade in>
                <Box>
                  <SectionHeader>
                    <DescriptionIcon />
                    <Typography variant="h6">Review Your Itinerary</Typography>
                  </SectionHeader>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f8fafc' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap">
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="#6366f1">✈️ {title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box>
                            <Chip label={status === 'paid' ? 'Paid' : 'Unpaid'} size="small" sx={{ bgcolor: status === 'paid' ? '#22c55e' : '#f59e0b', color: 'white', mr: 1 }} />
                          </Box>
                        </Box>
                        
                        {flightNumber && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FlightTakeoffIcon sx={{ color: '#6366f1' }} />
                            <Typography variant="body2">
                              <strong>Flight {flightNumber}</strong>
                            </Typography>
                            <Chip 
                              label={getFlightStatusLabel(flightStatus)} 
                              size="small" 
                              sx={{ bgcolor: getFlightStatusColor(flightStatus), color: 'white' }}
                            />
                          </Box>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>📍 Locations ({locations.length})</Typography>
                      {locations.map((loc, idx) => (
                        <Box key={idx} sx={{ mb: 2, pl: 2, borderLeft: '3px solid #6366f1' }}>
                          <Typography variant="body2" fontWeight="600">{loc.location}</Typography>
                          <Typography variant="caption" color="text.secondary">{loc.days.length} days planned</Typography>
                        </Box>
                      ))}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>💰 Expenses ({expenses.length})</Typography>
                      <Typography variant="h6" color="#22c55e" fontWeight="bold">
                        Total: ₱{calculateTotalExpenses().toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <StyledButton variant="outlined" onClick={() => setActiveStep(2)}>
                      ← Back
                    </StyledButton>
                    <StyledButton 
                      type="submit" 
                      variant="contained" 
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{ animation: loading ? 'none' : `${glowPulse} 2s infinite` }}
                    >
                      {loading ? 'Saving...' : (id ? 'Update Itinerary' : 'Create Itinerary')}
                    </StyledButton>
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>
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