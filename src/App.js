import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Routes, Route } from 'react-router-dom';
import FolderPage from './components/FolderPage';
import { AppBar, Toolbar, Container, Typography, CircularProgress, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import './App.css';

// Define a custom MUI theme
const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',  // Fallback to white for the Paper component
      default: '#f0f0f0',
    },
    primary: {
      main: '#1976d2',
    },
    text: {
      primary: '#333',
    },
  },
});

// Custom styling for the content container
const DashboardContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

// Custom footer style
const Footer = styled('footer')(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
}));

function App() {
  const [data, setData] = useState(null); // State for fetched data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://amdxupsyncfinal.azurewebsites.net/api/amd_testing?code=IXcwYoF61vgHfRUJn1CqgNEzfEx1srVDIMYo6l28PiW0AzFu5GDwDA%3D%3D', 
          {
            params: {
              containerName: 'folders'
            }
          }
        );
        setData(response.data); // Set fetched data to state
        console.log(response.data.folders); // Log the full response for debugging
      } catch (error) {
        console.error('Error fetching data:', error); // Log errors if any
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData(); // Fetch data on component mount
  }, []);

  // Check if data.folders exists and is an array before rendering
  return (
    <ThemeProvider theme={theme}>
      <div className="Dashboard">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        
        <DashboardContainer maxWidth="md">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress />
            </Box>
          ) : !data ? (
            <Typography variant="body1" align="center" color="error">
              No folders found or data structure is invalid
            </Typography>
          ) : (
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h4" gutterBottom>
                Folders
              </Typography>
              <List>
                {Object.keys(data.folders).map((key, index) => (
                  <ListItem key={index} button component={Link} to={`/folders/${key}`}>
                    <ListItemText primary={key} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </DashboardContainer>

        <Footer>
          <Typography variant="body2" color="textSecondary">
            Powered by React and Azure Functions
          </Typography>
        </Footer>

        <Routes>
          {/* Pass the folder-specific data to the FolderPage component */}
          <Route path="/folders/:folderName" element={<FolderPage folders={data?.folders} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
