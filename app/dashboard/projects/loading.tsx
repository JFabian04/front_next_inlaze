import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="loading-container w-screen h-screen bg-red-100 absolute">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Loading;