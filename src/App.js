import './App.css';
import Navbar from './components/navbar/navbar';
import Home from './pages/Home/home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import Signup from './pages/Login/signup';
import ItinerariesPage from './pages/Itinerary/Index';
import ItineraryForm from './pages/Itinerary/Form';
import ItineraryView from './pages/Itinerary/View';
import ExpensePage from './pages/Expenses/View';

function App() {
  return (
    <>
      <Router>
        <header>
          <Navbar />
        </header>
        <main>
          <div style={{ marginTop: '64px' }} /> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/itineraries" element={<ItinerariesPage />} />
            <Route path="/itineraries/create" element={<ItineraryForm />} />
            <Route path="/itineraries/:id" element={<ItineraryView />} />
            <Route path="/expenses" element={<ExpensePage />} />

          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
