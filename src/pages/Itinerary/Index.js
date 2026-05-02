// src/pages/ItinerariesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Skeleton,
  Chip,
  Fade,
  Paper,
  IconButton,
  Tooltip,
  Zoom,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes, styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DeleteIcon from '@mui/icons-material/Delete';
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

// const pulse = keyframes`
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.05);
//   }
//   100% {
//     transform: scale(1);
//   }
// `;

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: 20,
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    '&::after': {
      transform: 'translateX(100%)',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
  color: 'white',
  borderRadius: 12,
  padding: '10px 24px',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: 20,
  textAlign: 'center',
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const getItineraryIcon = (title) => {
  const icons = {
    flight: <FlightIcon />,
    hotel: <HotelIcon />,
    beach: <BeachAccessIcon />,
  };
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('flight') || lowerTitle.includes('plane')) return icons.flight;
  if (lowerTitle.includes('hotel') || lowerTitle.includes('resort')) return icons.hotel;
  if (lowerTitle.includes('beach') || lowerTitle.includes('vacation')) return icons.beach;
  return <ReceiptIcon />;
};

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/itineraries/display');
      setItineraries(res.data);
    } catch (err) {
      console.error('Error fetching itineraries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/itineraries/${id}`);
  };

  const handleCreate = () => {
    navigate('/itineraries/create');
  };

  const handleDeleteItinerary = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this itinerary and all its expenses?")) return;
    try {
      setDeleteLoading(id);
      await api.delete(`/itineraries/${id}`);
      setItineraries(itineraries.filter(it => it._id !== id));
    } catch (err) {
      console.error("Error deleting itinerary:", err);
      alert("Failed to delete itinerary. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const totalExpensesSum = itineraries.reduce((sum, it) => sum + (it.totalExpenses || 0), 0);
  const completedTrips = itineraries.filter(it => new Date(it.endDate) < new Date()).length;
  const upcomingTrips = itineraries.filter(it => new Date(it.startDate) > new Date()).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, animation: `${fadeInUp} 0.5s ease-out` }}>
      {/* Header Section */}
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
          My Travel Itineraries
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Plan, track, and manage all your amazing journeys in one place
        </Typography>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={0}>
              <Typography variant="h3" fontWeight="bold">
                {itineraries.length}
              </Typography>
              <Typography variant="body2">Total Trips</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={0} sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}>
              <Typography variant="h3" fontWeight="bold">
                ₱{totalExpensesSum.toLocaleString()}
              </Typography>
              <Typography variant="body2">Total Spent</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={0} sx={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' }}>
              <Typography variant="h3" fontWeight="bold">
                {upcomingTrips}
              </Typography>
              <Typography variant="body2">Upcoming Trips</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={0} sx={{ background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)' }}>
              <Typography variant="h3" fontWeight="bold">
                {completedTrips}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </StatCard>
          </Grid>
        </Grid>

        {/* Create Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <GradientButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create New Itinerary
          </GradientButton>
        </Box>
      </Box>

      {/* Itineraries Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      ) : itineraries.length === 0 ? (
        <Fade in>
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            }}
          >
            <ReceiptIcon sx={{ fontSize: 80, color: '#c7d2fe', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No itineraries yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start planning your first adventure!
            </Typography>
            <GradientButton variant="contained" onClick={handleCreate}>
              Create Your First Itinerary
            </GradientButton>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {itineraries.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                <StyledCard onClick={() => handleView(item._id)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6366f1',
                        }}
                      >
                        {getItineraryIcon(item.title)}
                      </Box>
                      <Chip
                        label={new Date(item.startDate) > new Date() ? 'Upcoming' : 'Ongoing'}
                        size="small"
                        sx={{
                          bgcolor: new Date(item.startDate) > new Date() ? '#fee2e2' : '#e0e7ff',
                          color: new Date(item.startDate) > new Date() ? '#dc2626' : '#6366f1',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description?.substring(0, 80) || 'No description available'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Start Date
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(item.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          Total Expenses
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="#6366f1">
                          ₱{item.totalExpenses?.toFixed(2) || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(item._id)}
                      sx={{ color: '#6366f1' }}
                    >
                      View Details
                    </Button>
                    <Tooltip title="Delete Itinerary">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleDeleteItinerary(item._id, e)}
                        disabled={deleteLoading === item._id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </StyledCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}