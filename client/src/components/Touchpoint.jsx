// Touchpoint.jsx
import React, { useEffect, useRef, useState } from 'react';

function Touchpoint({ touchpoint, dotPosition, setSelectedTouchpoint }) {
  const popoverRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'translate(0%, -100%)',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    zIndex: 9999,
    visibility: 'hidden', // Initially hide the popover
  });

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        // Handle the outside click here, such as closing the popover
        setSelectedTouchpoint(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setSelectedTouchpoint]);

  useEffect(() => {
    const calculatePopoverPosition = () => {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;

      const newPosition = { ...popoverStyle };

      // Calculate the new top position
      if (dotPosition.y + popoverRect.height > innerHeight) {
        newPosition.top = innerHeight - popoverRect.height;
      } else if (dotPosition.y < 0) {
        newPosition.top = 0;
      } else {
        newPosition.top = dotPosition.y;
      }

      // Calculate the new left position
      let leftPosition = dotPosition.x - popoverRect.width / 2; // Center the popover horizontally

      if (leftPosition + popoverRect.width > innerWidth) {
        leftPosition = innerWidth - popoverRect.width;
      } else if (leftPosition < 0) {
        leftPosition = 0;
      }

      newPosition.left = leftPosition;
      newPosition.visibility = 'visible';

      // Adjust the top position to center the popover vertically
      newPosition.top -= popoverRect.height / 2;

      // Move the popover up by subtracting a value from the top position
      const moveUpAmount = 150; // Adjust this value as needed
      newPosition.top -= moveUpAmount;

      // Adjust the width of the popover
      const newWidth = 300; // Adjust this value as needed
      newPosition.width = newWidth;

      setPopoverStyle(newPosition);
    };

    calculatePopoverPosition();
  }, [dotPosition]);

  if (!touchpoint || !dotPosition) {
    return null; // Don't render anything if either touchpoint or dotPosition is not defined
  }

  return (
    <div style={popoverStyle} ref={popoverRef}>
      <h2>Selected Touchpoint:</h2>
      <div key={touchpoint.id}>
        <h3>{touchpoint.name}</h3>
        <p>Category: {touchpoint.category}</p>
        <p>Label: {touchpoint.label}</p>
        <p>Tags: {touchpoint.tags.join(', ')}</p>
        <p>Time Delay: {touchpoint.timeDelay}</p>
        <p>Description: {touchpoint.description}</p> {/* Added line */}
      </div>
    </div>
  );
}

export default Touchpoint;








