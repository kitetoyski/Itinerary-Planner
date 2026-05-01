// import { useEffect, useState } from "react";
// import api from "../../api/api.helper";
// import Container from '@mui/material/Container';
// import { useSelector } from 'react-redux';

// import Typography from "@mui/material/Typography";

// export default function Home() {
//   const [message, setMessage] = useState("Loading...");
//   const { isLoggedIn, user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     api.get("/test")
//       .then(res => setMessage(res.data.message))
//       .catch(err => setMessage("Error connecting to backend"));
//   }, []);
//   // const handleAnimationComplete = () => {
//   //   console.log('All letters have animated!');
//   // };
//   return (
//     <Container>
//  {isLoggedIn &&  (
//         <Typography sx={{ fontWeight: 'bold' }}>
//           Welcome, {localStorage.getItem("user")}! 
//         </Typography>
//       )}    </Container>
   
//   );
// }
