import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { BlobServiceClient } from "@azure/storage-blob";

function FormUpload({ onUploadSuccess }) {
  const [caseInfo, setCaseInfo] = useState('');  // State for case information input
  const [file, setFile] = useState(null);        // State for the file to be uploaded
  const [caseType, setCaseType] = useState('');  // State for the selected case type
  const [uploading, setUploading] = useState(false);  // State to show upload progress

  const caseTypes = [
    { label: 'Media Inquiries', value: 'media-inquiries' },
    { label: 'NGO Inquiries', value: 'ngo-inquiries' },
    { label: 'Subpoenas', value: 'subpoenas' },
  ];

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission

    if (!caseInfo || !file || !caseType) {
      alert('Please provide case information, select a case type, and choose a file.');
      return;
    }

    setUploading(true);

    try {
      // Use your SAS URL here
      const blobSasUrl = 'https://amdcases.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-20T10:04:29Z&st=2024-10-20T02:04:29Z&spr=https&sig=RuWyBbgFAyIIsMfr4N9bV%2Bp5Ji80GpyMEmSb7kr7Ijk%3D';
      const blobServiceClient = new BlobServiceClient(blobSasUrl);
      const containerClient = blobServiceClient.getContainerClient(caseType); // Upload to the selected case type's container

      // Create a block blob client and upload the file
      const blobClient = containerClient.getBlockBlobClient(file.name);

      await blobClient.uploadBrowserData(file, {
        blobHTTPHeaders: {
          blobContentType: file.type,  // Set the MIME type
        },
      });

      alert('File uploaded successfully!');

      // Clear input fields after successful upload
      setCaseInfo('');
      setFile(null);
      setCaseType('');

      if (onUploadSuccess) {
        onUploadSuccess();  // Trigger refresh callback if provided
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Text field for case information */}
          <TextField
            label="Case Information"
            variant="outlined"
            fullWidth
            value={caseInfo}
            onChange={(e) => setCaseInfo(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          {/* Dropdown for case type selection */}
          <TextField
            select
            label="Case Type"
            variant="outlined"
            fullWidth
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            required
          >
            {caseTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          {/* Input for file selection */}
          <input
            type="file"
            onChange={handleFileChange}
            required
            accept=".pdf,.png,.jpg,.jpeg,.txt"
          />
        </Grid>
        <Grid item xs={12}>
          {/* Submit button */}
          <Button variant="contained" color="primary" type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default FormUpload;
