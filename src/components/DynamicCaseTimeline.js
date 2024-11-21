import React, {useState, useEffect} from "react"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import axios from 'axios'


export default function DynamicCaseTimeline () {
    /** Store Clicked Cases */
    const [incList, setIncList] = useState([])
    const [cases, setCases] = useState([])
    const [data, setData] = useState(null); // State to store the response data
    const [error, setError] = useState(null); // State to store any errors
    const [loading, setLoading] = useState(false); // State to indicate loading

    /** Get All Inc ID */
    const fetchAllIncIDs = async () => {
        try {
          setLoading(true); // Set loading to true while fetching
          const response = await axios.get(
            "https://dvue-more-fa.dvue-itapps-asev3.appserviceenvironment.net/api/get_all_incid?code=onapPtURF5C773DMxg_n1szRPIalV9YzPs-H1Es081r5AzFuk0QFYg%3D%3D", 
          );
          console.log('asduiaonsdjoands')
          console.log(response)
          setIncList(response.data); // Update state with the response data
        } catch (err) {
          setError(err.message); // Update state with the error message
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };   
    
      useEffect(() => {
        // Example: Fetch data for a specific incident ID when the component mounts
        fetchAllIncIDs()
        // console.log(incList)
      }, []);


    /** Get IncID Data Call */
    const fetchIncidentData = async (incidentID) => {
        try {
          setLoading(true); // Set loading to true while fetching
          const response = await axios.get(
            "https://moredashboardapis.azurewebsites.net/api/get_data_by_incid", // Replace with your Azure Function URL
            {
              params: { incidentID }, // Pass the incidentID as a query parameter
            }
          );
          setData(response.data); // Update state with the response data
        } catch (err) {
          setError(err.message); // Update state with the error message
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };
    
      useEffect(() => {
        // const incidentID = "2023-M000001"; // Replace with your desired incident ID
        // fetchIncidentData(incidentID)
      }, []);


    return (
        <div />
        /** 
            
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

            **/
        
    )
}