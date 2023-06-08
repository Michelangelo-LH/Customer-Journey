// CustomerSegment.jsx
import React from 'react';
import customerData from '../config/customerData_TEST.json';

const CustomerSegment = ({ segmentData }) => {
  const { segments } = customerData;

  const populateSegmentBasedOnTouchpoint = (segmentData, touchpointsData) => {
    const updatedSegments = [];

    for (const touchpoint of touchpointsData) {
      const { conditions, label } = touchpoint;

      if (conditions && conditions.includes(segmentData)) {
        let segment = updatedSegments.find((seg) => seg.name === label);

        if (!segment) {
          segment = {
            name: label,
            sequences: [],
          };
          updatedSegments.push(segment);
        }

        const {
          status,
          intent,
          conditions,
          platform,
          section,
          tags,
          time,
          type,
          description,
        } = touchpoint;

        const updatedTouchpoint = {
          name: label,
          status,
          intent,
          conditions,
          platform,
          section,
          tags,
          time,
          type,
          description,
        };

        segment.sequences.push({
          name: intent,
          touchpoints: [updatedTouchpoint],
        });
      }
    }

    segmentData.segments = updatedSegments;
  };

  populateSegmentBasedOnTouchpoint(segmentData, segments);

  return (
    <div>
      {/* Render the updated segment data */}
      {segmentData.segments.map((segment) => (
        <div key={segment.name}>
          <h2>{segment.name}</h2>
          <ul>
            {segment.sequences.map((sequence) => (
              <li key={sequence.name}>
                <h3>{sequence.name}</h3>
                <ul>
                  {sequence.touchpoints.map((touchpoint) => (
                    <li key={touchpoint.name}>
                      <p>{touchpoint.name}</p>
                      {/* Render other touchpoint data */}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CustomerSegment;
