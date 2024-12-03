import React, {useState, useEffect} from "react"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import axios from 'axios'
import { Modal, Box, Card, Grid, CardContent, Typography, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


const CaseModal = ({ open, handleClose, caseData }) => (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="case-modal-title"
      aria-describedby="case-modal-description"
    >
      <Box sx={{
      width: '80%',
      maxHeight: '80vh',
      overflowY: 'auto',
      p: 4,
      bgcolor: 'background.paper',
      margin: 'auto',
      mt: '5%'
    }}>
      <Typography id="case-modal-title" variant="h6" component="h2">
        Case Details
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {caseData && Object.entries(caseData).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Typography variant="body1" component="p"><strong>{key.replace(/_/g, ' ')}:</strong> {value !== null ? value : 'N/A'}</Typography>
          </Grid>
        ))}
      </Grid>
      <button onClick={handleClose} style={{ marginTop: '20px' }}>Close</button>
    </Box>
    </Modal>
  );


export default function DynamicCaseTimeline() {
    const [incList, setIncList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedIncs, setSelectedIncs] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [selectedCaseType, setSelectedCaseType] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCaseData, setSelectedCaseData] = useState(null);

    const caseTypes = ['All', 'Federal Gov Inv', 'Media Inquiry', 'Customs Seizure', 'NGO Inquiry', 'Broker Investigations', 'Counterfeit'];

    const fetchAllIncIDs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                // "https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get_all_incid?code=aynHa1NXN05yhzsr3Uzw3C2aDUpAU9Brdm-IIwmvFQyrAzFuzZ3kBQ%3D%3D"
                "http://localhost:7071/api/get_all_incid"
            );

            // TODO: logic for filtering by case

             // Access the 'data' property of the response
            let values = Object.values(response.data)[0];

            setIncList(values || []);
            console.log("Fetched IDs:", values);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching IDs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllIncIDs();
        console.log(incList)
    }, [selectedCaseType]);

    const fetchIncidentData = async (incidentID) => {
        try {
            setLoading(true);
            const response = await axios.get(
                // "https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get_data_by_incid?code=R8ilmVIbxvUlIneVlUaH8XSHzw-re81Bge7li0jHf0-GAzFu-F-7mQ%3D%3D",
                "http://localhost:7071/api/get_data_by_incid",
                {
                    params: { 'incidentID' : incidentID  },
                }
            );
            
            console.log(response.data)
            return response.data;
        } catch (err) {
            console.error(`Error fetching data for incident ${incidentID}:`, err);
            throw err;
        }
    };

    const handleIncidentSelect = (event) => {
        const value = event.target.value;
        setSelectedIncs(typeof value === 'string' ? value.split(',') : value);
    };

    useEffect(() => {
        const fetchSelectedData = async () => {
            if (selectedIncs.length > 0) {
                try {
                    setLoading(true);
                    const promises = selectedIncs.map(incId => fetchIncidentData(incId));
                    const responses = await Promise.all(promises);
                    
                    // Sort incidents by Date_Reported before setting timelineData
                    const sortedResponses = responses.sort((a, b) => {
                        const dateA = new Date(a[0].Date_Reported);
                        const dateB = new Date(b[0].Date_Reported);
                        return dateA - dateB; // Ascending order
                    });
                    
                    setTimelineData(sortedResponses);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setTimelineData([]);
            }
        };

        fetchSelectedData();
    }, [selectedIncs, selectedCaseType]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    const handleItemClick = (caseData) => {
        setSelectedCaseData(caseData);
        setModalOpen(true);
      };
    
    const handleClose = () => setModalOpen(false);


    if (loading && !incList.length) {
        return <Typography>Loading incident IDs...</Typography>;
    }

    if (error && !incList.length) {
        return <Typography color="error">Error loading incident IDs: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <CaseModal open={modalOpen} handleClose={handleClose} caseData={selectedCaseData} />

            <Typography variant="h4" gutterBottom sx={{ paddingBottom: "20px" }}>
                Dynamic Case Timeline
            </Typography>

            <FormControl fullWidth>
                <InputLabel>Case Type</InputLabel>
                <Select value={selectedCaseType} onChange={(e) => 
                    {
                        setSelectedCaseType(e.target.value)
                    }}>
                {caseTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
                </Select>
            </FormControl>

            <FormControl sx={{ width: '100%', mb: 3 }}>
                <InputLabel id="incident-select-label">Select Incidents</InputLabel>
                <Select
                    labelId="incident-select-label"
                    multiple
                    value={selectedIncs}
                    onChange={handleIncidentSelect}
                    input={<OutlinedInput label="Select Incidents" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {incList.length > 0 ? (
                        incList.map((inc) => (
                            <MenuItem key={inc} value={inc}>
                                {inc}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No incidents available</MenuItem>
                    )}
                </Select>
            </FormControl>

            {loading && <Typography>Loading timeline data...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && timelineData.length > 0 && (
                <Timeline position="alternate">
                    {timelineData.map((incident, index) => (
                        <TimelineItem key={`${incident[0].IncID}-${index}`}>
                            <TimelineOppositeContent color="text.secondary">
                                {formatDate(incident[0].Date_Reported)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                {index !== timelineData.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Card>
                                    <CardContent onClick={() => handleItemClick(incident[0])}>
                                        <Typography variant="h6">
                                            {incident[0].IncID}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Reported on: {new Date(incident[0].Date_Reported).toLocaleString(
                                                'en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }
                                            )}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            )}
        </Box>
    );
}