// import React, { useState } from 'react';
// import { TextField, Button, Grid, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
// import { editIncident } from '../apis/EditCaseAPI.js'

// function EditCase({ onEditSuccess }) {
//   const [incID, setIncID] = useState('');        // Incident ID for case selection
//   const [error, setError] = useState('');         // Error message for Incident ID
//   const [showEditOptions, setShowEditOptions] = useState(false); // Control visibility of edit options
//   const [editFields, setEditFields] = useState([]); // Array to store editable fields

//   // List of editable fields and their types
//   const fields = [
//     { label: 'Incident ID', value: 'incID', type: 'text' },
//     { label: 'Date Reported', value: 'dateReported', type: 'date' },
//     { label: 'Incident Type', value: 'incidentType', type: 'text' },
//     { label: 'Total QTY', value: 'totalQTY', type: 'number' },
//     { label: 'Region', value: 'region', type: 'text' },
//     { label: 'Country', value: 'country', type: 'text' },
//     { label: 'State/Province', value: 'stateProvince', type: 'text' },
//     { label: 'CAR ID', value: 'carID', type: 'text' },
//     { label: 'Customs Port/Agency', value: 'customsPortAgency', type: 'text' },
//     { label: 'Destination Country', value: 'destinationCountry', type: 'text' },
//     { label: 'Country of Origin', value: 'originCountry', type: 'text' },
//     { label: 'Location Recovered', value: 'locationRecovered', type: 'text' },
//     { label: 'Seizure Date', value: 'seizureDate', type: 'date' },
//     { label: 'Bond Amount', value: 'bondAmount', type: 'number' },
//     { label: 'Infringement Type', value: 'infringementType', type: 'text' },
//     { label: 'Subpoena', value: 'subpoena', type: 'boolean' },
//     { label: 'Subpoena Open/Closed', value: 'subpoenaOpen', type: 'boolean' },
//     { label: 'Cease and Desist', value: 'ceaseDesist', type: 'boolean' },
//     { label: 'Cease and Desist Open/Closed', value: 'ceaseDesistOpen', type: 'boolean' },
//     { label: 'Due Diligence', value: 'dueDiligence', type: 'boolean' },
//     { label: 'Enhanced', value: 'enhanced', type: 'boolean' },
//     { label: 'Image', value: 'image', type: 'boolean' },
//     { label: 'Notes', value: 'notes', type: 'text' },
//   ];

//   // Handle Incident ID submission with error handling
//   const handleIncIDSubmit = () => {
//     if (incID.trim() === '') {
//       setError('Incident ID is required to proceed.');
//       setShowEditOptions(false);
//     } else {
//       setError('');
//       setShowEditOptions(true);
//     }
//   };

//   // Add a new field to edit
//   const addEditField = () => {
//     setEditFields([
//       ...editFields,
//       { selectedField: '', editValue: '', isBoolean: false },
//     ]);
//   };

//   // Handle field selection and update for each editable section
//   const handleFieldSelection = (index, selectedValue) => {
//     const selectedFieldData = fields.find((field) => field.value === selectedValue);
//     const updatedFields = [...editFields];
//     updatedFields[index] = {
//       ...updatedFields[index],
//       selectedField: selectedValue,
//       isBoolean: selectedFieldData.type === 'boolean',
//       editValue: selectedFieldData.type === 'boolean' ? false : '', // Default boolean to false
//     };
//     setEditFields(updatedFields);
//   };

//   const handleFieldValueChange = (index, value) => {
//     const updatedFields = [...editFields];
//     updatedFields[index] = { ...updatedFields[index], editValue: value };
//     setEditFields(updatedFields);
//   };

//   // Handle form submission for all fields
//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     if (!incID || !dateReported || !incidentType) {
//         alert('Please provide all required fields.');
//         return;
//     }

//     setUploading(true);

//     try {
//         const data = {
//             incID,
//             dateReported,
//             incidentType,
//             totalQTY,
//             region,
//             country,
//             stateProvince,
//             carID,
//             customsPortAgency,
//             destinationCountry,
//             originCountry,
//             locationRecovered,
//             seizureDate,
//             bondAmount,
//             infringementType,
//             subpoena: subpoena.toString(),
//             subpoenaOpen: subpoenaOpen.toString(),
//             ceaseDesist: ceaseDesist.toString(),
//             ceaseDesistOpen: ceaseDesistOpen.toString(),
//             dueDiligence: dueDiligence.toString(),
//             enhanced: enhanced.toString(),
//             image: image.toString(),
//             notes
//         };

//         // const response = await createIncident({ body: data });
//         alert('Entry created successfully!');
//         resetForm();
        
//         if (onUploadSuccess) {
//             onUploadSuccess();
//         }
//     } catch (error) {
//         console.error('Error creating entry:', error);
//         alert(error.message || 'Error creating entry. Please try again.');
//     } finally {
//         setUploading(false);
//     }
//   };


//   return (
//     <form onSubmit={handleSubmit}>
//       <Grid container spacing={2}>
//         {/* Incident ID Input */}
//         <Grid item xs={12}>
//           <TextField
//             label="Incident ID"
//             variant="outlined"
//             fullWidth
//             value={incID}
//             onChange={(e) => setIncID(e.target.value)}
//             required
//             error={!!error}
//             helperText={error}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button variant="contained" color="primary" onClick={handleIncIDSubmit}>
//             Proceed to Edit
//           </Button>
//         </Grid>

//         {/* Show Edit Options only if a valid Incident ID is provided */}
//         {showEditOptions && (
//           <>
//             {editFields.map((field, index) => (
//               <React.Fragment key={index}>
//                 <Grid item xs={12}>
//                   <TextField
//                     select
//                     label="Select Field to Edit"
//                     variant="outlined"
//                     fullWidth
//                     value={field.selectedField}
//                     onChange={(e) => handleFieldSelection(index, e.target.value)}
//                     required
//                   >
//                     {fields.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 {field.selectedField && (
//                   <Grid item xs={12}>
//                     {field.isBoolean ? (
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={field.editValue}
//                             onChange={(e) => handleFieldValueChange(index, e.target.checked)}
//                           />
//                         }
//                         label="Set to True"
//                       />
//                     ) : (
//                       <TextField
//                         label="New Value"
//                         variant="outlined"
//                         type={fields.find((f) => f.value === field.selectedField).type}
//                         fullWidth
//                         value={field.editValue}
//                         onChange={(e) => handleFieldValueChange(index, e.target.value)}
//                         required
//                       />
//                     )}
//                   </Grid>
//                 )}
//               </React.Fragment>
//             ))}

//             <Grid item xs={12}>
//               <Button variant="outlined" color="secondary" onClick={addEditField}>
//                 Edit Another Field
//               </Button>
//             </Grid>

//             <Grid item xs={12}>
//               <Button variant="contained" color="primary" type="submit">
//                 Save All Changes
//               </Button>
//             </Grid>
//           </>
//         )}
//       </Grid>
//     </form>
//   );
// }

// export default React.memo(EditCase);
