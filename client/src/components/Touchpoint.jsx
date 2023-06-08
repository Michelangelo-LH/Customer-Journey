// Touchpoint.jsx
import React from 'react';

const Touchpoint = ({ touchpointData }) => {
  return (
    <div>
      <h2>Touchpoint Component</h2>
      {touchpointData.map((touchpoint) => (
        <div key={touchpoint.label}>
          <p>Name: {touchpoint.label}</p>
          <p>Time: {touchpoint.time}</p>
          <p>Phase ID: {touchpoint.phaseId}</p>
          <p>Sequence ID: {touchpoint.sequenceId}</p>
        </div>
      ))}
    </div>
  );
};

export default Touchpoint;



