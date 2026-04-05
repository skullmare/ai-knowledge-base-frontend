import React from 'react';
import './Spinner.css'; // Если используете CSS модули, импортируйте соответственно

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;