// src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../../api/api.helper";
import Container from '@mui/material/Container';
import { useSelector } from 'react-redux';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
    animation: `${float} 20s ease-in-out infinite`,
    top: '-50%',
    left: '-50%',
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 24,
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
}));

const UpcomingTripCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 20,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  animation: `${fadeInUp} 0.5s ease-out`,
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'scale(1.02)',
  },
}));

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

// Function to get all locations as a string
const getLocationsString = (locations) => {
  if (!locations || locations.length === 0) return 'No locations';
  if (locations.length === 1) return locations[0].location;
  return `${locations[0].location} +${locations.length - 1} more`;
};

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const [itineraries, setItineraries] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const userName = user?.name || localStorage.getItem("user") || "Guest";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testRes, itinerariesRes] = await Promise.all([
          api.get("/test"),
          api.get("/itineraries/display")
        ]);
        
        setMessage(testRes.data.message);
        setItineraries(itinerariesRes.data);
        
        // Filter upcoming trips (start date >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = itinerariesRes.data.filter(
          itinerary => new Date(itinerary.startDate) >= today
        ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        
        setUpcomingTrips(upcoming);
      } catch (err) {
        console.error('Error fetching data:', err);
        setMessage("Error connecting to backend");
        // Sample data for demo with proper dates
        const today = new Date();
        const sampleItineraries = [
          {
            _id: '1',
            title: 'Bali Adventure',
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString(),
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString(),
            flightNumber: 'GA123',
            flightStatus: 'on-time',
            status: 'paid',
            totalExpenses: 1250,
            locations: [{ location: 'Bali, Indonesia' }, { location: 'Jakarta, Indonesia' }]
          },
          {
            _id: '2',
            title: 'Paris Getaway',
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30).toISOString(),
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 37).toISOString(),
            flightNumber: 'AF456',
            flightStatus: 'scheduled',
            status: 'unpaid',
            totalExpenses: 2500,
            locations: [{ location: 'Paris, France' }, { location: 'Lyon, France' }, { location: 'Nice, France' }]
          },
          {
            _id: '3',
            title: 'Tokyo Discovery',
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString(),
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
            flightNumber: 'JL789',
            flightStatus: 'departed',
            status: 'paid',
            totalExpenses: 1800,
            locations: [{ location: 'Tokyo, Japan' }]
          }
        ];
        setItineraries(sampleItineraries);
        const upcoming = sampleItineraries.filter(
          itinerary => new Date(itinerary.startDate) >= today
        );
        setUpcomingTrips(upcoming);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Convert itineraries to calendar events with location information
  const calendarEvents = itineraries.map(itinerary => ({
    id: itinerary._id,
    title: itinerary.title,
    start: new Date(itinerary.startDate),
    end: new Date(itinerary.endDate),
    allDay: true,
    resource: itinerary,
  }));

  const totalExpenses = itineraries.reduce((sum, it) => sum + (it.totalExpenses || 0), 0);
  const totalTrips = itineraries.length;
  const completedTrips = itineraries.filter(it => new Date(it.endDate) < new Date()).length;

  // Custom event component for calendar
  const CustomEvent = ({ event }) => {
    const itinerary = event.resource;
    return (
      <Box 
        sx={{ 
          p: 1, 
          bgcolor: '#6366f1', 
          borderRadius: 2, 
          color: 'white', 
          fontSize: '0.75rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#4f46e5',
          }
        }}
      >
        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
          ✈️ {event.title}
        </Typography>
        {itinerary.locations && itinerary.locations.length > 0 && (
          <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.9 }}>
            📍 {getLocationsString(itinerary.locations)}
          </Typography>
        )}
        {itinerary.flightNumber && (
          <Chip 
            label={getFlightStatusLabel(itinerary.flightStatus)} 
            size="small" 
            sx={{ 
              mt: 0.5, 
              bgcolor: getFlightStatusColor(itinerary.flightStatus), 
              color: 'white', 
              height: 18, 
              fontSize: '0.6rem',
              '& .MuiChip-label': { fontSize: '0.6rem', px: 1 }
            }}
          />
        )}
      </Box>
    );
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <GradientBackground>
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              background: `rgba(255, 255, 255, ${Math.random() * 0.3})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${float} ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip
            label="✨ Travel Management Dashboard"
            sx={{
              mb: 2,
              background: 'rgba(99, 102, 241, 0.2)',
              color: 'white',
              borderColor: '#6366f1',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
            variant="outlined"
          />
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 1,
            }}
          >
            {isLoggedIn ? `Welcome back, ${userName}!` : 'Plan Your Perfect Journey'}
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            {isLoggedIn 
              ? "Track your itineraries, manage expenses, and stay on top of your travel plans."
              : "Experience the next generation of travel planning with stunning animations and modern design."}
          </Typography>
        </Box>

        {isLoggedIn && (
          <>
            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Typography variant="h3" fontWeight="bold">{totalTrips}</Typography>
                  <Typography variant="body2">Total Trips</Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Typography variant="h3" fontWeight="bold">₱{totalExpenses.toLocaleString()}</Typography>
                  <Typography variant="body2">Total Spent</Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Typography variant="h3" fontWeight="bold">{upcomingTrips.length}</Typography>
                  <Typography variant="body2">Upcoming Trips</Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Typography variant="h3" fontWeight="bold">{completedTrips}</Typography>
                  <Typography variant="body2">Completed</Typography>
                </StatCard>
              </Grid>
            </Grid>

            {/* Calendar and Upcoming Trips Row */}
            <Grid container spacing={4}>
              {/* Calendar View */}
              <Grid item xs={12} md={8}>
                <GlassCard>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
                    <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ color: '#6366f1' }} />
                      Trip Calendar
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center">
                      <IconButton size="small" onClick={handlePreviousMonth}>
                        <ChevronLeftIcon />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 120, textAlign: 'center' }}>
                        {format(currentDate, 'MMMM yyyy')}
                      </Typography>
                      <IconButton size="small" onClick={handleNextMonth}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ height: 550 }}>
                    <Calendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: '100%' }}
                      views={['month']}
                      date={currentDate}
                      onNavigate={setCurrentDate}
                      components={{
                        event: CustomEvent,
                      }}
                      tooltipAccessor={(event) => {
                        const itinerary = event.resource;
                        return `${itinerary.title}\n${getLocationsString(itinerary.locations)}\n${itinerary.flightNumber ? `Flight: ${itinerary.flightNumber}` : ''}`;
                      }}
                    />
                  </Box>
                </GlassCard>
              </Grid>

              {/* Upcoming Trips */}
              <Grid item xs={12} md={4}>
                <GlassCard>
                  <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FlightTakeoffIcon sx={{ color: '#6366f1' }} />
                    Upcoming Trips
                  </Typography>

                  {loading ? (
                    <Typography>Loading trips...</Typography>
                  ) : upcomingTrips.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={4}>
                      No upcoming trips. Start planning your next adventure!
                    </Typography>
                  ) : (
                    upcomingTrips.map((trip) => (
                      <UpcomingTripCard key={trip._id}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {trip.title}
                          </Typography>
                          <Chip 
                            label={trip.status === 'paid' ? 'Paid' : 'Unpaid'} 
                            size="small" 
                            sx={{ bgcolor: trip.status === 'paid' ? '#22c55e' : '#f59e0b', color: 'white' }}
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <EventIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <LocationOnIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {getLocationsString(trip.locations)}
                          </Typography>
                        </Box>
                        
                        {trip.flightNumber && (
                          <Box display="flex" alignItems="center" gap={1} mt={1} pt={1} borderTop="1px solid rgba(255,255,255,0.2)">
                            <FlightTakeoffIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              Flight {trip.flightNumber}
                            </Typography>
                            <Chip 
                              label={getFlightStatusLabel(trip.flightStatus)} 
                              size="small" 
                              sx={{ bgcolor: getFlightStatusColor(trip.flightStatus), color: 'white', height: 20, fontSize: '0.65rem' }}
                            />
                          </Box>
                        )}
                        
                        {trip.totalExpenses > 0 && (
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <AttachMoneyIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              ₱{trip.totalExpenses.toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                      </UpcomingTripCard>
                    ))
                  )}
                </GlassCard>
              </Grid>
            </Grid>
          </>
        )}

        {/* Footer */}
        <Box sx={{ mt: 5, textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
          <Typography variant="body2">
            © 2024 Travel Planner. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            Backend Status: {message}
          </Typography>
        </Box>
      </Container>
    </GradientBackground>
  );
}