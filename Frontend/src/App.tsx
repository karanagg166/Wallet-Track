import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PublicRoute from './routes/public/public';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
       <Route path="/*" element={<PublicRoute />} />

       
      </Routes>
    </Router>
  );
}

export default App;
