import React, { useState } from 'react';
import { Box, TextField, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.helper';


export default function Signup(){
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');
const navigate = useNavigate();


const handle = async ()=>{
try{
await api.post('/auth/register', { name, email, password });
alert('Registered! please login');
navigate('/login');
console.log("User Created", email)
}catch(err){
alert(err.response?.data?.message || 'Register failed');
}
};


return (
<Container maxWidth="sm" sx={{ mt: 10, p:10}}>
<Paper sx={{ p: 3 }}>
<Typography variant="h5">Sign up</Typography>
<Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
<TextField label="Name" value={name} onChange={e=>setName(e.target.value)} />
<TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<Button variant="contained" onClick={handle}>Sign up</Button>
</Box>
</Paper>
</Container>
);
}