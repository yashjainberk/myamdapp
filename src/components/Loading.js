import React from 'react';
import './Loading.css'; // Assuming you will style it in a separate CSS file

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;
