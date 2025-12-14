import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/products' element={<PrivateRoute element={<ProductList />} />} />
        <Route path='/checkout' element={<PrivateRoute element={<CheckoutPage />} />} />
        <Route path='/my-orders' element={<PrivateRoute element={<MyOrders />} />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;