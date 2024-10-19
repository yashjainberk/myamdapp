import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, CircularProgress, Card, CardContent, Grid, IconButton, Box, CssBaseline, Drawer, Divider, List, ListItem, ListItemText, TextField, Autocomplete, Button,
  CardActionArea
} from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import './App.css';

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
    borderRadius: 12, // Slightly more rounded corners for a modern look
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

  const defaultLayoutPluginInstance = defaultLayoutPlugin(); // PDF viewer plugin

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

  // Flatten folder data into a searchable list
  const getAllFiles = () => {
    if (!data) return [];
    return Object.entries(data.folders).flatMap(([folderName, files]) =>
      files.map((file) => ({
        folderName,
        fileName: file,
      }))
    );
  };

  const fetchFile = (filePath, fileExtension) => {
    setLoadingPdf(true);
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

  const handleSearch = () => {
    const allFiles = getAllFiles();
    const selectedFile = allFiles.find((file) => file.fileName === searchValue);
    if (selectedFile) {
      const { folderName, fileName } = selectedFile;
      setSelectedFolder(data.folders[folderName]); // Set selected folder based on search
      fetchFile(
        `https://amdupsynctest.blob.core.windows.net/subpoenas/${fileName}`,
        fileName.split('.').pop().toLowerCase()
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}

      {/* AppBar with AMD logo */}
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <LogoImage src="https://logos-world.net/wp-content/uploads/2020/03/AMD-Logo.png" alt="AMD Logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Compliance
          </Typography>
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

      {/* Main container for search and folder display */}
      <Box sx={{ padding: theme.spacing(3) }}>
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
        </Box>

        {/* Display Folder Cards */}
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
              {Array.isArray(selectedFolder) && selectedFolder.length > 0 ? (
                selectedFolder.map((item, index) => {
                  const fileExtension = item.split('.').pop().toLowerCase();
                  const filePath = `https://amdupsynctest.blob.core.windows.net/subpoenas/${item}`;

                  // Determine file icon based on extension
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
                            <Typography variant="body2" mt={2}>{item}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <p>No items found in this folder.</p>
              )}
            </Grid>

            {/* File Viewer */}
            <Box mt={5} sx={{ backgroundColor: '#f9f9f9', borderRadius: theme.shape.borderRadius, padding: 2 }}>
              {loadingPdf ? (
                <Typography>Loading file...</Typography>
              ) : fileType === 'pdf' && fileContent ? (
                <Worker>
                  <Viewer fileUrl={fileContent} plugins={[defaultLayoutPluginInstance]} />
                </Worker>
              ) : fileType === 'image' && fileContent ? (
                <img src={fileContent} alt="file content" style={{ maxWidth: '100%', borderRadius: 8 }} />
              ) : fileType === 'txt' && fileContent ? (
                <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px', borderRadius: 8 }}>
                  {fileContent}
                </pre>
              ) : (
                <Typography>Select a file to view.</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
