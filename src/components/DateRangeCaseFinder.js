import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, Modal, Grid, Box, Card, CardContent, Typography, Select, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormControl from '@mui/material/FormControl';
import { Fab } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputLabel from '@mui/material/InputLabel';


export default function DateRangeCaseFinder() {
    const [incList, setIncList] = useState([]);
    const [casesInRange, setCasesInRange] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModals, setOpenModals] = useState([]);
    const [selectedCaseData, setSelectedCaseData] = useState(null)
    const [selectedCases, setSelectedCases] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [selectedCaseType, setSelectedCaseType] = useState('All');
    const caseTypes = ['All', 'Federal Gov Inv', 'Media Inquiry', 'Customs Seizure', 'NGO Inquiry', 'Broker Investigations', 'Counterfeit'];

    // Fetch all incident IDs
    const fetchAllIncIDs = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get_all_incid?code=aynHa1NXN05yhzsr3Uzw3C2aDUpAU9Brdm-IIwmvFQyrAzFuzZ3kBQ%3D%3D");
            let values = Object.values(response.data)[0];

            setIncList(values || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data for a specific incident ID
    const fetchIncidentData = async (incidentID) => {
        try {
            const response = await axios.get("https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get_data_by_incid?code=R8ilmVIbxvUlIneVlUaH8XSHzw-re81Bge7li0jHf0-GAzFu-F-7mQ%3D%3D", {
                params: { 'incidentID': incidentID },
            });
            return response.data;
        } catch (err) {
            console.error(`Error fetching data for incident ${incidentID}:`, err);
            throw err;
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCaseSelection = (caseData) => {
        setSelectedCases((prevSelected) => {
            const exists = prevSelected.find((caseItem) => caseItem.IncID === caseData.IncID);
            if (exists) {
                return prevSelected.filter((caseItem) => caseItem.IncID !== caseData.IncID);
            }
            return [...prevSelected, caseData];
        });
    };

    const handleViewCases = () => {
        const selectedCaseDetails = casesInRange.filter((caseData) => {
            return selectedCases.includes(caseData[0].IncID)
        }).map(incident => incident[0]);        
        setOpenModals(selectedCaseDetails);
    };

    // Fetch and filter incidents by date range
    useEffect(() => {
        setCasesInRange([])
        setError(null)

        const fetchAndFilterCases = async () => {
            if (startDate && endDate) {
                try {
                    setLoading(true);
                    
                    let filtered_by_case = incList
                    if (selectedCaseType !== 'All'){
                        filtered_by_case = incList.filter((incident) => {return incident[1] === selectedCaseType})
                    }

                    const promises = filtered_by_case.map(incId => fetchIncidentData(incId[0]));
                    let responses = await Promise.all(promises);

                    // Filter responses by date range
                    const filteredCases = responses.filter(incident => {
                        const incidentDate = new Date(incident[0].Date_Reported);
                        return incidentDate >= startDate && incidentDate <= endDate;
                    });

                    setCasesInRange(filteredCases);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAndFilterCases();
    }, [startDate, endDate, selectedCaseType]);

    // Initialize the list of incidents on component mount
    useEffect(() => {
        fetchAllIncIDs();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            {/** Case Modal **/}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="cases-modal-title"
                aria-describedby="cases-modal-description"
            >
                <Box sx={{
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    p: 4,
                    bgcolor: 'background.paper',
                    margin: 'auto',
                    mt: '2.5%'
                }}>
                    <Grid container justifyContent="space-between">
                        <Typography id="cases-modal-title" variant="h6" component="h2">
                            Selected Cases
                        </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCloseModal}
                                sx={{
                                    marginTop: "20px",
                                    fontWeight: "bold",
                                    textTransform: "none", 
                                    borderRadius: "8px", 
                                }}
                            >
                                Close
                        </Button>
                    </Grid>
                    
                    {selectedCases.length > 0 ? (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {selectedCases.map((caseData, index) => (
                                <Grid item xs={12/Math.min(selectedCases.length, 3)} key={index}>
                                    <Card sx={{ mb: 2, height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6">{caseData.IncID}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Reported on: {new Date(caseData.Date_Reported).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                            {Object.entries(caseData).map(([key, value]) => (
                                                key !== "IncID" && key !== "Date_Reported" && (
                                                    <Typography key={key} variant="body2">
                                                        <strong>{key.replace(/_/g, ' ')}:</strong> {value !== null ? value : 'N/A'}
                                                    </Typography>
                                                )
                                            ))}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography>No cases selected.</Typography>
                    )}
                </Box>
            </Modal>

            <Typography variant="h4" gutterBottom>
                Case Viewer by Date Range
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 3 }}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
            </LocalizationProvider>

            {loading && <Typography>Loading cases...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && casesInRange.length > 0 && (
                <Grid container spacing={3}>
                    {casesInRange.map((incident, index) => (
                        <Grid item xs={12} sm={6} md={4} key={`${incident[0].IncID}-${index}`}>
                            <Card key={incident[0].IncID} sx={{ mb: 2 }}>
                                <CardContent sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}>
                                    <Grid>
                                        <Typography variant="h6">{incident[0].IncID}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Reported on: {new Date(incident[0].Date_Reported).toLocaleString(
                                                'en-US',
                                                { year: 'numeric', month: 'long', day: 'numeric' }
                                            )}
                                        </Typography>
                                    </Grid>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedCases.some((caseItem) => caseItem.IncID === incident[0].IncID)}
                                                onChange={() => handleCaseSelection(incident[0])}
                                                sx={{
                                                    "& .MuiSvgIcon-root": {
                                                        fontSize: 32, 
                                                    },
                                                }}
                                                color="primary" 
                                            />
                                        }
                                        sx={{
                                            fontSize: "1.2rem", 
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
                )}

            <Fab
                color="primary"
                aria-label="view-cases"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleOpenModal}
                disabled={selectedCases.length === 0} // Disable if no cases are selected
            >
                <VisibilityIcon />
            </Fab>
        </Box>
    );
}
