// Chart.jsx
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import customerData from '../config/customerData_TEST.json';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, registerables } from 'chart.js';
import { proxy, snapshot, useSnapshot } from 'valtio';
import Touchpoint from './Touchpoint';

const store = proxy({
  touchpointData: [],
});

Chart.register(...registerables);

const MyChart = () => {
  const snap = useSnapshot(store);

  useEffect(() => {
    import('chartjs-adapter-date-fns');

    const touchpointData = [];
    let cumulativeTime = 0;

    customerData.segments.forEach((segment, segmentIndex) => {
      let phaseCumulativeTime = cumulativeTime;

      segment.sequences.forEach((sequence) => {
        let sequenceCumulativeTime = 0;
        let previousTime = phaseCumulativeTime; // Initialize previousTime within the sequence loop

        sequence.touchpoints.forEach((touchpoint, touchpointIndex) => {
          const timeGap = touchpoint.time;

          if (touchpointIndex === 0 && segmentIndex > 0) {
            // If the first touchpoint in the sequence and it's not the first segment,
            // set the time to be the sum of the previous phase's cumulative time and the timeGap
            const previousSegment = customerData.segments[segmentIndex - 1];
            const lastTouchpointInPreviousSegment = previousSegment.sequences[previousSegment.sequences.length - 1].touchpoints.slice(-1)[0];
            const previousTime = touchpointData.find((tp) => tp.label === lastTouchpointInPreviousSegment.label).time;
            touchpointData.push({
              label: touchpoint.label,
              time: previousTime + timeGap,
              phaseId: segment.id,
              sequenceId: sequence.id,
            });
          } else {
            sequenceCumulativeTime += timeGap;
            previousTime += timeGap; // Update previousTime with the sum of previousTime and timeGap

            touchpointData.push({
              label: touchpoint.label,
              time: previousTime,
              phaseId: segment.id,
              sequenceId: sequence.id,
            });
          }
        });

        phaseCumulativeTime += sequenceCumulativeTime;
      });

      cumulativeTime = phaseCumulativeTime;
    });

    touchpointData.sort((a, b) => a.time - b.time);

    store.touchpointData = touchpointData;

    console.log('Snapshot:', snapshot(store.touchpointData));
  }, []);


  // Extract touchpoint labels and time from the imported JSON
  const touchpointData = [];

  let cumulativeTime = 0; // Initialize cumulativeTime variable outside the loop

  customerData.segments.forEach((segment, segmentIndex) => {
    let phaseCumulativeTime = cumulativeTime; // Store the cumulative time of the previous phase

    segment.sequences.forEach((sequence) => {
      let sequenceCumulativeTime = 0; // Reset sequenceCumulativeTime for each sequence

      sequence.touchpoints.forEach((touchpoint, touchpointIndex) => {
        const timeGap = touchpoint.time; // Use touchpoint.time directly

        if (touchpointIndex === 0 && timeGap === 0 && segmentIndex > 0) {
          // If the first touchpoint in the sequence has a time of 0 and it's not the first segment,
          // set the time to be the sum of the cumulative time and the timeGap
          const previousSegment = customerData.segments[segmentIndex - 1];
          const lastTouchpointInPreviousSegment = previousSegment.sequences[previousSegment.sequences.length - 1].touchpoints.slice(-1)[0];
          const previousTime = touchpointData.find((tp) => tp.label === lastTouchpointInPreviousSegment.label).time;
          touchpointData.push({
            label: touchpoint.label,
            time: previousTime + timeGap,
            phaseId: segment.id,
            sequenceId: sequence.id,
          });
        } else {
          sequenceCumulativeTime += timeGap; // Update sequenceCumulativeTime with the sum of sequenceCumulativeTime and timeGap

          touchpointData.push({
            label: touchpoint.label,
            time: phaseCumulativeTime + sequenceCumulativeTime, // Use phaseCumulativeTime + sequenceCumulativeTime instead of cumulativeTime + sequenceCumulativeTime
            phaseId: segment.id,
            sequenceId: sequence.id,
          });
        }
      });

      phaseCumulativeTime += sequenceCumulativeTime; // Update phaseCumulativeTime with the cumulative time of the current sequence
    });

    cumulativeTime = phaseCumulativeTime; // Update cumulativeTime with the cumulative time of the current phase
  });

  // Sort touchpoints by time
  touchpointData.sort((a, b) => a.time - b.time);

  // Calculate time gaps between touchpoints
  const timeGaps = touchpointData.map((touchpoint, index) => {
    if (index === 0) {
      return touchpoint.time; // The first touchpoint has a time gap equal to its own time value
    } else {
      const currentTime = touchpoint.time;
      const previousTime = touchpointData[index - 1].time;
      return currentTime - previousTime;
    }
  });

  // Prepare chart data using the touchpointData from the snapshot
  const chartData = {
    labels: snap.touchpointData.map((touchpoint) => touchpoint.label),
    datasets: [
      {
        data: snap.touchpointData.map((touchpoint) => touchpoint.time),
        tension: 0,
      },
    ],
  };

  console.log('Chart Data:', chartData); // Log the chart data

  // Configure chart options
  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Touchpoint',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Time Gap (Number of Days)',
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h2>Chart Component</h2>
      <Line data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
      <Touchpoint touchpointData={snap.touchpointData} />
    </div>
  );
};

export default MyChart;


