// Touchpoint.jsx
import React from 'react';

const Touchpoint = ({ touchpointData }) => {
  return (
    <div>
      <h2>Touchpoint Component</h2>
      {touchpointData.map((touchpoint, index) => (
        <div key={index}>
          <h3>{touchpoint.label}</h3>
          <p>Name: {touchpoint.name}</p>
          <p>Status: {touchpoint.status}</p>
          <p>Intent: {touchpoint.intent}</p>
          <p>Conditions: {touchpoint.conditions}</p>
          <p>Platform: {touchpoint.platform}</p>
          <p>Section: {touchpoint.section}</p>
          <p>Tags: {touchpoint.tags}</p>
          <p>Time: {touchpoint.time}</p>
          <p>Type: {touchpoint.type}</p>
          <p>Description: {touchpoint.description}</p>
          <p>Phase ID: {touchpoint.phaseId}</p>
          <p>Sequence ID: {touchpoint.sequenceId}</p>
        </div>
      ))}
    </div>
  );
};


export default Touchpoint;



