//CustomerJourneyFilters.jsx
import React, { useState } from 'react';
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
      <div key={segment.id}>
        <label>
          <input
            type="checkbox"
            checked={selectedFilters.includes(segment.id)}
            onChange={() => handleFilterChange(segment.id)}
          />
          {segment.name}
        </label>
      </div>
    ));
  };

  // Call the updateChartData function whenever the filters change
  React.useEffect(() => {
    updateChartData(selectedFilters);
  }, [selectedFilters, updateChartData]);

  return (
    <div>
      {/* <h2>Customer Journey Filters:</h2> */}
      {renderFilters()}
    </div>
  );
}

export default CustomerJourneyFilters;



