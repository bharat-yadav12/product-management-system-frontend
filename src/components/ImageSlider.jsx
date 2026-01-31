import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const ImageSlider = ({ images = [] }) => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (images.length > 0) {
      setSelected(images[0]);
    }
  }, [images]);

  if (!images.length) return null;

  return (
    <Box>
      <Box
        component="img"
        src={selected}
        sx={{
          width: "100%",
          height: 350,
          objectFit: "contain",
          border: "1px solid #ddd"
        }}
      />

      <Box display="flex" gap={1} mt={2}>
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            onClick={() => setSelected(img)}
            sx={{
              width: 70,
              height: 70,
              objectFit: "contain",
              border: selected === img ? "2px solid blue" : "1px solid #ccc",
              cursor: "pointer"
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageSlider;