// CustomerJourneyChart.jsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Popover } from 'react-bootstrap';
import styles from './CustomerJourneyChart.module.css';
import JourneyTimeline from './JourneyTimeline';
import Touchpoint from './Touchpoint';
import CustomerJourneyFilters from './CustomerJourneyFilters';
import customerData from '../config/customerData_TEST.json';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const arraysEqual = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
};

function CustomerJourneyChart() {
  const { customerSegments, phases } = customerData;

  console.log('phases:', phases);

  console.log('customerSegments:', customerSegments);


  const [filteredSegmentIds, setFilteredSegmentIds] = useState(() => customerSegments.map(segment => segment.id));
  console.log('filteredSegmentIds:', filteredSegmentIds);

  const [selectedTouchpoint, setSelectedTouchpoint] = useState(null);
  const [showLine, setShowLine] = useState(true);

  const updateChartData = (selectedFilters) => {
    if (!arraysEqual(selectedFilters, filteredSegmentIds)) {
      setFilteredSegmentIds(selectedFilters);
    }
  };

  const handleTouchpointClick = (touchpoint, x, y) => {
    setSelectedTouchpoint({ ...touchpoint, x, y });
  };

  const toggleLine = () => {
    setShowLine(!showLine);
  };

  const filteredSegments = customerSegments && filteredSegmentIds
    ? customerSegments.filter((segment) => filteredSegmentIds.includes(segment.id))
    : [];

  console.log(filteredSegments); // Placed here to log the filtered segments

  const segmentNames = filteredSegments.map((segment) => segment.name);
  console.log(Array.isArray(filteredSegments));


  const touchpointLabels = filteredSegments.flatMap((segment) =>
    segment.touchpoints ? segment.touchpoints.map((touchpoint) => touchpoint.name) : []
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

      if (!touchpoint.dataPoints || touchpoint.dataPoints.length === 0) {
        touchpoint.dataPoints = []; // Add an empty dataPoints array if missing
      }

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
        pointRadius: 16,
        pointHoverRadius: 24,
        pointHitRadius: 16,
        showLine: showLine,
        spanGaps: true,
        name: touchpoint.name, // Add the name field to the touchpoint object
        status: touchpoint.status || 'Unknown', // Add the status field to the touchpoint object (default to 'Unknown' if missing)
        intent: touchpoint.intent || '', // Add the intent field to the touchpoint object (default to an empty string if missing)
        // label: touchpoint.label || '', // Add the label field to the touchpoint object (default to an empty string if missing)
        conditions: touchpoint.conditions || '', // Add the conditions field to the touchpoint object (default to an empty string if missing)
        platform: touchpoint.platform || '', // Add the platform field to the touchpoint object (default to an empty string if missing)
        section: touchpoint.section || '', // Add the section field to the touchpoint object (default to an empty string if missing)
        tags: touchpoint.tags || [], // Add the tags field to the touchpoint object (default to an empty array if missing)
        time: touchpoint.time || '', // Add the time field to the touchpoint object (default to an empty string if missing)
        type: touchpoint.type || '', // Add the type field to the touchpoint object (default to an empty string if missing)
        description: touchpoint.description || '', // Add the description field to the touchpoint object (default to an empty string if missing)
      };
    });
  });

  const chartData = {
    labels: segmentNames,
    datasets: datasets.reduce((arr, dataset) => arr.concat(dataset), []),
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
      <CustomerJourneyFilters segments={customerSegments} updateChartData={updateChartData} />
      <button onClick={toggleLine}>{showLine ? 'Hide Line' : 'Show Line'}</button>
      <Line
        data={chartData}
        options={{
          responsive: true,
          onClick: (event, elements) => {
            if (elements && elements.length > 0) {
              const datasetIndex = elements[0].datasetIndex;
              const touchpointIndex = elements[0].index;
              const selectedSegment = filteredSegments[datasetIndex];

              if (selectedSegment && selectedSegment.touchpoints) {
                setSelectedTouchpoint(null);
                const touchpoints = selectedSegment.touchpoints;
                if (touchpointIndex >= 0 && touchpointIndex < touchpoints.length) {
                  const touchpoint = touchpoints[touchpointIndex];
                  const x = elements[0].x; // Get the x-coordinate from the clicked element
                  const y = elements[0].y; // Get the y-coordinate from the clicked element
                  handleTouchpointClick(touchpoint, x, y);
                }
              }
            } else {
              // Handle the chart click event when the click is outside the dots
              setSelectedTouchpoint(null);
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
              hoverRadius: 24,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const datasetLabel = context.dataset.label || '';
                  const dataLabel = context.parsed.y !== null ? context.parsed.y : '';
                  const timeDelay = context.parsed.x !== null ? context.parsed.x : '';
                  const touchpoint = context.parsed.points[0].raw; // Get the touchpoint object from the raw data
                  const { name, status, intent, label, conditions, platform, section, tags, time, type, description } = touchpoint; // Destructure the touchpoint object
                  return `${datasetLabel}: ${dataLabel} (Time Delay: ${timeDelay})\nName: ${name}\nStatus: ${status}\nIntent: ${intent}\nLabel: ${label}\nConditions: ${conditions}\nPlatform: ${platform}\nSection: ${section}\nTags: ${tags}\nTime: ${time}\nType: ${type}\nDescription: ${description}`; // Include additional information in the tooltip
                },
              },
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

      <JourneyTimeline touchpointLabels={touchpointLabels} handleTouchpointClick={handleTouchpointClick} />
    </div>
  );
}

export default CustomerJourneyChart;












