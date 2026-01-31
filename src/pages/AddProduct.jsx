import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { axiosInstanceClient } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    productName: "",
    metaTitle: "",
    price: "",
    discountedPrice: "",
    description: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await axiosInstanceClient.post("/products", data);
    navigate("/products");
  };

  return (
    <Box p={4}>
      <form onSubmit={submit}>
        <TextField fullWidth label="Product Name" margin="normal"
          onChange={(e) => setData({ ...data, productName: e.target.value })}
        />
        <TextField fullWidth label="Meta Title" margin="normal"
          onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
        />
        <TextField fullWidth label="Price" margin="normal"
          onChange={(e) => setData({ ...data, price: e.target.value })}
        />
        <TextField fullWidth label="Discounted Price" margin="normal"
          onChange={(e) => setData({ ...data, discountedPrice: e.target.value })}
        />
        <TextField fullWidth multiline rows={4} label="Description" margin="normal"
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        <Button type="submit" variant="contained">
          Add Product
        </Button>
      </form>
    </Box>
  );
};
export default AddProduct;