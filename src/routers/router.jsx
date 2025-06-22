import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import PlaceOrder from "../components/PlaceOrder";
import Orders from "../pages/shop/Orders";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProfileFinal from "../pages/dashboard/ProfileFinal";
import TestUpload from "../pages/dashboard/TestUpload";
import SimpleProfileEdit from "../pages/dashboard/SimpleProfileEdit";
import UserDebug from "../pages/dashboard/UserDebug";
import ErrorPage from "../components/ErrorPage";
// Import admin components
import AdminList from "../pages/admin/List";
import AdminOrders from "../pages/admin/Orders";
import AdminAdd from "../pages/admin/Add";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      errorElement: <ErrorPage />,
      children: [
        {path: "/", element: <Home/>},
        {path: "/categories/:categoryName", element: <CategoryPage/>},
        {path: "/search", element: <Search/>},
        {path: "/shop", element: <ShopPage/>},
        {path: "/shop/:_id", element: <SingleProduct/>},
        {path: "/place-order", element: <PlaceOrder /> },
        {path: "/orders", element: <Orders />},
        { path: "/dashboard/order", element: <Orders /> },  
        { path: "/dashboard/profile", element: <ProfileFinal /> },
        { path: "/dashboard/simple-profile", element: <SimpleProfileEdit /> },
        { path: "/dashboard/test-upload", element: <TestUpload /> },
        { path: "/dashboard/debug", element: <UserDebug /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        
        /* Admin routes */
        { path: "/list-items", element: <AdminList /> },
        { path: "/orders-admin", element: <AdminOrders /> },
        { path: "/add", element: <AdminAdd /> }
      ]
    },

    {
      path: "/login",
      element: <Login/>
    },

    {
      path: "/register",
      element: <Register/>
    }
]);

export default router;