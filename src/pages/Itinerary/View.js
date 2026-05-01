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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/api.helper';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: 0 });

  // Fetch itinerary and expenses
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await api.get(`/itineraries/${id}`);
        setItinerary(res.data);
      } catch (err) {
        console.error('Error fetching itinerary:', err);
      }
    };

    const fetchExpenses = async () => {
      try {
        const res = await api.get(`/${id}`);
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };

    fetchItinerary();
    fetchExpenses();
  }, [id]);

  if (!itinerary) return <Typography>Loading...</Typography>;

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
      { location: '', days: [{ day: 1, activities: [{ time: '', activity: '' }] }] },
    ];
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleRemoveLocation = (index) => {
    const newLocations = itinerary.locations.filter((_, i) => i !== index);
    setItinerary({ ...itinerary, locations: newLocations });
  };

  const handleDayChange = (locIndex, dayIndex, field, value) => {
    const newLocations = [...itinerary.locations];
    newLocations[locIndex].days[dayIndex][field] = value;
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
  const handleDeleteItinerary = async () => {
    if (!window.confirm("Delete this itinerary and all its expenses?")) return;
  
    try {
      await api.delete(`/itineraries/${itinerary._id}`);
      navigate("/itineraries");
    } catch (err) {
      console.error("Error deleting itinerary:", err);
    }
  };
  
  
  

  // --- Save itinerary ---
  const handleSaveItinerary = async () => {
    try {
      const payload = {
        ...itinerary,
        startDate: new Date(itinerary.startDate),
        endDate: new Date(itinerary.endDate),
      };
      const res = await api.put(`/itineraries/${id}`, payload);
      setItinerary(res.data);
      alert('Itinerary saved!');
    } catch (err) {
      console.error('Error saving itinerary:', err);
      alert('Error saving itinerary. Check console.');
    }
  };

  // --- Expenses ---
  const handleAddExpense = async () => {
    try {
      const res = await api.post(`/addExpense`, { ...newExpense, itineraryId: id });
      setExpenses([...expenses, res.data]);
      setNewExpense({ title: '', amount: 0 });
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/delete/${expenseId}`);
      setExpenses(expenses.filter(exp => exp._id !== expenseId));
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense. Check console.");
    }
  };
  
  const togglePaid = async (expenseId) => {
    try {
      const res = await api.patch(`/toggle/${expenseId}`);
      setExpenses(expenses.map(exp => exp._id === expenseId ? res.data : exp));
    } catch (err) {
      console.error('Error toggling paid status:', err);
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Box display="flex" justifyContent='space-around' mb={2}>
        <Button 
        variant="outlined" 
        onClick={() => navigate('/itineraries')}
        sx={{ml:2}}
        >
            Back
            </Button>

        <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSaveItinerary}>
            Save Itinerary
            </Button>

        <Button  
        variant="contained" 
        color="error" onClick={() => handleDeleteItinerary(itinerary._id)}>
            Delete
            </Button>

      </Box>

      {/* Itinerary info */}
      <TextField
        label="Title"
        value={itinerary.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Start Date"
          type="date"
          value={itinerary.startDate.split('T')[0]}
          onChange={(e) => handleFieldChange('startDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={itinerary.endDate.split('T')[0]}
          onChange={(e) => handleFieldChange('endDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={itinerary.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Locations */}
      <Box mt={3}>
        <Typography variant="h5" mb={2}>Locations</Typography>
        {itinerary.locations.map((loc, locIndex) => (
          <Paper key={locIndex} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Location"
                value={loc.location}
                onChange={(e) => handleLocationChange(locIndex, e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <IconButton color="error" onClick={() => handleRemoveLocation(locIndex)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {loc.days.map((day, dayIndex) => (
              <Paper key={dayIndex} sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography fontWeight="bold" flexGrow={1}>Day {day.day}</Typography>
                  <IconButton color="error" onClick={() => handleRemoveDay(locIndex, dayIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {day.activities.map((act, actIndex) => (
                  <Grid container spacing={2} alignItems="center" key={actIndex} mb={1}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Time"
                        type="time"
                        value={act.time}
                        onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'time', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label="Activity"
                        value={act.activity}
                        onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'activity', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton color="error" onClick={() => handleRemoveActivity(locIndex, dayIndex, actIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                <Button variant="outlined" onClick={() => handleAddActivity(locIndex, dayIndex)}>Add Activity</Button>
              </Paper>
            ))}

            <Button variant="outlined" onClick={() => handleAddDay(locIndex)}>Add Day</Button>
          </Paper>
        ))}
        <Button variant="outlined" onClick={handleAddLocation}>Add Location</Button>
      </Box>

      {/* Expenses */}
      <Box mt={4}>
        <Typography variant="h5" mb={2}>Expenses</Typography>

        {/* Total */}
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Total: Php {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </Typography>

        {expenses.map(exp => (
          <Paper key={exp._id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{exp.title} - Php{exp.amount.toFixed(2)}</div>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Paid</Typography>
              <Switch checked={exp.paid} onChange={() => togglePaid(exp._id)} />
              <IconButton color="error" onClick={() => deleteExpense(exp._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}

        <Box mt={2} display="flex" gap={2}>
          <TextField
            label="Title"
            value={newExpense.title}
            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
          />
          <TextField
            label="Amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
          />
          <Button variant="contained" onClick={handleAddExpense}>Add Expense</Button>
        </Box>
      </Box>
    </Container>
  );
}
