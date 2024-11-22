import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

function EditCase({ onEditSuccess }) {
  const [formData, setFormData] = useState({
    incID: '',
    dateReported: '',
    incidentType: '',
    totalQTY: '',
    region: '',
    country: '',
    stateProvince: '',
    carID: '',
    customsPortAgency: '',
    destinationCountry: '',
    originCountry: '',
    locationRecovered: '',
    seizureDate: '',
    bondAmount: '',
    infringementType: '',
    subpoena: false,
    subpoenaOpen: false,
    ceaseDesist: false,
    ceaseDesistOpen: false,
    dueDiligence: false,
    enhanced: false,
    image: false,
    notes: ''
  });

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [editFields, setEditFields] = useState([]);

  const handleIncIDSubmit = () => {
    if (formData.incID.trim() === '') {
      setError('Incident ID is required to proceed.');
      setShowEditOptions(false);
    } else {
      setError('');
      setShowEditOptions(true);
    }
  };

  const addEditField = () => {
    setEditFields([
      ...editFields,
      { selectedField: '', editValue: '', isBoolean: false }
    ]);
  };

  const handleFieldSelection = (index, selectedField) => {
    const updatedFields = [...editFields];
    const isBoolean = typeof formData[selectedField] === 'boolean';
    updatedFields[index] = {
      ...updatedFields[index],
      selectedField,
      isBoolean,
      editValue: isBoolean ? false : ''
    };
    setEditFields(updatedFields);
  };

  const handleFieldValueChange = (index, value) => {
    const updatedFields = [...editFields];
    updatedFields[index] = {
      ...updatedFields[index],
      editValue: value
    };
    setEditFields(updatedFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.incID) {
      setError('Incident ID is required.');
      return;
    }

    setUploading(true);
    try {
      const updatedData = { ...formData };
      editFields.forEach(field => {
        if (field.selectedField) {
          updatedData[field.selectedField] = field.editValue;
        }
      });

      // Assuming API call here
      // await updateCase(updatedData);
      
      if (onEditSuccess) {
        onEditSuccess();
      }
      setShowEditOptions(false);
      setEditFields([]);
      setError('');
    } catch (err) {
      setError(err.message || 'Error updating case');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Incident ID"
            value={formData.incID}
            onChange={(e) => setFormData({...formData, incID: e.target.value})}
            fullWidth
            required
            error={!!error}
            helperText={error}
          />
        </Grid>

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleIncIDSubmit}
            disabled={uploading}
          >
            Proceed to Edit
          </Button>
        </Grid>

        {showEditOptions && (
          <>
            {editFields.map((field, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Select Field to Edit"
                    variant="outlined"
                    fullWidth
                    value={field.selectedField}
                    onChange={(e) => handleFieldSelection(index, e.target.value)}
                    required
                  >
                    {Object.keys(formData).map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {field.selectedField && (
                  <Grid item xs={12}>
                    {field.isBoolean ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.editValue}
                            onChange={(e) => handleFieldValueChange(index, e.target.checked)}
                          />
                        }
                        label={`Set ${field.selectedField}`}
                      />
                    ) : (
                      <TextField
                        label="New Value"
                        variant="outlined"
                        type={typeof formData[field.selectedField] === 'number' ? 'number' : 'text'}
                        fullWidth
                        value={field.editValue}
                        onChange={(e) => handleFieldValueChange(index, e.target.value)}
                        required
                      />
                    )}
                  </Grid>
                )}
              </React.Fragment>
            ))}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={addEditField}
                disabled={uploading}
              >
                Edit Another Field
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save All Changes'}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </form>
  );
}

export default React.memo(EditCase);