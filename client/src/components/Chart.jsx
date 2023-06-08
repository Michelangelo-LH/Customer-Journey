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
Chart.register(ChartDataLabels);

const getColorByType = (type) => {
  switch (type) {
    case 'Marketing':
      return 'rgba(255, 188, 43, 1)'; // Yellow
    case 'Product':
      return 'rgba(3, 116, 218, 1)'; // Blue
    case 'Transactional':
      return 'rgba(255, 0, 0, 1)'; // Red
    default:
      return 'rgba(0, 0, 0, 1)'; // Black (default color)
  }
};

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
        let previousTime = phaseCumulativeTime;

        sequence.touchpoints.forEach((touchpoint, touchpointIndex) => {
          const timeGap = touchpoint.time;

          if (touchpointIndex === 0 && segmentIndex > 0) {
            const previousSegment = customerData.segments[segmentIndex - 1];
            const lastTouchpointInPreviousSegment = previousSegment.sequences[previousSegment.sequences.length - 1].touchpoints.slice(-1)[0];
            const previousTime = touchpointData.find((tp) => tp.label === lastTouchpointInPreviousSegment.label).time;
            touchpointData.push({
              name: touchpoint.name,
              status: touchpoint.status,
              intent: touchpoint.intent,
              label: touchpoint.label,
              conditions: touchpoint.conditions,
              platform: touchpoint.platform,
              section: touchpoint.section,
              tags: touchpoint.tags,
              time: previousTime + timeGap,
              type: touchpoint.type,
              description: touchpoint.description,
              phaseId: segment.id,
              sequenceId: sequence.id,
            });
          } else {
            sequenceCumulativeTime += timeGap;
            previousTime += timeGap;

            touchpointData.push({
              name: touchpoint.name,
              status: touchpoint.status,
              intent: touchpoint.intent,
              label: touchpoint.label,
              conditions: touchpoint.conditions,
              platform: touchpoint.platform,
              section: touchpoint.section,
              tags: touchpoint.tags,
              time: previousTime,
              type: touchpoint.type, // Set the type property of the touchpoint object
              description: touchpoint.description,
              phaseId: segment.id,
              sequenceId: sequence.id,
            });
            // Move the console logs here, where the touchpoint variable is defined
            console.log('Touchpoint:', touchpoint);
            console.log('Type:', touchpoint.type);
          }
        });

        phaseCumulativeTime += sequenceCumulativeTime;
      });

      cumulativeTime = phaseCumulativeTime;
    });

    touchpointData.sort((a, b) => a.time - b.time);

    store.touchpointData = touchpointData;

    console.log('Snapshot:', snapshot(store.touchpointData));
    console.log('touchpointData:', touchpointData);
    console.log('touchpointData types:', touchpointData.map((touchpoint) => touchpoint.type));
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
        tension: 0,
        pointRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 2,
        pointHoverRadius: 12,
        pointHitRadius: 16,
        spanGaps: true,
        label: 'Comms Life Cycle',
        borderDash: [4, 4],
        fill: false,
        data: touchpointData.map((touchpoint) => touchpoint.time),
        backgroundColor: touchpointData.map((touchpoint) => getColorByType(touchpoint.type)),
        segment: {
          borderColor: (ctx) => {
            const touchpoint = touchpointData[ctx.p0.parsed.x]; // Get the touchpoint based on the x-axis value
            return touchpoint ? getColorByType(touchpoint) : 'default';
          },
          borderDash: (ctx) => {
            const touchpoint = touchpointData[ctx.p0.parsed.x]; // Get the touchpoint based on the x-axis value
            return touchpoint ? undefined : [6, 6];
          },
        },
        
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
          font: {
            family: 'Inter', // Set the font family for the x-axis title
            size: 14, // Set the font size for the x-axis title
            weight: 'bold', // Set the font weight for the x-axis title
          },
        },
        ticks: {
          font: {
            family: 'Inter', // Set the font family for the x-axis ticks
            size: 12, // Set the font size for the x-axis ticks
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Time Gap (Number of Days)',
          font: {
            family: 'Inter', // Set the font family for the y-axis title
            size: 18, // Set the font size for the y-axis title
            weight: 'bold', // Set the font weight for the y-axis title
          },
        },
        ticks: {
          font: {
            family: 'Inter', // Set the font family for the y-axis ticks
            size: 12, // Set the font size for the y-axis ticks
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Comms Life Cycle',
        font: {
          family: 'Inter', // Set the font family for the chart title
          size: 16, // Set the font size for the chart title
          weight: 'bold', // Set the font weight for the chart title
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const tooltipItem = tooltipItems[0]; // Assuming there is only one tooltip item
              const { label } = tooltipItem;
              const touchpoint = snap.touchpointData.find((tp) => tp.label === label);

              // Customize the title text as per your requirement
              return `Touchpoint: ${touchpoint.label} (${touchpoint.time} Days)`;
            },

            label: (tooltipItem) => {
              const { label } = tooltipItem;
              const touchpoint = snap.touchpointData.find((tp) => tp.label === label);

              // Customize the label text as per your requirement
              return `Status: ${touchpoint.status}`;
            },

            afterLabel: (tooltipItem) => {
              const { label } = tooltipItem;
              const touchpoint = snap.touchpointData.find((tp) => tp.label === label);

              // Customize the additional information text as per your requirement
              return `Description: ${touchpoint.description}`;
            },
          },
        },
      },
      datalabels: {
        display: false, // Set the display property to true
        anchor: 'end',
        align: 'start',
        font: {
          size: 12, // Set the font size for the tooltip labels
        },
        formatter: (value) => `${value} Days`, // Format the tooltip labels
      },
    },

  };

  console.log('backgroundColor:', progressiveChartData.datasets[0].backgroundColor);
  // console.log('borderColor:', progressiveChartData.datasets[0].borderColor);

  return (
    <div className="md:container md:mx-auto">
      {/* <h2>Chart Component</h2> */}
      <Line data={progressiveChartData} options={chartOptions} plugins={[ChartDataLabels]} />
      <Touchpoint touchpointData={snap.touchpointData} />
    </div>
  );
};

export default MyChart;



