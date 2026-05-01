import React, { useState } from 'react';
import { Box, TextField, Button, Container, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.helper';
import { login } from '../../controller/reducer/reducer';
import { useDispatch } from 'react-redux';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      alert('Welcome!');
      console.log("logged in", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log(res.data.user)
        dispatch(login(res.data.user));
        localStorage.setItem("user", email);

      }

      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login Failed');
      console.error("Login error:", err);
      console.log(err.response.data);

    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, p: 10 }}>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5">Login</Typography>

        <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button variant="contained" onClick={handleLogin}>Login</Button>

          <Typography>No account yet?</Typography>
          <Link href="/signup">Sign up</Link>
        </Box>
      </Paper>
    </Container>
  );
}
