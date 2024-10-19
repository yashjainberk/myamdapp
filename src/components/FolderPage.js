import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core'; // Core viewer
import '@react-pdf-viewer/core/lib/styles/index.css'; // Core viewer styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Layout styles

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import PDF.js library directly from pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'; // Import worker entry

function FolderPage({ folders }) {
  // Get folderName from URL params
  const { folderName } = useParams();

  // Use the folderName to access the specific folder data from the passed folders prop
  const folderData = folders ? folders[folderName] : null;

  // Initialize the default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Update the hardcoded PDF link to a CORS-compatible PDF
  const hardcodedPdfLink = 'https://amdupsynctest.blob.core.windows.net/subpoenas/Note Oct 14, 2024 (5).pdf';

  // State to hold the Blob URL of the PDF
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    // Set the workerSrc for pdfjs using the imported pdfjsWorker
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    // Fetch the PDF file and create a Blob URL
    fetch(hardcodedPdfLink)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      })
      .catch((error) => {
        console.error('Error fetching PDF:', error);
      });
  }, [hardcodedPdfLink]);

  return (
    <div className="FolderPage">
      <header>
        <h1>{folderName} Page</h1>
      </header>
      <main>
        {folderData ? (
          <div>
            <p>
              You are viewing the <strong>{folderName}</strong> folder.
            </p>
            <h2>Folder Contents:</h2>
            <ul>
              {folderData.items ? (
                folderData.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <p>No items found in this folder.</p>
              )}
            </ul>
            {/* Render the hardcoded PDF viewer */}
            <div style={{ height: '750px', border: '1px solid #ddd' }}>
              <Worker>
                {pdfBlobUrl ? (
                  <Viewer
                    fileUrl={pdfBlobUrl}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                ) : (
                  <p>Loading PDF...</p>
                )}
              </Worker>
            </div>
          </div>
        ) : (
          <p>No data found for this folder.</p>
        )}
      </main>
      <footer>
        <p>
          Go back to <a href="/">Dashboard</a>
        </p>
      </footer>
    </div>
  );
}

export default FolderPage;
