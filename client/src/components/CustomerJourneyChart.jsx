// CustomerJourneyChart.jsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import styles from './CustomerJourneyChart.module.css';
import { Popover } from 'react-bootstrap';
import JourneyTimeline from './JourneyTimeline';
import Touchpoint from './Touchpoint';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

import CustomerJourneyFilters from './CustomerJourneyFilters';
import customerData from '../config/customerData.json';

function CustomerJourneyChart() {
  const { customerSegments } = customerData;

  const [filteredSegmentIds, setFilteredSegmentIds] = useState([]);
  const [selectedTouchpoint, setSelectedTouchpoint] = useState(null);
  const [showLine, setShowLine] = useState(true);

  const updateChartData = (selectedFilters) => {
    setFilteredSegmentIds(selectedFilters);
  };

  const handleTouchpointClick = (touchpoint, x, y) => {
    setSelectedTouchpoint({ ...touchpoint, x, y });
  };

  const toggleLine = () => {
    setShowLine(!showLine);
  };

  const filteredSegments = customerSegments.filter((segment) =>
    filteredSegmentIds.includes(segment.id)
  );

  const segmentNames = filteredSegments.map((segment) => segment.name);

  const touchpointLabels = filteredSegments.flatMap((segment) =>
    segment.touchpoints.map((touchpoint) => touchpoint.name)
  );

  const colorPalette = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  const datasets = filteredSegments.flatMap((segment, segmentIndex) => {
    let y = segmentIndex; // Initialize y-coordinate with the segment index

    return segment.touchpoints.map((touchpoint, touchpointIndex) => {
      const timeDelay = parseFloat(touchpoint.timeDelay); // Parse the time delay as a float

      let totalDelay = 0; // Variable to keep track of the total time delay

      // Calculate the total delay for the current touchpoint
      for (let i = 0; i <= touchpointIndex; i++) {
        totalDelay += parseFloat(segment.touchpoints[i].timeDelay);
      }

      const x = totalDelay; // x-coordinate is the total delay for the current touchpoint

      // If touchpoint has the same value as the previous one, increment the y-coordinate
      if (
        touchpointIndex > 0 &&
        touchpoint.value === segment.touchpoints[touchpointIndex - 1].value
      ) {
        y++;
      }

      const dotColorIndex = touchpointIndex % colorPalette.length;
      const dotColor = colorPalette[dotColorIndex];

      return {
        label: touchpoint.name,
        data: [
          {
            x: x,
            y: y,
          },
        ],
        backgroundColor: dotColor,
        borderColor: dotColor,
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
        pointHitRadius: 8,
        showLine: showLine,
        spanGaps: true,
      };
    });
  });

  const chartData = {
    labels: segmentNames,
    datasets: datasets.flat(),
  };

  // Calculate dot position if a touchpoint is selected
  const dotPosition = selectedTouchpoint
    ? {
      x: selectedTouchpoint.x, // Example x-coordinate value of the selected touchpoint
      y: selectedTouchpoint.y, // Example y-coordinate value of the selected touchpoint
    }
    : null;

  return (
    <div>
      <h2>Customer Segments:</h2>
      <CustomerJourneyFilters
        segments={customerSegments}
        updateChartData={updateChartData}
      />
      <button onClick={toggleLine}>
        {showLine ? 'Hide Line' : 'Show Line'}
      </button>
      <Line
        data={chartData}
        options={{
          responsive: true,
          onClick: (event, elements) => {
            if (elements && elements.length > 0) {
              const segmentIndex = elements[0].index;
              const selectedSegment = filteredSegments[segmentIndex];
              setSelectedTouchpoint(null);
              const touchpoint = selectedSegment.touchpoints[0];
              const x = elements[0].element.x; // Get the x-coordinate from the clicked element
              const y = elements[0].element.y; // Get the y-coordinate from the clicked element
              handleTouchpointClick(touchpoint, x, y);
            }
          },
          indexAxis: 'x',
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              beginAtZero: true,
              offset: true, // Add offset to center the chart
            },
            y: {
              beginAtZero: true,
              type: 'linear', // Use linear scale for y-axis to stack the dots in columns
              offset: true, // Add offset to center the chart
              ticks: {
                stepSize: 1, // Set the step size to 1 to create stacked columns
              },
            },
          },
          elements: {
            point: {
              hoverRadius: 10,
            },
          },
        }}
      />

{selectedTouchpoint && (
  <div className={styles.popoverContainer}>
    <Touchpoint
      touchpoint={selectedTouchpoint} // Pass the selectedTouchpoint instead of touchpoint
      dotPosition={dotPosition}
      setSelectedTouchpoint={setSelectedTouchpoint}
    />
  </div>
)}



      <JourneyTimeline
        touchpointLabels={touchpointLabels}
        handleTouchpointClick={handleTouchpointClick}
      />
    </div>
  );
}

export default CustomerJourneyChart;













