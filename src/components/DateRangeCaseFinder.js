import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Card, CardContent, Typography, Select, MenuItem, OutlinedInput, Chip, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function DateRangeCaseFinder() {
    const [incList, setIncList] = useState([]);
    const [casesInRange, setCasesInRange] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedCaseType, setSelectedCaseType] = useState('All');

    const caseTypes = ['All', 'Federal Gov Inv', 'Media Inquiry', 'Customs Seizure', 'NGO Inquiry', 'Broker Investigations', 'Counterfeit'];

    // Fetch all incident IDs
    const fetchAllIncIDs = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:7071/api/get_all_incid");
            const values = Object.values(response.data)[0];

            // TODO: logic for filtering by case
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
            const response = await axios.get("http://localhost:7071/api/get_data_by_incid", {
                params: { 'incidentID': incidentID },
            });
            return response.data;
        } catch (err) {
            console.error(`Error fetching data for incident ${incidentID}:`, err);
            throw err;
        }
    };

    // Fetch and filter incidents by date range
    useEffect(() => {
        setCasesInRange([])
        setError(null)

        const fetchAndFilterCases = async () => {
            if (startDate && endDate) {
                try {
                    setLoading(true);
                    const promises = incList.map(incId => fetchIncidentData(incId));
                    const responses = await Promise.all(promises);

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
    }, [startDate, endDate]);

    // Initialize the list of incidents on component mount
    useEffect(() => {
        fetchAllIncIDs();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
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
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
                casesInRange.map((incident, index) => (
                    <Card key={`${incident[0].IncID}-${index}`} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{incident[0].IncID}</Typography>
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
                ))
            )}
        </Box>
    );
}
