import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for Back button functionality
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, CircularProgress, Card, CardContent, Grid, 
  IconButton, Box, CssBaseline, Drawer, Divider, List, ListItem, 
  ListItemText, TextField, Autocomplete, Button, CardActionArea, 
  Slide, Fade, MenuItem, TableContainer, Paper, Table, TableRow, 
  TableHead, TableBody, TableCell
} from '@mui/material';
import { JsonToTable } from "react-json-to-table";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import './App.css';
import FormUpload from './components/FormUpload'; 
import TagFilter from "./components/TagFilter";
import CreateCase from "./components/CreateCase";
import EditCase from "./components/EditCase";
import DynamicCaseTimeline from "./components/DynamicCaseTimeline";
import DateRangeCaseFinder from './components/DateRangeCaseFinder';
import FolderNameManager from './components/FolderNameManager';


// ***** Added imports for PDF Viewer integration *****
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// ******************************************************

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
  const navigate = useNavigate();
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
  const [tagInfo, setTagInfo] = useState({ valueMap: {}, allKeys: [] }); // State for tag value map
  const [filteredFiles, setFilteredFiles] = useState(null); // State for filtered files
  const [incidentMetadata, setIncidentMetadata] = useState(null); // Metadata for selected IncID

  // Instead of using `selectedSubfolder` for the incident, let the user type it in:
  const [incidentIDInput, setIncidentIDInput] = useState('');
 const [folderMetadata, setFolderMetadata] = useState({});
 const [folderBeingEdited, setFolderBeingEdited] = useState(null);
 const [isRenamingFolder, setIsRenamingFolder] = useState(false);
 const [selectedIncidentID, setSelectedIncidentID] = useState(null);

  const tableNames = ["Master", "Entities", "Product Analysis"]; // The three SQL tables
  const [columnsData, setColumnsData] = useState({});
  const [selectedColumns, setSelectedColumns] = useState({
    "Master": [],
    "Entities": [],
    "Product Analysis": [],
  });
  const [tableData, setTableData] = useState({
    "Master": [],
    "Entities": [],
    "Product Analysis": [],
  });

  // PDF viewer plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
          'https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get_blob_data?code=k6NuFOUA40OdJaUrJ2unbII_1sYdA7MZCkNiHMzn9MxeAzFu7bc-8w%3D%3D',
          { params: { containerName: 'my-container' } }
        );

        setData(response.data)
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const columns = {};
        for (const table of tableNames) {
          const response = await axios.get(
            'https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get-columns?code=WgwVqW2Iph7PUE_BFYLV6E_BBUqtKfLVJmVj91As03O8AzFuxji1vA%3D%3D',
            { params: { table } }
          );
          columns[table] = response.data.columns;
        }
        setColumnsData(columns);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    };
    fetchColumns();
  }, []);

  const fetchTableData = async () => {
    try {
      const response = await axios.get(
        'https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get-incident?code=-RE09plkVuSNWm16i5RynbQe1k72N1QK2ldN0bJPDL5xAzFust8mbg%3D%3D',
        {
          incidentID: incidentIDInput,
          tables: selectedColumns,
        }
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleColumnChange = (tableName, columns) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [tableName]: columns,
    }));
  };

  const fetchIncidentMetadata = async (incidentID) => {
    try {
      const response = await axios.get(
        'https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get-metadata?code=6pQwfRJTZMJnlUIVNth_djfjFNfD0D7gvOwn1AJSWqX8AzFuQag61g%3D%3D',
        {
          params: { incidentID: incidentID }
        }
      );
      setIncidentMetadata(response.data); // Set metadata to state
    } catch (error) {
      console.error('Error fetching incident metadata:', error);
      setIncidentMetadata(null); // Clear metadata if there's an error
    }
  };

  const handleSubfolderClick = (subfolderName) => {
    setSelectedSubfolder(subfolderName);
    // If you still want to auto-fetch metadata when a subfolder is clicked:
    // fetchIncidentMetadata(subfolderName);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
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
    if (!data || !data.folders) return [];
    return Object.entries(data.folders).flatMap(([folderName, subfolderDetails]) => {
      return Object.entries(subfolderDetails).flatMap(([subfolderName, filesInfo]) => {
        if (!filesInfo.files) return [];
        if (!filesInfo || !Array.isArray(filesInfo.files)) {
          return [];
        }
        return filesInfo.files.map((file) => ({
          folderName,
          subfolderName,
          fileName: file.file_name,
          createdOn: file.created_on,
          tags: file.tags || {},
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
      setSelectedFolder(selectedFile.folderName);
      fetchFile(
        `https://dvuemoresa.blob.core.windows.net/my-container/${fileName}`,
        fileName.split('.').pop().toLowerCase()
      );
    }
  };

  const handleRenameClick = (e, folderName) => {
    e.stopPropagation(); 
    setFolderBeingEdited(folderName);
    setIsRenamingFolder(true);
  };
const fetchFolderName = async (folderPath) => {
    try {
      const metadataPath = `https://dvuemoresa.blob.core.windows.net/my-container/${folderPath}/.metadata.json`;
      const response = await fetch(metadataPath);
      if (response.ok) {
        const metadata = await response.json();
        return metadata.displayName;
      }
      return null;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedFolder && data?.folders[selectedFolder]) {
      Object.keys(data.folders[selectedFolder]).forEach(async (subfolderName) => {
        const displayName = await fetchFolderName(`${selectedFolder}/${subfolderName}`);
        if (displayName) {
          setFolderMetadata(prev => ({
            ...prev,
            [subfolderName]: displayName
          }));
        }
      });
    }
  }, [selectedFolder, data, folderBeingEdited]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Button onClick={() => navigate('/')}>
            <LogoImage 
              src="https://logos-world.net/wp-content/uploads/2020/03/AMD-Logo.png" 
              alt="AMD Logo" 
            />
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Compliance
          </Typography>

          {/* Button to Access Timeline */}
          <Button color="inherit" component={Link} to="/timeline">
            Timeline
          </Button>
          {/* Button to Access Date-Range */}
          <Button color="inherit" component={Link} to="/date-range">
            Date-Range
          </Button>
          {/* Button to Create new Case*/}
          <Button color="inherit" component={Link} to="/create-case">
            Create Case
          </Button>
          {/* Create a button to edit the case */}
          <Button color="inherit" component={Link} to="/edit-case">
            Edit Case
          </Button>
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
          <IconButton 
            onClick={() => setOpen(false)} 
            sx={{ color: theme.palette.common.white }}
          >
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
                </Box>

              

                {/* --------------------------------------------- */}
                {/* ALWAYS SHOW: INCIDENT ID + TABLE SELECTION   */}
                {/* --------------------------------------------- */}
                <Box sx={{ padding: 2, mb: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    Dashboard
                  </Typography>

                  {/* Textbox for manually typing in the incident ID */}
                  <Box sx={{ marginBottom: 2 }}>
                    <TextField
                      label="Enter Incident ID"
                      value={incidentIDInput}
                      onChange={(e) => setIncidentIDInput(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Box>

                  <Grid container spacing={3}>
                    {tableNames.map((tableName) => (
                      <Grid item xs={12} sm={6} md={4} key={tableName}>
                        <Box sx={{ maxWidth: "95%", margin: "0 auto" }}>
                          <Typography variant="h6" align="center">
                            {tableName}
                          </Typography>
                          {/* Dropdown for column selection */}
                          <TextField
                            select
                            label={`Select Columns for ${tableName}`}
                            value={selectedColumns[tableName] || []}
                            onChange={(e) => handleColumnChange(tableName, e.target.value)}
                            SelectProps={{
                              multiple: true,
                            }}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                          >
                            {(columnsData[tableName] || []).map((column) => (
                              <MenuItem key={column} value={column}>
                                {column}
                              </MenuItem>
                            ))}
                          </TextField>

                          {/* Table for displaying data */}
                          <TableContainer
                            component={Paper}
                            sx={{ marginTop: 1, maxHeight: "500px", overflowY: "auto" }}
                          >
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow>
                                  {selectedColumns[tableName]?.map((column) => (
                                    <TableCell key={column}>{column}</TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedColumns[tableName]?.length > 0 &&
                                  // Pick one column to measure the row length
                                  tableData[selectedColumns[tableName][0]]?.map(
                                    (_, rowIndex) => (
                                      <TableRow key={rowIndex}>
                                        {selectedColumns[tableName]?.map((column) => (
                                          <TableCell key={column}>
                                            {tableData[column]?.[rowIndex] || "-"}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    )
                                  )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ marginTop: 2, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchTableData}
                      disabled={
                        !Object.values(selectedColumns).some((cols) => cols.length > 0)
                      }
                    >
                      Fetch Data
                    </Button>
                  </Box>
                </Box>
                {/* --------------------------------------------- */}
                {/* END: INCIDENT ID + TABLE SELECTION           */}
                {/* --------------------------------------------- */}
 
                {/* Display Folder Contents */}
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={3}>
                    {data && 
                      Object.keys(data.folders).map((folderName, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <FolderCard onClick={() => setSelectedFolder(folderName)}>
                            <CardActionArea>
                              <CardContent>
                                <Typography variant="h6">{folderName}</Typography>
                                <Typography variant="body2">
                                  Click to view folder contents
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </FolderCard>
                        </Grid>
                      ))
                    }
                  </Grid>
                )}
  
               {/* Render Subfolders */}
               {selectedFolder && data.folders[selectedFolder] && (
                 <Box mt={5}>
                   <Typography variant="h5">Subfolders</Typography>
                   <Grid container spacing={3}>
                     {Object.entries(data.folders[selectedFolder])
                     .filter(([subfolderName, filesInfo]) => {
                      // Remove subfolders and folder_creation_time
                        console.log(folderMetadata[subfolderName])
                        const { subfolders, folder_creation_time, ...rest } = filesInfo;
                        return Object.keys(rest).length > 0;
                     })
                     .map(([subfolderName, filesInfo]) => (
                       <Grid item xs={12} sm={6} md={4} key={subfolderName}>
                         {/* Click to set the selected subfolder */}
                         <FolderCard onClick={() => handleSubfolderClick(subfolderName)}>
                           <CardActionArea>
                             <CardContent>
                               <Typography variant="h6">{folderMetadata[subfolderName] ||  subfolderName}</Typography>
                               <Typography variant="body2">Click to view files</Typography>
                               <Button  
                                  onClick={(e) => handleRenameClick(e, `${selectedFolder}/${subfolderName}`)}
                                  variant="contained"
                                  size="small"
                                  sx={{ mt: 1 }}
                                >
                                  Rename Case
                                </Button>
                                {isRenamingFolder && folderBeingEdited == `${selectedFolder}/${subfolderName}` && (
                                  <FolderNameManager 
                                    folderPath={`${selectedFolder}/${subfolderName}`}
                                    onClose={() => {
                                      setIsRenamingFolder(false)
                                      setFolderBeingEdited(null)
                                    }}
                                  />
                                )}
                             </CardContent>
                           </CardActionArea>
                         </FolderCard>
                       </Grid>
                     ))}
                   </Grid>

                    {/* Display Metadata for Selected IncID (only if desired) */}
                    {incidentMetadata && (
                      <div>
                        <h3>Incident Metadata</h3>
                        <div className="App"> 
                          <JsonToTable json={incidentMetadata} />
                        </div>
                      </div>
                    )}

                    {/* Render Files in Selected Subfolder */}
                    {selectedSubfolder && data.folders[selectedFolder][selectedSubfolder] && (
                      <Box mt={5}>
                        <Typography variant="h5">
                          Files in {selectedSubfolder}
                        </Typography>
                        <Grid container spacing={3}>
                          {data.folders[selectedFolder][selectedSubfolder].files.map((file, index) => {
                            const fileExtension = file.file_name.split('.').pop().toLowerCase();
                            const filePath = `https://dvuemoresa.blob.core.windows.net/my-container/${file.file_name}`;

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
                                      <Typography variant="body2" mt={2}>
                                        {file.file_name}
                                      </Typography>
                                      <Typography variant="caption">
                                        Created: {formatDate(file.created_on)}
                                      </Typography>
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
                <Box 
                  mt={5} 
                  sx={{ 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: theme.shape.borderRadius, 
                    padding: 2 
                  }}
                >
                  {loadingPdf ? (
                    <Typography>Loading file...</Typography>
                  ) : fileType === 'pdf' && fileContent ? (
                    <div 
                      style={{ 
                        height: '100vh', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                      }}
                    >
                      <div 
                        style={{ 
                          width: '75%', 
                          height: '90vh', 
                          border: '1px solid #ccc' 
                        }}
                      >
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                          <Viewer
                            fileUrl={fileContent}
                            plugins={[defaultLayoutPluginInstance]}
                          />
                        </Worker>
               
                      </div>
                    </div>
                  ) : fileType === 'docx' && fileContent ? (
                    <div 
                      style={{ 
                        height: '100vh', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                      }}
                    >
                      <div 
                        style={{ 
                          width: '75%', 
                          height: '90vh', 
                          border: '1px solid #ccc' 
                        }}
                      >
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                          <Viewer
                            fileUrl={fileContent}
                            plugins={[defaultLayoutPluginInstance]}
                          />
                        </Worker>
                      </div>
                    </div>
                  ) : fileType === 'image' && fileContent ? (
                    <img 
                      src={fileContent} 
                      alt="file content" 
                      style={{ maxWidth: '100%', borderRadius: 8 }} 
                    />
                  ) : fileType === 'txt' && fileContent ? (
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                      {fileContent}
                    </pre>
                  ) : (
                    <Typography>Select a file to view.</Typography>
                  )}
                </Box>
              </>
            }
          />

          {/* Routes */}
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/create-case" element={<CreateCase />} />
          <Route path="/edit-case" element={<EditCase />} />
          <Route path="/timeline" element={<DynamicCaseTimeline />} />
          <Route path="/date-range" element={<DateRangeCaseFinder />} />
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
