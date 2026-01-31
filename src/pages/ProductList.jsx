import { useEffect, useState } from "react";
import { axiosInstanceClient } from "../api/axiosInstance.js";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";
import { Link } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstanceClient
      .fetch("/products")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Grid container spacing={3} padding={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card
            component={Link}
            to={`/products/${product._id}`}
            sx={{
              textDecoration: "none",
              height: "100%",
              transition: "0.3s",
              "&:hover": { boxShadow: 6 }
            }}
          >
            {/* ✅ IMAGE SLIDER */}
            <ImageSlider
              images={product.galleryImages}
              height={200}
            />

            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {product.productName}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" color="primary">
                  ₹{product.discountedPrice || product.price}
                </Typography>

                {product.discountedPrice && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray"
                    }}
                  >
                    ₹{product.price}
                  </Typography>
                )}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
                dangerouslySetInnerHTML={{
                  __html: product.description
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={1}
              >
                Sold by: {product.createdBy?.username}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;


// import { useEffect, useState } from "react";
// import { axiosInstanceClient } from "../api/axiosInstance.js";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   CardMedia,
//   Box
// } from "@mui/material";
// import { Link } from "react-router-dom";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axiosInstanceClient.fetch("/products")
//       .then((res) => setProducts(res.data.data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <Grid container spacing={3} padding={3}>
//       {products.map((product) => (
//         <Grid item xs={12} sm={6} md={4} key={product._id}>
//           <Card
//             component={Link}
//             to={`/products/${product._id}`}
//             sx={{
//               textDecoration: "none",
//               height: "100%",
//               transition: "0.3s",
//               "&:hover": { boxShadow: 6 }
//             }}
//           >
//             <CardMedia
//               component="img"
//               height="220"
//               image={product.galleryImages?.[0]}
//               alt={product.productName}
//               sx={{ objectFit: "contain", padding: 2 }}
//             />
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 {product.productName}
//               </Typography>
//               <Box display="flex" alignItems="center" gap={1}>
//                 <Typography variant="h6" color="primary">
//                   ₹{product.discountedPrice}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{ textDecoration: "line-through", color: "gray" }}
//                 >
//                   ₹{product.price}
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{
//                   mt: 1,
//                   display: "-webkit-box",
//                   WebkitLineClamp: 2,
//                   WebkitBoxOrient: "vertical",
//                   overflow: "hidden"
//                 }}
//                 dangerouslySetInnerHTML={{ __html: product.description }}
//               />
//               <Typography variant="caption" color="text.secondary" display="block" mt={1}>
//                 Sold by: {product.createdBy?.username}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default ProductList;