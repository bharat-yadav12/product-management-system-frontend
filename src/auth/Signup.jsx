import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container
} from "@mui/material";
import { axiosInstanceClient } from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstanceClient.post("/users/register", formData);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Create Account
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Register to manage products securely
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.2 }}
            >
              Sign Up
            </Button>
          </form>

          <Typography mt={3} textAlign="center">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;



// import { useState } from "react";
// import { Box, Button, TextField, Typography, Paper } from "@mui/material";
// import { axiosInstanceClient } from "../api/axiosInstance";
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstanceClient.post("/users/register", formData);
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" mt={8}>
//       <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
//         <Typography variant="h5" mb={2}>
//           Sign Up
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Name"
//             name="name"
//             onChange={handleChange}
//             required
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Email"
//             name="email"
//             onChange={handleChange}
//             required
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Password"
//             name="password"
//             type="password"
//             onChange={handleChange}
//             required
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 2 }}
//           >
//             Sign Up
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default Signup;
