import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for Back button functionality
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, CircularProgress, Card, CardContent, Grid, IconButton, Box, CssBaseline, Drawer, Divider, List, ListItem, ListItemText, TextField, Autocomplete, Button,
  CardActionArea, Slide, Fade
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
  const [fileContent, setFileContent] = useState(null); // Store file content
  const [fileType, setFileType] = useState(null); // Store the type of file
  const [loadingPdf, setLoadingPdf] = useState(false); // Loading state for PDFs
  const [searchValue, setSearchValue] = useState(''); // State for search value
  const [inputValue, setInputValue] = useState(''); // State for search input
  const [activeFilters, setActiveFilters] = useState({}); // State for filter
  const [tagInfo, setTagInfo] = useState({ valueMap: {}, allKeys: [] }); // State for tag value map
  const [filteredFiles, setFilteredFiles] = useState(null); // State for filtered files

  // Enhanced function to create tag value map and list of all keys
  const createTagInfo = (data) => {
    const valueMap = {};
    const allKeys = new Set();

    Object.values(data.folders).forEach(folder => {
      folder.files.forEach(file => {
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
    if (!data) return [];
    return Object.entries(data.folders).flatMap(([folderName, folderDetails]) =>
      folderDetails.files.map((file) => ({
        folderName,
        fileName: file.file_name,
        createdOn: file.created_on,
        tags: file.tags || {},
      }))
    );
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
    setActiveFilters(newFilters);
    applyFiltersAndSearch(newFilters, searchValue);
  };

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
    applyFiltersAndSearch(activeFilters, newValue);
  };

  const applyFiltersAndSearch = (filters, search) => {
    let result = getAllFiles();

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter(file =>
          Object.entries(filters).every(([key, values]) =>
              values.includes(file.tags[key])
          )
      );
    }

    // Apply search
    if (search) {
      result = result.filter(file =>
          file.fileName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFiles(result);
  };

  const handleSearch = () => {
    const allFiles = getAllFiles();
    const selectedFile = allFiles.find((file) => file.fileName === searchValue);
    if (selectedFile) {
      const { folderName, fileName } = selectedFile;
      setSelectedFolder(data.folders[folderName]); // Set selected folder based on search
      fetchFile(
        `https://amdupsynctest.blob.core.windows.net/folders/${fileName}`,
        fileName.split('.').pop().toLowerCase()
      );
    }
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
                    options={getAllFiles().map((file) => file.fileName)}
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
                <TagFilter tagInfo={tagInfo} onFilterChange={handleFilterChange} /> 
                </Box>
                {/* Display Folder Contents */}
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={3}>
                    {data && Object.keys(data.folders).map((key, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <FolderCard onClick={() => setSelectedFolder(data.folders[key])}>
                          <CardActionArea>
                            <CardContent>
                              <Typography variant="h6">{key}</Typography>
                              <Typography variant="body2">Click to view folder contents</Typography>
                            </CardContent>
                          </CardActionArea>
                        </FolderCard>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Render Folder Contents */}
                {selectedFolder && (
                  <Box mt={5}>
                    <Typography variant="h5">Folder Contents</Typography>
                    <Grid container spacing={3}>
                      {selectedFolder.files.map((file, index) => {
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
                  </Box>
                )}

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