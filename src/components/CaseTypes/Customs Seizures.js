import {Grid, MenuItem, TextField} from "@mui/material";
import React, {useState, useEffect} from "react";

export default function CustomsSeizures({tags, setTags, customsPortAgency, setCustomsPortAgency, destinationCountry, setDestinationCountry, seizureDate, setSeizureDate, infringementType, setInfringementType, originCountry, setOriginCountry, locationRecovered, setLocationRecovered, bondAmount, setBondAmount, incID, setincID, incidentType, setincidentType, country, setcountry, totalQTY, settotalQTY, dateReported, setdateReported, region, setregion, stateprovince, setstateprovince, carID, setcarID }) {
    const [priority, setPriority] = useState(tags.priority || ""); // Local state for priority

  // Sync priority with tags whenever it changes
  useEffect(() => {
    setTags((prevTags) => ({
      ...prevTags,
      priority,
    }));
  }, [priority, setTags]);
  
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
                    onChange={(e) => {
                        setCustomsPortAgency(e.target.value); // Update the local state
                        setTags((prevTags) => ({
                            ...prevTags,
                            customsPortAgency: e.target.value, // Update the tags state
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Destination Country"
                    variant="outlined"
                    fullWidth
                    value={destinationCountry}
                    onChange={(e) => {
                        setDestinationCountry(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            destinationCountry: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Seizure Date"
                    variant="outlined"
                    fullWidth
                    value={seizureDate}
                    onChange={(e) => {
                        setSeizureDate(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            seizureDate: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Customs IPR Infringement Type"
                    variant="outlined"
                    fullWidth
                    value={infringementType}
                    onChange={(e) => {
                        setInfringementType(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            infringementType: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Country of Origin"
                    variant="outlined"
                    fullWidth
                    value={originCountry}
                    onChange={(e) => {
                        setOriginCountry(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            originCountry: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Location Recovered"
                    variant="outlined"
                    fullWidth
                    value={locationRecovered}
                    onChange={(e) => {
                        setLocationRecovered(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            locationRecovered: e.target.value,
                        }));
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Bond Amount"
                    variant="outlined"
                    fullWidth
                    value={bondAmount}
                    onChange={(e) => {
                        setBondAmount(e.target.value);
                        setTags((prevTags) => ({
                            ...prevTags,
                            bondAmount: e.target.value,
                        }));
                    }}
                    required
                />
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