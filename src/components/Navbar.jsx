import { AppBar, Toolbar, Button, Box, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { axiosInstanceClient } from "../api/axiosInstance.js";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = async () => {
  try {
    await axiosInstanceClient.post("/users/logout");
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    localStorage.removeItem("lp"); // access token
    navigate("/login");
  }
};

  return (
    <AppBar position="sticky" sx={{ width: "100%" }}>
      <Container maxWidth={false}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Button color="inherit" component={Link} to="/">
              ProductMS
            </Button>

            {isAuthenticated() && (
              <>
                <Button color="inherit" component={Link} to="/products">
                  Products
                </Button>
                <Button color="inherit" component={Link} to="/add-product">
                  Add Product
                </Button>
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {isAuthenticated() ? (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/signup"
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;