import { Route, Routes } from 'react-router-dom';
import Home from '../../pages/home.tsx';
import Login from '../../pages/login.tsx';
import Signup from '../../pages/signup';
import About from '../../pages/about';

const PublicRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default PublicRoute;
