// src/pages/ItineraryForm.jsx
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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/api.helper';

export default function ItineraryForm() {
  const { id } = useParams(); // edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locations, setLocations] = useState([
    { location: '', days: [{ day: 1, activities: [{ time: '', activity: '' }] }] },
  ]);
  const [expenses, setExpenses] = useState([{ title: '', amount: '', date: '', paid: false, notes: '' }]);
  const [status, setStatus] = useState('unpaid');

  // Fetch existing itinerary for edit
  useEffect(() => {
    if (id) {
      const fetchItinerary = async () => {
        try {
          const res = await axios.get(`/api/itineraries/${id}`);
          const data = res.data;
          setTitle(data.title);
          setStartDate(data.startDate.split('T')[0]);
          setEndDate(data.endDate.split('T')[0]);
          setLocations(
            data.locations.length
              ? data.locations
              : [{ location: '', days: [{ day: 1, activities: [{ time: '', activity: '' }] }] }]
          );
          setStatus(data.status || 'unpaid');

          // Fetch related expenses
          const expRes = await axios.get(`/api/expenses/itinerary/${id}`);
          setExpenses(expRes.data.length ? expRes.data : [{ title: '', amount: '', date: '', paid: false, notes: '' }]);
        } catch (err) {
          console.error(err);
        }
      };
      fetchItinerary();
    }
  }, [id]);

  // --- Location / Day / Activity Handlers ---
  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index].location = value;
    setLocations(newLocations);
  };
  const handleAddLocation = () =>
    setLocations([...locations, { location: '', days: [{ day: 1, activities: [{ time: '', activity: '' }] }] }]);
  const handleRemoveLocation = (index) => setLocations(locations.filter((_, i) => i !== index));

  const handleDayChange = (locIndex, dayIndex, field, value) => {
    const newLocations = [...locations];
    newLocations[locIndex].days[dayIndex][field] = value;
    setLocations(newLocations);
  };
  const handleAddDay = (locIndex) => {
    const newLocations = [...locations];
    const nextDay = newLocations[locIndex].days.length + 1;
    newLocations[locIndex].days.push({ day: nextDay, activities: [{ time: '', activity: '' }] });
    setLocations(newLocations);
  };
  const handleRemoveDay = (locIndex, dayIndex) => {
    const newLocations = [...locations];
    newLocations[locIndex].days = newLocations[locIndex].days.filter((_, i) => i !== dayIndex);
    setLocations(newLocations);
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
    newLocations[locIndex].days[dayIndex].activities = newLocations[locIndex].days[dayIndex].activities.filter(
      (_, i) => i !== actIndex
    );
    setLocations(newLocations);
  };

  // --- Expense Handlers ---
  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };
  const handleAddExpense = () =>
    setExpenses([...expenses, { title: '', amount: '', date: '', paid: false, notes: '' }]);
  const handleRemoveExpense = (index) => setExpenses(expenses.filter((_, i) => i !== index));

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let itineraryId;

      if (id) {
        // Update itinerary
        const res = await api.put(`/api/itineraries/${id}`, { title, startDate, endDate, locations, status });
        itineraryId = res.data._id;
      } else {
        // Create itinerary
        const res = await api.post('/itineraries/addItinerary', { title, startDate, endDate, locations, status });
        itineraryId = res.data._id;
        alert("added")
        console.log("ID", res.data._id)
      }

      // Save expenses
      for (let exp of expenses) {
        if (id) {
          // For edit, update existing if _id exists
          if (exp._id) {
            await api.put(`/api/expenses/${exp._id}`, { ...exp, itineraryId });
          } else {
            await api.post('/api/expenses/addExpense', { ...exp, itineraryId });
          }
        } else {
          await api.post('/api/expenses/addExpense', { ...exp, itineraryId });
        }
      }

      navigate('/itineraries');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {id ? 'Edit Itinerary' : 'Create New Itinerary'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} required />

        {/* Dates */}
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ mb: 4 }}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* Status */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </Select>
        </FormControl>

        {/* Locations / Days / Activities */}
        <Typography variant="h6" mb={2}>Locations</Typography>
        {locations.map((loc, locIndex) => (
          <Paper key={locIndex} sx={{ p: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField label="Location" value={loc.location} onChange={(e) => handleLocationChange(locIndex, e.target.value)} fullWidth required />
              {locations.length > 1 && <Button color="error" onClick={() => handleRemoveLocation(locIndex)}>Remove</Button>}
            </Box>

            {loc.days.map((day, dayIndex) => (
              <Paper key={dayIndex} sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold" flexGrow={1}>Day {day.day}</Typography>
                  {loc.days.length > 1 && <Button color="error" onClick={() => handleRemoveDay(locIndex, dayIndex)}>Remove</Button>}
                </Box>

                {day.activities.map((act, actIndex) => (
                  <Grid container spacing={2} alignItems="center" key={actIndex} mb={1}>
                    <Grid item xs={12} sm={3}>
                      <TextField label="Time" type="time" value={act.time} onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'time', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField label="Activity" value={act.activity} onChange={(e) => handleActivityChange(locIndex, dayIndex, actIndex, 'activity', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      {day.activities.length > 1 && <Button color="error" onClick={() => handleRemoveActivity(locIndex, dayIndex, actIndex)}>Remove</Button>}
                    </Grid>
                  </Grid>
                ))}
                <Button variant="outlined" onClick={() => handleAddActivity(locIndex, dayIndex)}>Add Activity</Button>
              </Paper>
            ))}
            <Button variant="outlined" onClick={() => handleAddDay(locIndex)}>Add Day</Button>
          </Paper>
        ))}
        <Button variant="outlined" onClick={handleAddLocation} sx={{ mb: 4 }}>Add Location</Button>

        {/* Expenses */}
        <Typography variant="h6" mb={2}>Expenses</Typography>
        {expenses.map((exp, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: '#f3f3f3' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField label="Title" value={exp.title} onChange={(e) => handleExpenseChange(index, 'title', e.target.value)} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label="Amount" type="number" value={exp.amount} onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Date" type="date" value={exp.date ? exp.date.split('T')[0] : ''} onChange={(e) => handleExpenseChange(index, 'date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Paid</InputLabel>
                  <Select value={exp.paid} onChange={(e) => handleExpenseChange(index, 'paid', e.target.value === 'true')}>
                    <MenuItem value={true}>Paid</MenuItem>
                    <MenuItem value={false}>Unpaid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label="Notes" value={exp.notes} onChange={(e) => handleExpenseChange(index, 'notes', e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12}>
                {expenses.length > 1 && <Button color="error" onClick={() => handleRemoveExpense(index)}>Remove</Button>}
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Button variant="outlined" onClick={handleAddExpense} sx={{ mb: 4 }}>Add Expense</Button>

        {/* Form Actions */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/itineraries')}>Cancel</Button>
          <Button variant="contained" color="primary" type="submit">Save Itinerary</Button>
        </Box>
      </Box>
    </Container>
  );
}
