//update-json.cjs
const fs = require('fs');
const pandas = require('pandas-js');

// Read the JSON file
const jsonPath = 'src/config/customerData_TEST.json';
const jsonData = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(jsonData);



segment_ids = []
segment_names = []
sequence_ids = []
sequence_names = []
touchpoint_ids = []
touchpoint_names = []
touchpoint_statuses = []
touchpoint_intents = []
touchpoint_labels = []
touchpoint_conditions = []
touchpoint_platforms = []
touchpoint_sections = []
touchpoint_tags = []
touchpoint_times = []
touchpoint_types = []
touchpoint_descriptions = []
data_point_ids = []
timestamps = []
interaction_types = []
interaction_details = []


for (const segment of data["segments"]) {
    const segment_id = segment["id"];
    const segment_name = segment["name"];
    for (const sequence of segment["sequences"]) {
        const sequence_id = sequence["id"];
        const sequence_name = sequence["name"];
        for (const touchpoint of sequence["touchpoints"]) {
            const touchpoint_id = touchpoint["id"];
            const touchpoint_name = touchpoint["name"];
            const touchpoint_status = touchpoint["status"];
            const touchpoint_intent = touchpoint["intent"];
            const touchpoint_label = touchpoint["label"];
            const touchpoint_condition = touchpoint["conditions"];
            const touchpoint_platform = touchpoint["platform"];
            const touchpoint_section = touchpoint["section"];
            const touchpoint_tag = touchpoint["tags"];
            const touchpoint_time = touchpoint["time"];
            const touchpoint_type = touchpoint["type"];
            const touchpoint_description = touchpoint["description"];
            for (const data_point of touchpoint["dataPoints"]) {
                const data_point_id = data_point["id"];
                const timestamp = data_point["timestamp"];
                const interaction_type = data_point["interactionType"];
                const interaction_detail = data_point["interactionDetails"];
                // Appending the extracted data to the respective lists
                segment_ids.push(segment_id);
                segment_names.push(segment_name);
                sequence_ids.push(sequence_id);
                sequence_names.push(sequence_name);
                touchpoint_ids.push(touchpoint_id);
                touchpoint_names.push(touchpoint_name);
                touchpoint_statuses.push(touchpoint_status);
                touchpoint_intents.push(touchpoint_intent);
                touchpoint_labels.push(touchpoint_label);
                touchpoint_conditions.push(touchpoint_condition);
                touchpoint_platforms.push(touchpoint_platform);
                touchpoint_sections.push(touchpoint_section);
                touchpoint_tags.push(touchpoint_tag);
                touchpoint_times.push(touchpoint_time);
                touchpoint_types.push(touchpoint_type);
                touchpoint_descriptions.push(touchpoint_description);
                data_point_ids.push(data_point_id);
                timestamps.push(timestamp);
                interaction_types.push(interaction_type);
                interaction_details.push(interaction_detail);
            }
        }
    }
}


const df = new pandas.DataFrame({
    "Segment ID": segment_ids,
    "Segment Name": segment_names,
    "Sequence ID": sequence_ids,
    "Sequence Name": sequence_names,
    "Touchpoint ID": touchpoint_ids,
    "Touchpoint Name": touchpoint_names,
    "Touchpoint Status": touchpoint_statuses,
    "Touchpoint Intent": touchpoint_intents,
    "Touchpoint Label": touchpoint_labels,
    "Touchpoint Condition": touchpoint_conditions,
    "Touchpoint Platform": touchpoint_platforms,
    "Touchpoint Section": touchpoint_sections,
    "Touchpoint Tags": touchpoint_tags,
    "Touchpoint Time": touchpoint_times,
    "Touchpoint Type": touchpoint_types,
    "Touchpoint Description": touchpoint_descriptions,
    "Data Point ID": data_point_ids,
    "Timestamp": timestamps,
    "Interaction Type": interaction_types,
    "Interaction Detail": interaction_details
});


// Display the updated DataFrame in the console
console.log(df);

