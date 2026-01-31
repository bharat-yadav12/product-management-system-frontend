import { Routes,Route } from "react-router-dom";
import Login from "../auth/Login.jsx";
import Signup from "../auth/Signup.jsx";
import ProductList from "../pages/ProductList.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import AddProduct from "../pages/AddProduct.jsx";
//import EditProduct from "../pages/EditProduct.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import Home from "../pages/Home.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* <Route path="/products/add" element={<AddProduct />} /> */}
        <Route path="/add-product" element={<AddProduct />} />
        {/* <Route path="/edit-product/:id" element={<EditProduct />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;