import {Grid, MenuItem, TextField} from "@mui/material";
import React from "react";

export default function GovtInquiries({ tags, setTags, incID, setincID, incidentType, setincidentType, country, setcountry, totalQTY, settotalQTY, dateReported, setdateReported, region, setregion, stateprovince, setstateprovince, car}) {
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
                    onChange={(e) => {
                        setincID(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            incidentId: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Incident Type"
                    variant="outlined"
                    fullWidth
                    value={incidentType}
                    onChange={(e) => {
                        setincidentType(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            incidentType: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={country}
                    onChange={(e) => {
                        setcountry(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            country: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Total QTY of Parts"
                    variant="outlined"
                    fullWidth
                    value={totalQTY}
                    onChange={(e) => {
                        settotalQTY(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            totalQty: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Date Reported"
                    variant="outlined"
                    fullWidth
                    value={dateReported}
                    onChange={(e) => {
                        setdateReported(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            dateReported: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Region"
                    variant="outlined"
                    fullWidth
                    value={region}
                    onChange={(e) => {
                        setregion(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            region: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="State/Province"
                    variant="outlined"
                    fullWidth
                    value={stateprovince}
                    onChange={(e) => {
                        setstateprovince(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            stateProvince: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="CAR ID"
                    variant="outlined"
                    fullWidth
                    value={carID}
                    onChange={(e) => {
                        setcarID(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            carId: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
        </>
    );
}