import React, { useState } from 'react';
import ImageGallery from './components/ImageGallery';
import './App.css';

function App() {
  const [connectionString, setConnectionString] = useState('');
  const [containerName, setContainerName] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigure = (e) => {
    e.preventDefault();
    if (connectionString && containerName) {
      setIsConfigured(true);
    }
  };

  return (
    <div className="App">
      <header className="AppHeader">
        <h1>Azure Storage Image Gallery</h1>
        {!isConfigured ? (
          <div className="configForm">
            <h2>Configure Azure Storage Connection</h2>
            <form onSubmit={handleConfigure}>
              <div className="formGroup">
                <label>Storage Account Connection String:</label>
                <input
                  type="text"
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  placeholder="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
                  required
                  className="configInput"
                />
              </div>
              <div className="formGroup">
                <label>Container Name:</label>
                <input
                  type="text"
                  value={containerName}
                  onChange={(e) => setContainerName(e.target.value)}
                  placeholder="images"
                  required
                  className="configInput"
                />
              </div>
              <button type="submit" className="configButton">
                Load Images
              </button>
            </form>
          </div>
        ) : (
          <ImageGallery 
            connectionString={connectionString} 
            containerName={containerName}
          />
        )}
      </header>
    </div>
  );
}

export default App;