import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';

function CreateCase({ onUploadSuccess }) {
  const [caseInfo, setCaseInfo] = useState('');  // State for case information input
  const [file, setFile] = useState(null);        // State for the file to be uploaded
  const [caseType, setCaseType] = useState('');  // State for the selected case type
  const [uploading, setUploading] = useState(false);  // State to show upload progress

  // Universal Fields
  const [incID, setIncID] = useState('');
  const [dateReported, setDateReported] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [totalQTY, setTotalQTY] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [carID, setCarID] = useState('');

  // Customs Fields
  const [customsPortAgency, setCustomsPortAgency] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [locationRecovered, setLocationRecovered] = useState('');
  const [seizureDate, setSeizureDate] = useState('');
  const [bondAmount, setBondAmount] = useState('');
  const [infringementType, setInfringementType] = useState('');

  // Subpoena and Cease & Desist Fields
  const [subpoena, setSubpoena] = useState(false);
  const [subpoenaOpen, setSubpoenaOpen] = useState(false);
  const [ceaseDesist, setCeaseDesist] = useState(false);
  const [ceaseDesistOpen, setCeaseDesistOpen] = useState(false);

  // Additional Boolean Fields
  const [dueDiligence, setDueDiligence] = useState(false);
  const [enhancedDueDiligence, setEnhancedDueDiligence] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [image, setImage] = useState(false);

  // Notes
  const [notes, setNotes] = useState('');

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate required fields
    if (!incID || !dateReported || !incidentType) {
        setError('Please provide all required fields.');
        return;
    }

    setUploading(true);

    try {
        const data = {
            incID,
            dateReported,
            incidentType,
            totalQTY,
            region,
            country,
            stateProvince,
            carID,
            customsPortAgency,
            destinationCountry,
            originCountry,
            locationRecovered,
            seizureDate,
            bondAmount,
            infringementType,
            subpoena: subpoena.toString(),
            subpoenaOpen: subpoenaOpen.toString(),
            ceaseDesist: ceaseDesist.toString(),
            ceaseDesistOpen: ceaseDesistOpen.toString(),
            dueDiligence: dueDiligence.toString(),
            enhanced: enhanced.toString(),
            image: image.toString(),
            notes
        };

        // const response = await createIncident({ body: data });
        
        alert('Entry created successfully!');
        resetForm();
        
        if (onUploadSuccess) {
            onUploadSuccess();
        }
    } catch (error) {
        console.error('Error creating entry:', error);
        setError(error.message || 'Error creating entry. Please try again.');
    } finally {
        setUploading(false);
    }
  };

  const resetForm = () => {
    setIncID('');
    setDateReported('');
    setIncidentType('');
    setTotalQTY('');
    setRegion('');
    setCountry('');
    setStateProvince('');
    setCarID('');
    setCustomsPortAgency('');
    setDestinationCountry('');
    setOriginCountry('');
    setLocationRecovered('');
    setSeizureDate('');
    setBondAmount('');
    setInfringementType('');
    setSubpoena(false);
    setSubpoenaOpen(false);
    setCeaseDesist(false);
    setCeaseDesistOpen(false);
    setDueDiligence(false);
    setEnhancedDueDiligence(false);
    setEnhanced(false);
    setImage(false);
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Case Name" variant="outlined" fullWidth value={caseInfo} onChange={(e) => setCaseInfo(e.target.value)} required />
        </Grid>
        <Grid item xs={12}>
          <TextField select label="Case Type" variant="outlined" fullWidth value={caseType} onChange={(e) => setCaseType(e.target.value)} required>
            {/* Case types */}
          </TextField>
        </Grid>

        {/* Universal Fields */}
        <Grid item xs={6}>
          <TextField label="Incident ID" variant="outlined" fullWidth value={incID} onChange={(e) => setIncID(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Date Reported" type="date" InputLabelProps={{ shrink: true }} variant="outlined" fullWidth value={dateReported} onChange={(e) => setDateReported(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Incident Type" variant="outlined" fullWidth value={incidentType} onChange={(e) => setIncidentType(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Total QTY" variant="outlined" fullWidth value={totalQTY} onChange={(e) => setTotalQTY(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Region" variant="outlined" fullWidth value={region} onChange={(e) => setRegion(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Country" variant="outlined" fullWidth value={country} onChange={(e) => setCountry(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="State/Province" variant="outlined" fullWidth value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="CAR ID" variant="outlined" fullWidth value={carID} onChange={(e) => setCarID(e.target.value)} />
        </Grid>

        {/* Customs Fields */}
        <Grid item xs={6}>
            <TextField label="Customs Port/Agency" variant="outlined" fullWidth value={customsPortAgency} onChange={(e) => setCustomsPortAgency(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
            <TextField label="Country of Destination" variant="outlined" fullWidth value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
            <TextField label="Country of Origin" variant="outlined" fullWidth value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
            <TextField label="Location Recovered" variant="outlined" fullWidth value={locationRecovered} onChange={(e) => setLocationRecovered(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
            <TextField label="Seizure Date" type="date" InputLabelProps={{ shrink: true }} variant="outlined" fullWidth value={seizureDate} onChange={(e) => setSeizureDate(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
            <TextField label="Bond Amount" variant="outlined" fullWidth value={bondAmount} onChange={(e) => setBondAmount(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
            <TextField label="Customs IPR Infringement Type" variant="outlined" fullWidth value={infringementType} onChange={(e) => setInfringementType(e.target.value)} />
        </Grid>

        {/* Subpoena, Cease & Desist, and Additional Booleans */}
        <Grid item xs={6}>
            <TextField select label="Subpoena" variant="outlined" fullWidth value={subpoena} onChange={(e) => setSubpoena(e.target.value)}>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="n/a">N/A</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={6}>
            <TextField select label="Subpoena Open/Closed" variant="outlined" fullWidth value={subpoenaOpen} onChange={(e) => setSubpoenaOpen(e.target.value)}>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="n/a">N/A</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={6}>
            <TextField select label="Cease & Desist" variant="outlined" fullWidth value={ceaseDesist} onChange={(e) => setCeaseDesist(e.target.value)}>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="n/a">N/A</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={6}>
            <TextField select label="Cease & Desist Open/Closed" variant="outlined" fullWidth value={ceaseDesistOpen} onChange={(e) => setCeaseDesistOpen(e.target.value)}>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="n/a">N/A</MenuItem>
            </TextField>
        </Grid>

        <Grid item xs={6}>
            <TextField select label="Due Diligence" variant="outlined" fullWidth value={dueDiligence} onChange={(e) => setDueDiligence(e.target.value)}>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="n/a">N/A</MenuItem>
            </TextField>
        </Grid>

        <Grid item xs={6}>
            <TextField select label="Enhanced Due Diligence" variant="outlined" fullWidth value={enhancedDueDiligence} onChange={(e) => setEnhancedDueDiligence(e.target.value)}>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="n/a">N/A</MenuItem>
            </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField label="Notes" multiline rows={4} variant="outlined" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default React.memo(CreateCase);
