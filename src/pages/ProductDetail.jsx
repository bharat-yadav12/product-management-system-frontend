import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstanceClient } from "../api/axiosInstance.js";
import ImageSlider from "../components/ImageSlider";
import { Typography } from "@mui/material";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axiosInstanceClient
      .fetch(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {product.productName}
      </Typography>

      {/* ✅ galleryImages as per API */}
      <ImageSlider images={product.galleryImages} />

      {/* API sends HTML */}
      <Typography
        mt={2}
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </>
  );
};
export default ProductDetail;