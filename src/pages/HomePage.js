import React from 'react';
import Home from '../components/Home';


const HomePage = ({ username, onLogout }) => {
  return (
    <div>
      <Home username={username} onLogout={onLogout} />
    </div>
  );
};

export default HomePage;
