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

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      password: formData.password,
      ...(formData.identifier.includes("@")
        ? { email: formData.identifier }
        : { username: formData.identifier })
    };

    try {
      const res = await axiosInstanceClient.post("/users/login", payload);
      localStorage.setItem("lp", res.data.data.accessToken);
      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Login
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter your credentials to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or Username"
              name="identifier"
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
              Login
            </Button>
          </form>

          <Typography mt={3} textAlign="center">
            Don’t have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

