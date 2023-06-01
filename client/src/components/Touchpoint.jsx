// Touchpoint.jsx
import React from 'react';

function Touchpoint({ touchpoint }) {
  if (!touchpoint) {
    return null; // Don't render anything if no touchpoint is selected
  }

  return (
    <div>
      <h2>Selected Touchpoint:</h2>
      <div key={touchpoint.id}>
        <h3>{touchpoint.name}</h3>
        <p>Category: {touchpoint.category}</p>
        <p>Label: {touchpoint.label}</p>
        <p>Tags: {touchpoint.tags.join(', ')}</p>
        <p>Time Delay: {touchpoint.timeDelay}</p>
        {/* Additional touchpoint details can be displayed as needed */}
      </div>
    </div>
  );
}

export default Touchpoint;




