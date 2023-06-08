//CustomerJourneyFilters.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale } from 'chart.js/auto';

Chart.register(CategoryScale);

function CustomerJourneyFilters({ segments, updateChartData }) {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterChange = (segmentId) => {
    if (selectedFilters.includes(segmentId)) {
      setSelectedFilters(selectedFilters.filter((id) => id !== segmentId));
    } else {
      setSelectedFilters([...selectedFilters, segmentId]);
    }
  };

  const renderFilters = () => {
    return segments.map((segment) => (
      <div key={segment.name}>
        <label>
          <input
            type="checkbox"
            checked={selectedFilters.includes(segment.name)}
            onChange={() => handleFilterChange(segment.name)}
          />
          {segment.name}
        </label>
      </div>
    ));
  };

  // Call the updateChartData function whenever the filters change
  useEffect(() => {
    const selectedSegmentIds = segments
      .filter((segment) => selectedFilters.includes(segment.name))
      .map((segment) => segment.id);
    updateChartData(selectedSegmentIds);
  }, [selectedFilters, segments, updateChartData]);

  return <div>{renderFilters()}</div>;
}

export default CustomerJourneyFilters;




