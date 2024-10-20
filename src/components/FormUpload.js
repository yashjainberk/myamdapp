import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { BlobServiceClient } from "@azure/storage-blob";

function FormUpload({ onUploadSuccess }) {
  const [caseInfo, setCaseInfo] = useState('');  // State for case information input
  const [file, setFile] = useState(null);        // State for the file to be uploaded
  const [caseType, setCaseType] = useState('');  // State for the selected case type
  const [uploading, setUploading] = useState(false);  // State to show upload progress

  // States for additional information based on case type
  const [mediaInquiryDetails, setMediaInquiryDetails] = useState('');
  const [ngoInquiryDetails, setNgoInquiryDetails] = useState('');
  const [subpoenaDetails, setSubpoenaDetails] = useState('');

  // Specific fields for each case type
  const [mediaSource, setMediaSource] = useState('');
  const [ngoOrganization, setNgoOrganization] = useState('');
  const [subpoenaJurisdiction, setSubpoenaJurisdiction] = useState('');

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

    let additionalDetails = '';
    switch (caseType) {
      case 'media-inquiries':
        if (!mediaInquiryDetails || !mediaSource) {
          alert('Please provide Media Inquiry details and Source.');
          return;
        }
        additionalDetails = `${mediaInquiryDetails}, Source: ${mediaSource}`;
        break;
      case 'ngo-inquiries':
        if (!ngoInquiryDetails || !ngoOrganization) {
          alert('Please provide NGO Inquiry details and the NGO Organization.');
          return;
        }
        additionalDetails = `${ngoInquiryDetails}, Organization: ${ngoOrganization}`;
        break;
      case 'subpoenas':
        if (!subpoenaDetails || !subpoenaJurisdiction) {
          alert('Please provide Subpoena details and Jurisdiction.');
          return;
        }
        additionalDetails = `${subpoenaDetails}, Jurisdiction: ${subpoenaJurisdiction}`;
        break;
      default:
        break;
    }

    if (!additionalDetails) {
      alert('Please provide specific details for the selected case type.');
      return;
    }

    setUploading(true);

    try {
      // Debugging to see form data before upload
      console.log("Uploading:", { caseInfo, file, caseType, additionalDetails });

      // Use your SAS URL here
      const blobSasUrl = 'https://amdupsynctest.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-21T07:05:13Z&st=2024-10-20T23:05:13Z&spr=https&sig=Ll613EbTgEqf4okzvfCTLkLK%2FYyhaKamHscQELbMiVA%3D';
      const blobServiceClient = new BlobServiceClient(blobSasUrl);

      // All uploads are now going into the 'folders' container
      const containerClient = blobServiceClient.getContainerClient('subpoenas'); 

      // Create the full path for the file in the format caseType/filename (e.g., ngo-inquiries/file.png)
      const blobPath = `${caseType}/${file.name}`;
      const blobClient = containerClient.getBlockBlobClient(blobPath);

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
      setMediaInquiryDetails('');
      setNgoInquiryDetails('');
      setSubpoenaDetails('');
      setMediaSource('');
      setNgoOrganization('');
      setSubpoenaJurisdiction('');

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

  // Function to render case-type specific questions
  const renderCaseTypeSpecificFields = () => {
    switch (caseType) {
      case 'media-inquiries':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Media Inquiry Details"
                variant="outlined"
                fullWidth
                value={mediaInquiryDetails}
                onChange={(e) => setMediaInquiryDetails(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Source of Media Inquiry"
                variant="outlined"
                fullWidth
                value={mediaSource}
                onChange={(e) => setMediaSource(e.target.value)}
                required
              />
            </Grid>
          </>
        );
      case 'ngo-inquiries':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="NGO Inquiry Details"
                variant="outlined"
                fullWidth
                value={ngoInquiryDetails}
                onChange={(e) => setNgoInquiryDetails(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="NGO Organization"
                variant="outlined"
                fullWidth
                value={ngoOrganization}
                onChange={(e) => setNgoOrganization(e.target.value)}
                required
              />
            </Grid>
          </>
        );
      case 'subpoenas':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Subpoena Details"
                variant="outlined"
                fullWidth
                value={subpoenaDetails}
                onChange={(e) => setSubpoenaDetails(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Jurisdiction"
                variant="outlined"
                fullWidth
                value={subpoenaJurisdiction}
                onChange={(e) => setSubpoenaJurisdiction(e.target.value)}
                required
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Text field for case information */}
          <TextField
            label="Case Name"
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

        {/* Render case-type specific fields dynamically */}
        {renderCaseTypeSpecificFields()}

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