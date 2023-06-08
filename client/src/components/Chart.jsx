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
          // set the time to be the sum of the previous phase's cumulative time and the timeGap
          // This is to maintain the continuity of the progressive line when there is a time gap between segments
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
          cumulativeTime += timeGap; // Update cumulativeTime with the sum of cumulativeTime and timeGap

          touchpointData.push({
            label: touchpoint.label,
            time: cumulativeTime, // Use cumulativeTime instead of phaseCumulativeTime + sequenceCumulativeTime
            phaseId: segment.id,
            sequenceId: sequence.id,
          });
        }
      });

      phaseCumulativeTime += sequenceCumulativeTime; // Update phaseCumulativeTime with the cumulative time of the current sequence
    });

    cumulativeTime = phaseCumulativeTime; // Update cumulativeTime with the cumulative time of the current phase
  });

  touchpointData.sort((a, b) => a.time - b.time);

  const progressiveChartData = {
    labels: touchpointData.map((touchpoint) => touchpoint.label),
    datasets: [
      {
        data: touchpointData.map((touchpoint) => touchpoint.time),
        tension: 0,
        backgroundColor: 'rgba(3, 116, 218, 1)', // Set the background color for the progressive line
        borderColor: 'rgba(255, 188, 43, 1)', // Set the border color for the progressive line
        pointRadius: 8, // Hide the points of the progressive line
        borderWidth: 2, // Set the border width for the progressive line
        pointHoverRadius: 16,
        pointHitRadius: 16,
        spanGaps: true,
        label: 'Comms Life Cycle',
        borderDash: [4, 4],
      fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInQuad',
      loop: false,
    },
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
      <Line data={progressiveChartData} options={chartOptions} plugins={[ChartDataLabels]} />
      {/* <Touchpoint touchpointData={snap.touchpointData} /> */}
    </div>
  );
};

export default MyChart;



