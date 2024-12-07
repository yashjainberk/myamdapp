import React, { useState } from 'react';
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from '@mui/material';

const tagInfo = {
    allKeys: ['priority', 'incID'], // Add your tags here
    valueMap: {
        priority: ['High', 'Medium', 'Low'],
        incID: ['1234', '5678', '91011'], // Sample values for each tag
    },
};

const handleFilterChange = (filters) => {
    return filters;
};

function App() {
    return (
        <div className="App">
            <TagFilter tagInfo={tagInfo} onFilterChange={handleFilterChange} />
        </div>
    );
}

const TagFilter = ({ tagInfo, activeFilters, onFilterChange }) => {
  const [selectedKey, setSelectedKey] = useState('');
  const [incIDValue, setIncIDValue] = useState(''); // Moved incID state to TagFilter

  const handleKeyChange = (event) => {
    setSelectedKey(event.target.value);
    if (event.target.value !== 'incID') {
      setIncIDValue('');
    }
  };

  const handleValueChange = (event) => {
    const value = event.target.value;
    const newFilters = { ...activeFilters };
    if (value.length > 0) {
      newFilters[selectedKey] = value;
    } else {
      delete newFilters[selectedKey];
    }
    onFilterChange(newFilters); // Propagate changes to App
  };

  const handleDelete = (keyToDelete) => {
    const newFilters = { ...activeFilters };
    delete newFilters[keyToDelete];
    onFilterChange(newFilters); // Propagate deletion to App
  };

  // Update filters when incID changes
  React.useEffect(() => {
    if (selectedKey === 'incID' && incIDValue) {
      onFilterChange({ ...activeFilters, [selectedKey]: incIDValue });
    }
  }, [incIDValue, selectedKey, onFilterChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Select Tag</InputLabel>
        <Select
          value={selectedKey}
          onChange={handleKeyChange}
          input={<OutlinedInput label="Select Tag" />}
        >
          {tagInfo.allKeys.map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedKey === 'priority' && (
        <FormControl fullWidth>
          <InputLabel>Select Value</InputLabel>
          <Select
            multiple
            value={activeFilters[selectedKey] || []}
            onChange={handleValueChange}
            input={<OutlinedInput label="Select Value" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {tagInfo.valueMap[selectedKey]?.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedKey === 'incID' && (
        <FormControl fullWidth>
          <TextField
            label="Enter Incident ID"
            variant="outlined"
            type="number"
            value={incIDValue}
            onChange={(event) => setIncIDValue(event.target.value)}
          />
        </FormControl>
      )}

      {/* Display active filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(activeFilters).map(([key, values]) =>
          values.map((value) => (
            <Chip
              key={`${key}-${value}`}
              label={`${key}: ${value}`}
              onDelete={() => handleDelete(key)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};


export default App;
