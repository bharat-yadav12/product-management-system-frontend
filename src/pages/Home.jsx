import { Box, Typography, Container } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        minHeight="80vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Product Management System
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth={600}
        >
          A secure and modern platform to manage products with authentication,validation.
        </Typography>
      </Box>
    </Container>
  );
};
export default Home;