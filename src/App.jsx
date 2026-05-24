import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCart } from './redux/features/cart/cartSlice';
import { fetchWishlist } from './redux/features/wishlist/wishlistSlice';

function App() {

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {

    if (user) {

      dispatch(fetchCart());

      dispatch(fetchWishlist());
    }

  }, [dispatch, user]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

export default App;