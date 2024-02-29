
// App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import CsvUploadPage from './pages/CsvUploadPage';
import PropiedadesFiltradasPage from './pages/propiedadesFIltro';
import PrivateRoute from './components/privateRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';



function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username] = useState('');

  const handleLogin = (token) => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    // Otras operaciones de cierre de sesión, como limpiar el almacenamiento local
  };

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage onLogin={handleLogin}/>} />
        <Route path='/user' element={<PrivateRoute />}>
          <Route path='upload' element={<CsvUploadPage />} />
          <Route path='filtro' element={<PropiedadesFiltradasPage />} />
          <Route path='home' element={<HomePage username={username} onLogout={handleLogout} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
