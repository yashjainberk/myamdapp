import React, { useState } from 'react';
import axios from 'axios';

const FolderNameManager = ({folderPath, onClose}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!displayName.trim()) {
            setMessage('Please enter a display name');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://dvue-morepython-fa.dvue-itapps-asev3.appserviceenvironment.net/api/manage_folder_display_name?code=q1j4oE1JPsjfQUwO9xnVReExPQq8PZZjxDM4eUJGfrZ2AzFuqK0Wug%3D%3D',
                {
                    folderName: folderPath,
                    displayName: displayName
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage(response.data.message || 'Display name updated successfully');
            setTimeout(() => {
                setIsOpen(false);
                setMessage('');
                setDisplayName('');
                onClose();
            }, 2000);
        } catch (error) {
            setMessage(
                error.response?.data?.error || 
                error.message || 
                'An error occurred while updating the display name'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="folder-manager">
            <div className="popup-overlay">
                <div className="popup-content">
                    <h2>Manage Folder Display Name</h2>
                    <p className="current-path">Folder: {folderPath}</p>
                    <input
                        type="text"
                        placeholder="Enter new display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={isLoading}
                    />
                    {message && (
                        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}
                    <div className="button-group">
                        <button 
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={isLoading ? 'loading' : ''}
                        >
                            {isLoading ? 'Updating...' : 'Submit'}
                        </button>
                        <button 
                            onClick={() => 
                            {
                                onClose();
                                setIsOpen(false);
                            }}
                            disabled={isLoading}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FolderNameManager;
