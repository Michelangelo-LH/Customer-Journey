// JourneyTimeline.jsx
import React from 'react';
import styles from './JourneyTimeline.module.css';
import customerData from '../config/customerData_TEST.json';

function JourneyTimeline({ touchpointLabels, handleTouchpointClick }) {
  const { phases, customerSegments } = customerData;

  return (
    <div className={styles['journey-timeline']}>
      {phases.map((phase, index) => {
        const segment = customerSegments.find(
          (segment) => segment.name === `New user - ${phase}`
        );

        if (segment) {
          return (
            <div className="timeline-item" key={index}>
              <div className="timeline-item-content">
                <h3>{phase}</h3>
                <p>{segment.description}</p>
                {segment.touchpoints.map((touchpoint) => (
                  <p
                    key={touchpoint.id}
                    onClick={() =>
                      handleTouchpointClick(touchpoint, 0, 0)
                    }
                  >
                    {touchpoint.name}
                  </p>
                ))}
              </div>
            </div>
          );
        } else {
          return null; // Ignore phases without a corresponding customer segment
        }
      })}
    </div>
  );
}

export default JourneyTimeline;






