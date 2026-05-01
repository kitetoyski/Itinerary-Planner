// src/pages/ItinerariesPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.helper';

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await api.get('/itineraries/display');
        setItineraries(res.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };
    fetchItineraries();
  }, []);

  const handleView = (id) => {
    navigate(`/itineraries/${id}`); // pass the ID
  };

  const handleCreate = () => {
    navigate('/itineraries/create');
  };
  const handleDeleteItinerary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary and all its expenses?")) return;
    try {
      await api.delete(`/${id}`);
      setItineraries(itineraries.filter(it => it._id !== id));
    } catch (err) {
      console.error("Error deleting itinerary:", err);
    }
  };
  
  return (
    <Container sx={{ mt: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">My Itineraries</Typography>
        <Button variant="contained" color="primary" onClick={handleCreate}>Create New</Button>

      </Box>

      {itineraries.length === 0 ? (
        <Typography>No itineraries found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {itineraries.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  {/* <Typography variant="body2">{item.description || 'No description'}</Typography> */}
                  <Typography variant="caption" display="block">
                  Total Expenses: ₱{item.totalExpenses?.toFixed(2) || 0} | Date: {new Date(item.startDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleView(item._id)}>View</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
