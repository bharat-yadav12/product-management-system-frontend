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

/* ------------------ slug helper ------------------ */
const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    metaTitle: "",
    price: "",
    discountedPrice: "",
    description: ""
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ------------------ validation ------------------ */
  const validate = () => {
    const newErrors = {};

    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";

    if (!formData.metaTitle.trim())
      newErrors.metaTitle = "Meta title is required";

    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";

    if (
      formData.discountedPrice &&
      Number(formData.discountedPrice) >= Number(formData.price)
    )
      newErrors.discountedPrice =
        "Discounted price must be less than price";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------ image handling ------------------ */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );

    const previews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  /* ------------------ submit ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("metaTitle", formData.metaTitle);
      data.append("slug", generateSlug(formData.productName));
      data.append("price", Number(formData.price));
      data.append(
        "discountedPrice",
        formData.discountedPrice
          ? Number(formData.discountedPrice)
          : ""
      );
      data.append("description", formData.description);

      images.forEach((file) => {
        data.append("galleryImages", file); // MUST match multer.array("images")
      });

      await axiosInstanceClient.post("/products", data);

      previewUrls.forEach(URL.revokeObjectURL);
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
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
            label="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={!!errors.price}
            helperText={errors.price}
          />

          <TextField
            fullWidth
            type="number"
            label="Discounted Price"
            value={formData.discountedPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountedPrice: e.target.value
              })
            }
            error={!!errors.discountedPrice}
            helperText={errors.discountedPrice}
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

        <Box mt={3}>
          <Button variant="outlined" component="label">
            Upload Images
            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {errors.images && (
            <Typography color="error" variant="caption" display="block">
              {errors.images}
            </Typography>
          )}

          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            {previewUrls.map((url, i) => (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  border: "1px solid #ddd"
                }}
              >
                <img
                  src={url}
                  alt="preview"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => removeImage(i)}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </Box>
  );
};

export default AddProduct;
