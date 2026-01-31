import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Stack
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { axiosInstanceClient } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    metaTitle: "",
    price: "",
    discountedPrice: "",
    description: ""
  });

  const [images, setImages] = useState([]); // array of File objects
  const [previewUrls, setPreviewUrls] = useState([]); // array of object URLs for display

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ────────────────────────────────────────────────
  //                   VALIDATION
  // ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = "Meta title is required";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (
      formData.discountedPrice &&
      Number(formData.discountedPrice) >= Number(formData.price)
    ) {
      newErrors.discountedPrice = "Discounted price must be less than price";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ────────────────────────────────────────────────
  //                  HANDLE IMAGE CHANGE
  // ────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Optional: you can add file type / size validation here
    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length === 0) return;

    // Create preview URLs
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));

    // Append to existing images
    setImages((prev) => [...prev, ...validImages]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // ────────────────────────────────────────────────
  //                   REMOVE IMAGE
  // ────────────────────────────────────────────────
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ────────────────────────────────────────────────
  //                      SUBMIT
  // ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append all images (field name must match backend multer config)
      images.forEach((file) => {
        data.append("images", file); // "images" ← should match your multer .array("images")
      });

      await axiosInstanceClient.post("/products", data);

      // Clean up object URLs
      previewUrls.forEach(URL.revokeObjectURL);

      navigate("/products");
    } catch (err) {
      console.error("Product creation failed:", err);
      // You can show error message to user here (snackbar / alert)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Product Name"
          margin="normal"
          value={formData.productName}
          onChange={(e) =>
            setFormData({ ...formData, productName: e.target.value })
          }
          error={!!errors.productName}
          helperText={errors.productName}
        />

        <TextField
          fullWidth
          label="Meta Title"
          margin="normal"
          value={formData.metaTitle}
          onChange={(e) =>
            setFormData({ ...formData, metaTitle: e.target.value })
          }
          error={!!errors.metaTitle}
          helperText={errors.metaTitle}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            type="number"
            label="Price (₹)"
            margin="normal"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{ min: 1, step: 0.01 }}
          />

          <TextField
            fullWidth
            type="number"
            label="Discounted Price (optional)"
            margin="normal"
            value={formData.discountedPrice}
            onChange={(e) =>
              setFormData({ ...formData, discountedPrice: e.target.value })
            }
            error={!!errors.discountedPrice}
            helperText={errors.discountedPrice}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Stack>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          margin="normal"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          error={!!errors.description}
          helperText={errors.description}
        />

        {/* ────── Image Upload Section ────── */}
        <Box mt={3}>
          <Button variant="outlined" component="label" color="primary">
            Upload Product Images
            <input
              hidden
              multiple
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
          </Button>

          {errors.images && (
            <Typography color="error" variant="caption" mt={1} display="block">
              {errors.images}
            </Typography>
          )}

          {/* Image Previews + Remove buttons */}
          {previewUrls.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Images ({previewUrls.length})
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1
                }}
              >
                {previewUrls.map((url, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`preview-${index}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#ffebee" }
                      }}
                      onClick={() => removeImage(index)}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 4 }}
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </Box>
  );
};

export default AddProduct;