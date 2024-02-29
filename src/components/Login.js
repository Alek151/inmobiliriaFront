import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import { Navigate } from 'react-router-dom';


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://nodeupload-s10t.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Error al iniciar sesión. Por favor, intente nuevamente más tarde.');
      }

      const data = await response.json();
      const token = data.token;
      console.log(token)
      localStorage.setItem('token', token);
      onLogin(token);
      setRedirectToHome(true); // Activar la redirección a la página de inicio
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://nodeupload-s10t.onrender.com/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Error al registrar el usuario. Por favor, intente nuevamente más tarde.');
      }

      // Registro exitoso, intentar iniciar sesión
      await handleLogin();
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error al registrar el usuario:', error);
    }
  };

    if (redirectToHome) {
    return <Navigate to="/user/home" />;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <h2 className="mb-4">Login</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary mb-3" onClick={handleLogin}>Iniciar Sesión</button>
        <button className="btn btn-secondary" onClick={handleRegister}>Registrarse</button>
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
