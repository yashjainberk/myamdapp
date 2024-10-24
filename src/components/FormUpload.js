import React, {useEffect, useState} from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { BlobServiceClient } from "@azure/storage-blob";

function FormUpload({ onUploadSuccess }) {
  const [caseInfo, setCaseInfo] = useState('');  // State for case information input
  const [file, setFile] = useState(null);        // State for the file to be uploaded
  const [caseType, setCaseType] = useState('');  // State for the selected case type
  const [tagName, setTagName] = useState('');  // State for the selected tag name
  const [tagValue, setTagValue] = useState('');  // State for the selected tag value
  const [tagNameList, setTagNameList] = useState([]);  // State for the selected tag name
  const [tagValueList, setTagValueList] = useState([]);  // State for the selected tag value
  const [tags, setTags] = useState({});  // JSON for the selected tags
  const [uploading, setUploading] = useState(false);  // State to show upload progress
  
  // States for universal information for all case types
  const [incID, setincID] = useState('');
  const [incidentType, setincidentType] = useState('');
  const [country, setcountry] = useState('');
  const [totalQTY, settotalQTY] = useState('');
  const [dateReported, setdateReported] = useState('');
  const [region, setregion] = useState('');
  const [stateprovince, setstateprovince] = useState('');
  const [carID, setcarID] = useState('');
  
  // // States for additional information based on case type
  // const [mediaInquiryDetails, setMediaInquiryDetails] = useState('');
  // const [ngoInquiryDetails, setNgoInquiryDetails] = useState('');
  // const [subpoenaDetails, setSubpoenaDetails] = useState('');
  // const [brokerInvestigationsDetails, setbrokerInvestigationsDetails] = useState('');
  // const [ceaseDesistDetails, setceaseDesistDetails] = useState('');
  // const [counterfeitDetails, setcounterfeitDetails] = useState('');
  // const [customsSeizuresDetails, setcustomsSeizuresDetails] = useState('');
  // const [govtInquiriesDetails, setgovtInquiriesDetails] = useState('');

  // Specific fields for each case type
  const [mediaSource, setMediaSource] = useState('');
  const [ngoOrganization, setNgoOrganization] = useState('');
  const [subpoenaJurisdiction, setSubpoenaJurisdiction] = useState('');
  const [subpoenaOpen, setSubpoenaOpen] = useState('');
  
  //Customs Seizures Fields
  const [customsPortAgency, setCustomsPortAgency] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [seizureDate, setSeizureDate] = useState('');
  const [infringementType, setinfringementType] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [locationRecovered, setLocationRecovered] = useState('');
  const [bondAmount, setBondAmount] = useState('');

  const [ceaseDesistOpen, setceaseDesistOpen] = useState('');


  const caseTypes = [
    { label: 'Media Inquiries', value: 'media-inquiries' },
    { label: 'NGO Inquiries', value: 'ngo-inquiries' },
    { label: 'Subpoenas', value: 'subpoenas' },
    { label: 'Broker Investigations', value: 'broker-investigations' },
    { label: 'Cease and Desist', value: 'cease-desist' },
    { label: 'Counterfeit', value: 'counterfeit' },
    { label: 'Customs Seizures', value: 'customs-seizures' },
    { label: 'Govt Law Enforcement Inquiries', value: 'govt-inquiries' },
  ];

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const addTag = () => {
    setTagNameList([...tagNameList, tagName]);
    setTagValueList([...tagValueList, tagValue]);

    createTags()

    setTagName('');
    setTagValue('');
  }

  const createTags = () => {
    let json_1 = {}

    // create a json where key is tag name and value is tag value and values are connected by list index
    for (let i = 0; i < tagNameList.length; i++) {
      json_1[tagNameList[i]] = tagValueList[i];
    }
      // Add additional fields as tags
    if (caseType === 'media-inquiries') {
      json_1['sourceOfMediaInquiry'] = mediaSource;
      json_1['incidentId'] = incID;
      json_1['country'] = country;
      json_1['incidentType'] = incidentType;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    }

    if (caseType === 'customs-seizures') {
      json_1['customsPortAgency'] = customsPortAgency;
      json_1['destinationCountry'] = destinationCountry;
      json_1['seizureDate'] = seizureDate;
      json_1['infringementType'] = infringementType;
      json_1['originCountry'] = originCountry;
      json_1['locationRecovered'] = locationRecovered;
      json_1['bondAmount'] = bondAmount;
    }

    if (caseType === 'govt-inquiries') {
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    }

    if (caseType === 'cease-desist') {
      json_1['ceaseDesistOpen'] = ceaseDesistOpen;
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    } 

    if (caseType === 'counterfeit') {
      json_1['infringementType'] = infringementType;
      json_1['originCountry'] = originCountry;
      json_1['locationRecovered'] = locationRecovered;
      json_1['bondAmount'] = bondAmount;
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
    } 

    if (caseType === 'broker-investigations') {
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    } 

    if (caseType === 'ngo-inquiries') {
      json_1['ngoOrganization'] = ngoOrganization;
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    }

    if (caseType === 'subpoenas') {
      json_1['subpoenaJurisdiction'] = subpoenaJurisdiction;
      json_1['subpoenaOpen'] = subpoenaOpen;
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    }

    setTags(json_1)
  }

  useEffect(() => {
    createTags()
  }, [tagNameList, tagValueList])

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission

    if (!caseInfo || !file || !caseType) {
      alert('Please provide case information, select a case type, and choose a file.');
      return;
    }

    if (!tags.priority) {
      alert('Please select a priority.');
      return;
    }

    let additionalDetails = '';
    switch (caseType) {
      case 'media-inquiries':
        if (!mediaSource || !incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide Media Inquiry details and Source.');
          return;
        }
        // additionalDetails = `${mediaInquiryDetails}, Source: ${mediaSource}`;
        break;
      case 'ngo-inquiries':
        if (!ngoOrganization || !incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide NGO Inquiry details and the NGO Organization.');
          return;
        }
        // additionalDetails = `${ngoInquiryDetails}, Organization: ${ngoOrganization}`;
        break;
      case 'subpoenas':
        if (!subpoenaJurisdiction || !subpoenaOpen || !incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide Subpoena details and Jurisdiction.');
          return;
        }
        // additionalDetails = `${subpoenaDetails}, Jurisdiction: ${subpoenaJurisdiction}`;
        break;
      case 'broker-investigations':
        if (!incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide Subpoena details and Jurisdiction.');
          return;
        }
        // additionalDetails = `${subpoenaDetails}, Jurisdiction: ${subpoenaJurisdiction}`;
        break;
      case 'cease-desist':
        if (!ceaseDesistOpen || !incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide Media Inquiry details and Source.');
          return;
        }
        // additionalDetails = `${mediaInquiryDetails}, Source: ${mediaSource}`;
        break;
      case 'counterfeit':
        if (!incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide NGO Inquiry details and the NGO Organization.');
          return;
        }
        // additionalDetails = `${ngoInquiryDetails}, Organization: ${ngoOrganization}`;
        break;
      case 'customs-seizures':
        if (!customsPortAgency || !destinationCountry || !seizureDate || !infringementType 
          || !originCountry || !locationRecovered || !bondAmount || !incID || !incidentType || !country || !totalQTY || 
          !dateReported || !region || !stateprovince || !carID) {
          alert('Please provide all necessary details');
          return;
        }
        // additionalDetails = `${subpoenaDetails}, Jurisdiction: ${subpoenaJurisdiction}`;
        break;
      case 'govt-inquiries':
        if (!incID || !incidentType || 
          !country || !totalQTY || !dateReported || !region || !stateprovince || 
          !carID) {
          alert('Please provide Subpoena details and Jurisdiction.');
          return;
        }
        // additionalDetails = `${subpoenaDetails}, Jurisdiction: ${subpoenaJurisdiction}`;
        break;
      
      default:
        break;
    }

    // if (!additionalDetails) {
    //   alert('Please provide specific details for the selected case type.');
    //   return;
    // }

    setUploading(true);

    try {
      // Debugging to see form data before upload
      console.log("Uploading:", { caseInfo, file, caseType, additionalDetails });

      // Use your SAS URL here
      const blobSasUrl = 'https://amdupsynctest.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2026-08-08T06:58:12Z&st=2024-10-24T22:58:12Z&spr=https,http&sig=BeMYOypmexAYhYWexJYTSCjD1yf9Dw9y7KqKX1rROfI%3D';
      const blobServiceClient = new BlobServiceClient(blobSasUrl);

      // All uploads are now going into the 'folders' container
      const containerClient = blobServiceClient.getContainerClient('folders'); 

      // Create the full path for the file in the format caseType/filename (e.g., ngo-inquiries/file.png)
      const blobPath = `${caseType}/${file.name}`;
      const blobClient = containerClient.getBlockBlobClient(blobPath);


      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: file.type,  // Set the MIME type
        },
        tags: tags
      };

      await blobClient.uploadData(
          file,
          uploadOptions,
      );

      alert('File uploaded successfully!');

      // Clear input fields after successful upload
      setCaseInfo('');
      setFile(null);
      setCaseType('');

      //Clear Universal Fields
      setincID('');
      setincidentType('');
      setcountry('');
      settotalQTY('');
      setdateReported('');
      setregion('');
      setregion('');
      setstateprovince('');
      setcarID('');
      
      //Clear Details
      // setMediaInquiryDetails('');
      // setNgoInquiryDetails('');
      // setSubpoenaDetails('');
      // setbrokerInvestigationsDetails('');
      // setceaseDesistDetails('');
      // setcounterfeitDetails('');
      // setcustomsSeizuresDetails('');
      // setgovtInquiriesDetails('');
      // setMediaInquiryDetails('');
      // setNgoInquiryDetails('');
      // setSubpoenaDetails('');

      setMediaSource('');
      setNgoOrganization('');
      setSubpoenaJurisdiction('');
      setSubpoenaOpen('');
      setceaseDesistOpen('');
      

      //Customs Clear
      setCustomsPortAgency('');
      setDestinationCountry('');
      setSeizureDate('');
      setInfringementType('');
      setOriginCountry('');
      setLocationRecovered('');
      setBondAmount('');

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
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''} 
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
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
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
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
                  select
                  label="Priority"
                  variant="outlined"
                  fullWidth
                  value={tags.priority || ''}
                  onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                  required
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
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
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
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
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''} 
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
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
            <Grid item xs={12}>
              <TextField
                label="Open/Closed"
                variant="outlined"
                fullWidth
                value={subpoenaOpen}
                onChange={(e) => setSubpoenaOpen(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
                required
              />
            </Grid>
          </>
        );
          break;
      case 'broker-investigations':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''}
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
                required
              />
            </Grid>
          </>
        );
      case 'cease-desist':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''} 
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Open/Closed"
                variant="outlined"
                fullWidth
                value={ceaseDesistOpen}
                onChange={(e) => setceaseDesistOpen(e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
                required
              />
            </Grid>
          </>
        );        
      case 'counterfeit':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''} 
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
                required
              />
            </Grid>
          </>
        );
      case 'customs-seizures':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''} 
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Customs Port/Agency"
                variant="outlined"
                fullWidth
                value={customsPortAgency}
                onChange={(e) => setCustomsPortAgency(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Destination Country"
                variant="outlined"
                fullWidth
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Seizure Date"
                variant="outlined"
                fullWidth
                value={seizureDate}
                onChange={(e) => setSeizureDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Customs IPR Infringement Type"
                variant="outlined"
                fullWidth
                value={infringementType}
                onChange={(e) => setinfringementType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country of Origin"
                variant="outlined"
                fullWidth
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location Recovered"
                variant="outlined"
                fullWidth
                value={locationRecovered}
                onChange={(e) => setLocationRecovered(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bond Amount"
                variant="outlined"
                fullWidth
                value={bondAmount}
                onChange={(e) => setBondAmount(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
                required
              />
            </Grid>
          </>
        );
      case 'govt-inquiries':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                select
                label="Priority"
                variant="outlined"
                fullWidth
                value={tags.priority || ''} 
                onChange={(e) => setTags({ ...tags, priority: e.target.value })}
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
          </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident ID"
                variant="outlined"
                fullWidth
                value={incID}
                onChange={(e) => setincID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Incident Type"
                variant="outlined"
                fullWidth
                value={incidentType}
                onChange={(e) => setincidentType(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total QTY of Parts"
                variant="outlined"
                fullWidth
                value={totalQTY}
                onChange={(e) => settotalQTY(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Reported"
                variant="outlined"
                fullWidth
                value={dateReported}
                onChange={(e) => setdateReported(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setregion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State/Province"
                variant="outlined"
                fullWidth
                value={stateprovince}
                onChange={(e) => setstateprovince(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CAR ID"
                variant="outlined"
                fullWidth
                value={carID}
                onChange={(e) => setcarID(e.target.value)}
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

        <Grid item xs={12}>
          {/* Text field for case information */}
          <TextField
              label="Tag Name"
              variant="outlined"
              fullWidth
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          {/* Text field for case information */}
          <TextField
              label="Tag Value"
              variant="outlined"
              fullWidth
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
          />
        </Grid>
        <Button variant="contained" color="primary" onClick={addTag}>
            Add Tag
        </Button>

        {/* Render TagNameList and TagValueList */}
        {tagNameList.map((tag, index) => (
          <div key={index}>
            <p>{tag}: {tagValueList[index]}</p>
          </div>
        ))}


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