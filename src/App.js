import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for Back button functionality
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, CircularProgress, Card, CardContent, Grid, IconButton, Box, CssBaseline, Drawer, Divider, List, ListItem, ListItemText, TextField, Autocomplete, Button,
  CardActionArea, Slide, Fade, Chip,
  inputAdornmentClasses
} from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import './App.css';
import FormUpload from './components/FormUpload'; // Import FormUpload component
import TagFilter from "./components/TagFilter";
// import getfilters from "./components/TagFilter";
import { Tag } from '@mui/icons-material';
import {

  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

// Create a custom theme with AMD color scheme
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      paper: '#ffffff',
      default: '#f4f4f4',
    },
    primary: {
      main: '#ED1C24',
    },
    secondary: {
      main: '#282828',
    },
    text: {
      primary: '#282828',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1.05rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Custom styles for UI elements
const DrawerStyled = styled(Drawer)(({ theme }) => ({
  '.MuiDrawer-paper': {
    width: 240,
    background: theme.palette.secondary.main,
    color: theme.palette.common.white,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  },
}));

const FolderCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.2)',
  },
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: 40,
  marginRight: theme.spacing(2),
}));

function App() {
  const [data, setData] = useState(null); // State for fetched data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [open, setOpen] = useState(false); // Sidebar state
  const [selectedFolder, setSelectedFolder] = useState(null); // Store selected folder data
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [fileContent, setFileContent] = useState(null); // Store file content
  const [fileType, setFileType] = useState(null); // Store the type of file
  const [loadingPdf, setLoadingPdf] = useState(false); // Loading state for PDFs
  const [searchValue, setSearchValue] = useState(''); // State for search value
  const [inputValue, setInputValue] = useState(''); // State for search input
  const [activeFilters, setActiveFilters] = useState({}); // State for filter
  //const [tagInfo, setTagInfo] = useState({ valueMap: {}, allKeys: [] }); // State for tag value map
  const [filteredFiles, setFilteredFiles] = useState(null); // State for filtered files
  const [filteredOptions, setFilteredOptions] = useState([]);
  


const tagInfo = {
    allKeys: ['priority', 'incidentId'], // Add your tags here
    valueMap: {
        priority: ['High', 'Medium', 'Low'],
        incidentID: ['1234', '5678', '91011'], // Sample values for each tag
    },
};




  // Enhanced function to create tag value map and list of all keys
  const createTagInfo = (data) => {
    const valueMap = {};
    const allKeys = new Set();

    // Iterate over each folder
    Object.values(data.folders).forEach(folder => {
        // Iterate over each subfolder
        Object.values(folder).forEach(subfolder => {
            // Iterate over each file in the subfolder
            subfolder.files.forEach(file => {
                if (file.tags) {
                    Object.entries(file.tags).forEach(([key, value]) => {
                        if (!valueMap[key]) {
                            valueMap[key] = new Set();
                        }
                        valueMap[key].add(value);
                        allKeys.add(key);
                    });
                }
            });
        });
    });

    // Convert Sets to Arrays
    Object.keys(valueMap).forEach(key => {
        valueMap[key] = Array.from(valueMap[key]);
    });

    return {
        valueMap,
        allKeys: Array.from(allKeys)
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://amdxupsyncfinal.azurewebsites.net/api/amd_testing?code=IXcwYoF61vgHfRUJn1CqgNEzfEx1srVDIMYo6l28PiW0AzFu5GDwDA%3D%3D',
          { params: { containerName: 'folders' } }
        );
        setData(response.data); // Set fetched data to state
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const allFiles = getAllFiles();
      setFilteredFiles(allFiles);
      setFilteredOptions(allFiles);
      console.log('options', filteredOptions) 
    }
  }, [data]);

  

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Sort folders by creation date for the timeline
  const getSortedFolders = () => {
    if (!data) return [];
    return Object.entries(data.folders)
      .map(([folderName, folderDetails]) => ({
        folderName,
        creationTime: folderDetails.folder_creation_time,
      }))
      .sort((a, b) => new Date(a.creationTime) - new Date(b.creationTime));
  };

 
  const getAllFiles = () => {
    if (!data || !data.folders) {
      console.log("No data or folders found");
      return [];
    }

    return Object.entries(data.folders).flatMap(([folderName, subfolderDetails]) => {
      return Object.entries(subfolderDetails).flatMap(([subfolderName, filesInfo]) => {
        if (!filesInfo.files) return []; // Check if files exist
        if (!filesInfo || !Array.isArray(filesInfo.files)) {
          console.log(`No files found in subfolder: ${subfolderName}`);
          return []; // Return empty if no files exist
        }

        return filesInfo.files.map((file) => ({
          folderName,
          subfolderName, // Add the subfolder name
          fileName: file.file_name, // Extract file name
          createdOn: file.created_on,
          tags: file.tags, // Ensure tags are provided
        }));
        
      });
    });
  };


  const fetchFile = (filePath, fileExtension) => {
    setLoadingPdf(true);
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        if (fileExtension === 'pdf') {
          const url = URL.createObjectURL(blob);
          setFileContent(url);
          setFileType('pdf');
        } else if (fileExtension.match(/(png|jpg|jpeg)/)) {
          const imageUrl = URL.createObjectURL(blob);
          setFileContent(imageUrl);
          setFileType('image');
        } else if (fileExtension === 'txt') {
          blob.text().then((text) => {
            setFileContent(text);
            setFileType('txt');
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching file:', error);
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };


  const handleFilterChange = (newFilters) => {
    console.log("handlefitlercjhang");
    
    setActiveFilters(newFilters);
    console.log("activfil", activeFilters, "newfi", newFilters);
    
    // console.log('active over here', newFilters)
    //console.log(TagFilter)
    
  };

  

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
    applyFiltersAndSearch(activeFilters);
  };

  const applyFiltersAndSearch = () => {
    console.log("we here")
    let result = getAllFiles();
    console.log('result initial', result)
    //console.log('YOO0', getfi)
    console.log('this', activeFilters)
    console.log('next', Object.keys(activeFilters).length )
    
    if (Object.keys(activeFilters).length > 0) {
      result = result.filter((file) => {
        const fileTags = file.tags || {}; // Ensure tags are defined
        
        // Check each filter condition
        return Object.entries(activeFilters).every(([key, filterValue]) => {
            const tagValue = fileTags[key];
            console.log("fitler value", filterValue[0].toLowerCase());
            console.log('key', key, 'filetags', fileTags, 'file', file)
            console.log('tag val', tagValue)
            
            if (Array.isArray(filterValue)) {
                console.log(filterValue[0].toLowerCase()===tagValue);
                // If the filter value is an array, check if the tag value is included in it
                return filterValue[0].toLowerCase()===tagValue;
            } else {
                // If the filter value is a string (like incID), check for direct equality
                return tagValue === filterValue;
            }
        });
    });
    setFilteredOptions(result); // Show filtered files in Autocomplete
    console.log('handle filtered files', filteredFiles)
    console.log('hadnle filitred options', filteredOptions)
  }
  else {
    setFilteredOptions(getAllFiles()); // Show all files in Autocomplete if no filters
  }
  console.log('first round filter', result);
    // Apply search
    
    if (inputValue) {
      console.log('search', inputValue)
      result = result.filter(file =>{
        const fileName = file.file_name || '';
        file.fileName.toLowerCase().includes(inputValue.toLowerCase())
    });
    }

    setFilteredFiles(result);
    console.log('filteredfiles in here', filteredFiles);
  };

  const handleSearch = () => {
    const allFiles = getAllFiles();
    console.log("datahere", data)
    console.log('activfil', activeFilters)
    applyFiltersAndSearch();
    console.log("searchval", searchValue);
    const selectedFile = allFiles.find((file) => file.fileName === searchValue);
    if (selectedFile) {
      const { folderName, fileName } = selectedFile;
      setSelectedFolder(selectedFile.folderName); // Set selected folder based on search
      fetchFile(
        `https://amdupsynctest.blob.core.windows.net/folders/${fileName}`,
        fileName.split('.').pop().toLowerCase()
      );
    }
  };

  const TagFilter = ({ tagInfo, activeFilters, onFilterChange }) => {
    const [selectedKey, setSelectedKey] = useState('');
    const [incIDValue, setIncIDValue] = useState(''); // Input state for incID
  
    const handleKeyChange = (event) => {
      setSelectedKey(event.target.value);
      if (event.target.value !== 'incID') {
        setIncIDValue(''); // Reset incID if another tag is selected
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
      console.log(selectedKey, newFilters, value )
      setActiveFilters(newFilters);
      console.log("active now",activeFilters);
      onFilterChange(newFilters);
      console.log("after")
      //onFilterChange(newFilters); // Propagate changes to App immediately
    };
  
    const handleIncIDChange = (event) => {
      setIncIDValue(event.target.value); // Only update local state
    };
  
    const handleDelete = (keyToDelete) => {
      const newFilters = { ...activeFilters };
      delete newFilters[keyToDelete];
      setActiveFilters(newFilters);
      console.log('handledle', activeFilters, newFilters)
      onFilterChange(newFilters); // Propagate deletion to App
    };
  
    // Debounce effect for updating activeFilters in the parent component
    // useEffect(() => {
    //   const debounceTimer = setTimeout(() => {
    //     if (selectedKey === 'incidentId' && incIDValue) {
    //       const newFilters = { ...activeFilters, [selectedKey]: incIDValue };
    //       setActiveFilters(newFilters);
    //       handleFilterChange();
    //     }
    //   }, 900); // Adjust debounce delay as needed
    //   console.log('made it')
    //   if(Object.keys(activeFilters).length > 0){
    //   handleFilterChange()}
    //   // Clear timeout if incIDValue changes before 300ms
    //   return () => clearTimeout(debounceTimer);
    // }, [incIDValue, selectedKey, activeFilters, onFilterChange]);
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Select Tag</InputLabel>
          <Select
            sx={{ width: theme.spacing(17) }}
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
  
        {selectedKey === 'incidentId' && (
          <FormControl fullWidth>
            <TextField
              label="Enter Incident ID"
              variant="outlined"
              type="text" // Allow continuous text entry
              value={incIDValue}
              onChange={handleIncIDChange} // Directly update as user types
            />
          </FormControl>
        )}
  
        {/* Display active filters as chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(activeFilters).map(([key, values]) => (
            <Chip
              key={`${key}-${values}`}
              label={`${key}: ${values}`}
              onDelete={() => handleDelete(key)}
            />
          ))}
        </Box>
      </Box>
    );
  };
  


  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <LogoImage src="https://logos-world.net/wp-content/uploads/2020/03/AMD-Logo.png" alt="AMD Logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Compliance
          </Typography>
          {/* Add a button to navigate to the file upload page */}
          <Button color="inherit" component={Link} to="/upload">
            Upload File
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <DrawerStyled anchor="left" open={open} onClose={() => setOpen(false)}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit">
            Folders
          </Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: theme.palette.common.white }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <Box sx={{ padding: 2, color: theme.palette.common.white }}>
          {data && (
            <List>
              {Object.keys(data.folders).map((key, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    setSelectedFolder(data.folders[key]); // Update selected folder on click
                    setOpen(false); // Close the sidebar on navigation
                  }}
                  sx={{ color: theme.palette.common.white }}
                >
                  <FolderIcon sx={{ marginRight: 1 }} />
                  <ListItemText primary={key} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DrawerStyled>

      <Box sx={{ padding: theme.spacing(3) }}>
        <Routes>
          {/* Main Dashboard Route */}
          <Route
            path="/"
            element={
              <>
                {/* Search Bar with Autocomplete */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Autocomplete
                    freeSolo
                    options={filteredOptions.map((file) => file.fileName)}
                    value={searchValue}
                    onChange={(event, newValue) => {
                      setSearchValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Files"
                        variant="outlined"
                        sx={{ width: 300, marginRight: 2 }}
                        onClick={handleSearch}
                      />
                    )}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  
                  <Box sx={{ padding: theme.spacing(1) }}>
                  </Box>

                  
                  
                </Box>
                <Box  sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <TagFilter 
                  tagInfo={tagInfo}
                    activeFilters={activeFilters} // Pass activeFilters as prop
                    onFilterChange={handleFilterChange} /> 
                </Box>
                {/* Display Folder Contents */}
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={3}>
                    {data && Object.keys(data.folders).map((folderName, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <FolderCard onClick={() => setSelectedFolder(folderName)}>
                          <CardActionArea>
                            <CardContent>
                              <Typography variant="h6">{folderName}</Typography>
                              <Typography variant="body2">Click to view folder contents</Typography>
                            </CardContent>
                          </CardActionArea>
                        </FolderCard>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Render Subfolders */}
                {selectedFolder && data.folders[selectedFolder] && (
                  <Box mt={5}>
                    <Typography variant="h5">Subfolders</Typography>
                    <Grid container spacing={3}>
                      {Object.entries(data.folders[selectedFolder]).map(([subfolderName, filesInfo]) => (
                        <Grid item xs={12} sm={6} md={4} key={subfolderName}>
                          {/* Click to set the selected subfolder */}
                          <FolderCard onClick={() => setSelectedSubfolder(subfolderName)}>
                            <CardActionArea>
                              <CardContent>
                                <Typography variant="h6">{subfolderName}</Typography>
                                <Typography variant="body2">Click to view files</Typography>
                              </CardContent>
                            </CardActionArea>
                          </FolderCard>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Render Files in Selected Subfolder */}
                    {selectedSubfolder && data.folders[selectedFolder][selectedSubfolder] && (
                      <Box mt={5}>
                        <Typography variant="h5">Files in {selectedSubfolder}</Typography>
                        <Grid container spacing={3}>
                          {data.folders[selectedFolder][selectedSubfolder].files.map((file, index) => {
                            const fileExtension = file.file_name.split('.').pop().toLowerCase();
                            const filePath = `https://amdupsynctest.blob.core.windows.net/folders/${file.file_name}`;
                            
                            let FileIcon;
                            if (fileExtension === 'pdf') {
                              FileIcon = <PictureAsPdfIcon />;
                            } else if (fileExtension.match(/(png|jpg|jpeg)/)) {
                              FileIcon = <ImageIcon />;
                            } else {
                              FileIcon = <TextSnippetIcon />;
                            }
                            
                            return (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                  sx={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: theme.shape.borderRadius,
                                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
                                  }}
                                >
                                  <CardActionArea onClick={() => fetchFile(filePath, fileExtension)}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                      {FileIcon}
                                      <Typography variant="body2" mt={2}>{file.file_name}</Typography>
                                      <Typography variant="caption">Created: {formatDate(file.created_on)}</Typography>
                                    </CardContent>
                                  </CardActionArea>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )}
                  

                  </Box>
                )}

                {/* File Viewer */}
                <Box mt={5} sx={{ backgroundColor: '#f9f9f9', borderRadius: theme.shape.borderRadius, padding: 2 }}>
                  {loadingPdf ? (
                    <Typography>Loading file...</Typography>
                  ) : fileType === 'pdf' && fileContent ? (
                    <embed src={fileContent} type="application/pdf" width="100%" height="600px" />
                  ) : fileType === 'image' && fileContent ? (
                    <img src={fileContent} alt="file content" style={{ maxWidth: '100%', borderRadius: 8 }} />
                  ) : fileType === 'txt' && fileContent ? (
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{fileContent}</pre>
                  ) : (
                    <Typography>Select a file to view.</Typography>
                  )}
                </Box>
                  
                {/* Timeline Component */}
                {data && (
                  <Box mt={5}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                      Case Creation Timeline
                    </Typography>
                    <Timeline position="alternate">
                      {getSortedFolders().map((folder, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent color="text.secondary">
                            {formatDate(folder.creationTime)}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <Slide in direction="up" timeout={1000}>
                              <TimelineDot
                                sx={{
                                  background: 'linear-gradient(135deg, #FF416C, #FF4B2B)',
                                  boxShadow: '0 0 10px rgba(255, 65, 108, 0.7)',
                                }}
                              >
                                <FolderOpenIcon sx={{ color: '#fff' }} />
                              </TimelineDot>
                            </Slide>
                            {index !== getSortedFolders().length - 1 && (
                              <TimelineConnector
                                sx={{
                                  backgroundColor: 'rgba(255, 65, 108, 0.8)',
                                  width: '4px',
                                  boxShadow: '0 0 12px rgba(255, 65, 108, 0.5)',
                                  borderRadius: '4px', // Curve the connector
                                }}
                              />
                            )}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Fade in timeout={1000}>
                              <Card
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                  backdropFilter: 'blur(10px)', // Glassmorphism effect
                                  borderRadius: 2,
                                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)',
                                  },
                                }}
                              >
                                <CardContent>
                                  <Typography variant="h6">{folder.folderName}</Typography>
                                  <Typography variant="body2">Folder Created: {formatDate(folder.creationTime)}</Typography>
                                </CardContent>
                              </Card>
                            </Fade>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </Box>
                )}
              </>
            }
          />

          {/* File Upload Route */}
          <Route
            path="/upload"
            element={<FileUpload />}
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

// FileUpload Component
function FileUpload() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mb: 5 }}>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Upload a File
      </Typography>

      <FormUpload onUploadSuccess={() => console.log('Upload successful')} />

      {/* Back Button */}
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => navigate('/')} // Navigate back to the dashboard
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}

export default App;