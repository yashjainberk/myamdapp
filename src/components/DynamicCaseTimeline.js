import React, {useState, useEffect} from "react"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import axios from 'axios'
import { Box, Card, CardContent, Typography, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function DynamicCaseTimeline() {
    const [incList, setIncList] = useState([]);
    const [cases, setCases] = useState([]);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedIncs, setSelectedIncs] = useState([]);
    const [timelineData, setTimelineData] = useState([]);

    const fetchAllIncIDs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "https://more-dashboard-apis.azurewebsites.net/api/get_all_incid?code=Zib5G0xs9j6WHxn8OMuz_kgsHb2hiPEgsh1i8DyQyekrAzFudod_Vw%3D%3D"
            );
            // Ensure we're setting an array of values
            setIncList(response || []); // Assuming the API returns { incident_ids: [...] }
            console.log("Fetched IDs:", response.data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching IDs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllIncIDs();
    }, []);

    const fetchIncidentData = async (incidentID) => {
        try {
            setLoading(true);
            const response = await axios.get(
                "https://more-dashboard-apis.azurewebsites.net/api/get_data_by_incid?code=SFJPvt2B3LFkzQ7cBoZok5JmfHXrs9H87eKVFbMQkMBzAzFuywMlEQ%3D%3D",
                {
                    params: { 'incidentID' : incidentID  },
                }
            );
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
                    setTimelineData(responses);
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
    }, [selectedIncs]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && !incList.length) {
        return <Typography>Loading incident IDs...</Typography>;
    }

    if (error && !incList.length) {
        return <Typography color="error">Error loading incident IDs: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ paddingBottom: "20px" }}>
                Dynamic Case Timeline
            </Typography>
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
                        <TimelineItem key={`${incident.incidentID}-${index}`}>
                            <TimelineOppositeContent color="text.secondary">
                                {formatDate(incident.date)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                {index !== timelineData.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {incident.incidentID}
                                        </Typography>
                                        <Typography variant="body2">
                                            {incident.description}
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