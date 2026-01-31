import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Box } from "@mui/material";

const ImageSlider = ({ images = [], height = 220 }) => {
  if (!images.length) return null;

  return (
    <Box sx={{ width: "100%", height }}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        style={{ height: "100%" }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={img}
              alt={`product-${index}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
export default ImageSlider;