import React, {useEffect, useState} from 'react';
import { TextField, Button, Grid, MenuItem, LinearProgress } from '@mui/material';
import { BlobServiceClient } from "@azure/storage-blob";
import MediaInquiries from './CaseTypes/Media Inquiries';
import NGOInquiries from './CaseTypes/NGO Inquiries';
import Subpoenas from './CaseTypes/Subpoenas';
import BrokerInvestigations from "./CaseTypes/Broker Investigations";
import CeaseDesist from "./CaseTypes/Cease Desist";
import Counterfeit from "./CaseTypes/Counterfeit";
import CustomsSeizures from "./CaseTypes/Customs Seizures";
import GovtInquiries from "./CaseTypes/Govt Inquiries";

function FormUpload({ onUploadSuccess }) {
  const [caseInfo, setCaseInfo] = useState('');  // State for case information input
  const [files, setFiles] = useState([]); 
  const [uploadProgress, setUploadProgress] = useState([]);
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
  // const [CounterfeitDetails, setCounterfeitDetails] = useState('');
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
  const [infringementType, setInfringementType] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [locationRecovered, setLocationRecovered] = useState('');
  const [bondAmount, setBondAmount] = useState('');

  const [ceaseDesistOpen, setceaseDesistOpen] = useState('');

  const caseTypes = [
    { label: 'Media Inquiries', value: 'Media Inquiries' },
    { label: 'NGO Inquiries', value: 'NGO Inquiries' },
    { label: 'Subpoenas', value: 'Subpoenas' },
    { label: 'Broker Investigations', value: 'Broker Investigations' },
    { label: 'Cease and Desist', value: 'Cease and Desist' },
    { label: 'Counterfeit', value: 'Counterfeit' },
    { label: 'Customs Seizures', value: 'Customs Seizures' },
    { label: 'Govt Law Enforcement Inquiries', value: 'Govt & Law Enforcement Inquiries' },
  ];

  // SSOT: UPDATE CASE METADATA IN JSON
  async function updateCaseMetadata(caseID, metadata) {
    try {
        const blobSasUrl = 'https://dvuemoresa.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2030-12-11T14:14:30Z&st=2024-12-11T06:14:30Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=W0ICAkbG5yG%2BFS1ycFFiSiechmCxF9orgKxeNoQT10g%3D';
        const blobServiceClient = new BlobServiceClient(blobSasUrl);
        const containerClient = blobServiceClient.getContainerClient('my-container');

        // Define the path to the metadata file
        const caseMetadataBlobPath = `${caseType}/${caseID}/${caseID}.json`; // Use JSON extension
        const blobClient = containerClient.getBlockBlobClient(caseMetadataBlobPath);

        // Convert metadata to JSON string with formatting
        const metadataJSON = JSON.stringify(metadata, null, 2);

        // Upload the JSON string as a blob
        await blobClient.upload(metadataJSON, metadataJSON.length, {
            blobHTTPHeaders: { blobContentType: 'application/json' }, // Set MIME type to application/json
        });

        console.log('Case metadata updated successfully');
    } catch (error) {
        console.error('Error updating case metadata:', error);
    }
  }

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to array
    setFiles(selectedFiles);
    setUploadProgress(new Array(selectedFiles.length).fill(0)); // Initialize progress for each file
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
    if (caseType === 'Media Inquiries') {
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

    if (caseType === 'Customs Seizures') {
      json_1['customsPortAgency'] = customsPortAgency;
      json_1['destinationCountry'] = destinationCountry;
      json_1['seizureDate'] = seizureDate;
      json_1['infringementType'] = infringementType;
      json_1['originCountry'] = originCountry;
      json_1['locationRecovered'] = locationRecovered;
      json_1['bondAmount'] = bondAmount;
    }

    if (caseType === 'Govt & Law Enforcement Inquiries') {
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    }

    if (caseType === 'Cease and Desist') {
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

    if (caseType === 'Counterfeit') {
      json_1['infringementType'] = infringementType;
      json_1['originCountry'] = originCountry;
      json_1['locationRecovered'] = locationRecovered;
      json_1['bondAmount'] = bondAmount;
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
    } 

    if (caseType === 'Broker Investigations') {
      json_1['incidentId'] = incID;
      json_1['incidentType'] = incidentType;
      json_1['country'] = country;
      json_1['totalQty'] = totalQTY;
      json_1['dateReported'] = dateReported;
      json_1['region'] = region;
      json_1['stateProvince'] = stateprovince;
      json_1['carId'] = carID;
    } 

    if (caseType === 'NGO Inquiries') {
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

    if (caseType === 'Subpoenas') {
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
    event.preventDefault();
    if (!caseInfo || files.length === 0 || !caseType) {
      alert('Please provide case information, select a case type, and choose at least one file.');
      return;
    }

    setUploading(true);
    const blobSasUrl = 'https://dvuemoresa.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2030-12-11T14:14:30Z&st=2024-12-11T06:14:30Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=W0ICAkbG5yG%2BFS1ycFFiSiechmCxF9orgKxeNoQT10g%3D';
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerClient = blobServiceClient.getContainerClient('my-container');

    // SSOT: Create a unique identifier for the case
    const metadata = {
      ...tags,
    }

    try {
      // Map over each file to upload and track progress
      const uploadPromises = files.map((file, index) => {
        const blobPath = `${caseType}/${incID}/${file.name}`;
        const blobClient = containerClient.getBlockBlobClient(blobPath);

        const uploadOptions = {
          blobHTTPHeaders: {
            blobContentType: file.type,
          },
          tags: tags,
          onProgress: (ev) => {
            const progress = Math.round((ev.loadedBytes / file.size) * 100);
            setUploadProgress((prevProgress) => {
              const updatedProgress = [...prevProgress];
              updatedProgress[index] = progress;
              return updatedProgress;
            });
          }
        };

   

        return blobClient.uploadData(file, uploadOptions);
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      console.log('Files uploaded successfully');

      await updateCaseMetadata(incID, metadata);

      alert("Upload and metadata update completed!");
      
      resetForm(); // Reset form after successful upload
      if (onUploadSuccess) onUploadSuccess(); // Trigger callback if provided

    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files or uploading metadata. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Reset form fields after upload
  const resetForm = () => {
    setCaseInfo('');
    setFiles([]);
    setUploadProgress([]);
    setCaseType('');
    setincID('');
    setincidentType('');
    setcountry('');
    settotalQTY('');
    setdateReported('');
    setregion('');
    setstateprovince('');
    setcarID('');
    setTags({});
    setMediaSource('');
    setNgoOrganization('');
  };

  // Dynamically render case-type specific fields
  const renderCaseTypeSpecificFields = () => {
    switch (caseType) {
      case 'Media Inquiries':
        return (
            <MediaInquiries carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} mediaSource={mediaSource} setMediaSource={setMediaSource} />
        );
      case 'NGO Inquiries':
        return (
            <NGOInquiries carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} ngoOrganization={ngoOrganization} setNgoOrganization={setNgoOrganization} />
        );
      case 'Subpoenas':
        return (
           <Subpoenas carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} subpoenaJurisdiction={subpoenaJurisdiction} setSubpoenaJurisdiction={setSubpoenaJurisdiction} subpoenaOpen={subpoenaOpen} setSubpoenaOpen={setSubpoenaOpen} />
        );
        break;
      case 'Broker Investigations':
        return (
            <BrokerInvestigations carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} />
        );
      case 'Cease and Desist':
         return (
            <CeaseDesist carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} ceaseDesistOpen={ceaseDesistOpen} setceaseDesistOpen={setceaseDesistOpen} />
         );
      case 'Counterfeit':
        return (
            <Counterfeit carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} infringementType={infringementType} setInfringementType={setInfringementType} originCountry={originCountry} setOriginCountry={setOriginCountry} locationRecovered={locationRecovered} setLocationRecovered={setLocationRecovered} bondAmount={bondAmount} setBondAmount={setBondAmount} />
        );
      case 'Customs Seizures':
        return (
            <CustomsSeizures carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} customsPortAgency={customsPortAgency} setCustomsPortAgency={setCustomsPortAgency} destinationCountry={destinationCountry} setDestinationCountry={setDestinationCountry} seizureDate={seizureDate} setSeizureDate={setSeizureDate} infringementType={infringementType} setInfringementType={setInfringementType} originCountry={originCountry} setOriginCountry={setOriginCountry} locationRecovered={locationRecovered} setLocationRecovered={setLocationRecovered} bondAmount={bondAmount} setBondAmount={setBondAmount} />
        );
      case 'Govt & Law Enforcement Inquiries':
        return (
            <GovtInquiries carID={carID} setcarID={setcarID} stateprovince={stateprovince} setstateprovince={setstateprovince} region={region} setregion={setregion} dateReported={dateReported} setdateReported={setdateReported} totalQTY={totalQTY} settotalQTY={settotalQTY} country={country} setcountry={setcountry} incidentType={incidentType} setincidentType={setincidentType} incID={incID} setincID={setincID} setTags={setTags} tags={tags} />
        );
      default:
        return null;
    }
   };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Case Name" variant="outlined" fullWidth value={caseInfo} onChange={(e) => setCaseInfo(e.target.value)} required />
        </Grid>
        <Grid item xs={12}>
          <TextField select label="Case Type" variant="outlined" fullWidth value={caseType} onChange={(e) => setCaseType(e.target.value)} required>
            {caseTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Render case-type specific fields dynamically */}
        {renderCaseTypeSpecificFields()}

        <Grid item xs={12}>
          <input type="file" onChange={handleFileChange} multiple accept=".pdf,.png,.jpg,.jpeg,.txt" required />
        </Grid>

        {/* Display progress for each file */}
        {files.map((file, index) => (
          <Grid item xs={12} key={index}>
            <strong>{file.name}</strong>
            <LinearProgress variant="determinate" value={uploadProgress[index] || 0} sx={{ mt: 1 }} />
            <p>{uploadProgress[index] || 0}% uploaded</p>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default FormUpload;