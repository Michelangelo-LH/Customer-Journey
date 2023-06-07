//update-json.js

// Assuming your JSON is stored in a variable called `jsonData`
var jsonData = './config/customerData.json'; // Replace '...' with your actual JSON data

// Add the JavaScript code here

// Iterate through each segment
var data = JSON.parse(jsonData);
data.customerSegments.forEach(function(segment) {
  // Reset the bookedSuccessfully flag
  segment.bookedSuccessfully = false;

  // Iterate through the touchpoints
  segment.touchpoints.forEach(function(touchpoint) {
    if (touchpoint.name === "Booking Confirmation") {
      // Update the segment's properties accordingly
      segment.bookedSuccessfully = true;
      // You can add more properties or logic here based on your requirements
    }
  });
});

// Convert the updated data back to JSON
var updatedJson = JSON.stringify(data);

// Display the updated JSON in the console
console.log(updatedJson);
