import React, { useState } from 'react';
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select
} from '@mui/material';

const TagFilter = ({ tagInfo, onFilterChange }) => {
    const [selectedKey, setSelectedKey] = useState('');
    const [activeFilters, setActiveFilters] = useState({});

    const handleKeyChange = (event) => {
        setSelectedKey(event.target.value);
    };

    const handleValueChange = (event) => {
        const value = event.target.value;
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (value.length > 0) {
                newFilters[selectedKey] = value;
            } else {
                delete newFilters[selectedKey];
            }
            return newFilters;
        });
    };

    const handleDelete = (keyToDelete) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[keyToDelete];
            return newFilters;
        });
    };

    // Effect to propagate filter changes to parent component
    React.useEffect(() => {
        onFilterChange(activeFilters);
    }, [activeFilters, onFilterChange]);

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

            {selectedKey && (
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
                        {tagInfo.valueMap[selectedKey].map((value) => (
                            <MenuItem key={value} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(activeFilters).map(([key, values]) => (
                    values.map((value) => (
                        <Chip
                            key={`${key}-${value}`}
                            label={`${key}: ${value}`}
                            onDelete={() => handleDelete(key)}
                        />
                    ))
                ))}
            </Box>
        </Box>
    );
};

export default TagFilter;