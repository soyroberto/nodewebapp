import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

const ImageGallery = ({ connectionString, containerName }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadImages();
  }, [connectionString, containerName]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      const imageList = [];
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const blobClient = containerClient.getBlobClient(blob.name);
          const url = blobClient.url;
          imageList.push({
            name: blob.name,
            url: url,
            lastModified: blob.properties.lastModified,
            size: blob.properties.contentLength
          });
        }
      }
      
      setImages(imageList);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images. Please check your connection string and container name.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
        <p>Loading images from Azure Storage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errorContainer">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retryButton">
          Retry Configuration
        </button>
      </div>
    );
  }

  return (
    <div className="imageGalleryContainer">
      <h2>Image Gallery</h2>
      <p className="imageCount">Found {images.length} image(s) in container "{containerName}"</p>
      
      {images.length === 0 ? (
        <div className="noImages">
          <p>No images found in this container.</p>
          <p>Upload some images to your Azure Storage container to see them here.</p>
        </div>
      ) : (
        <div className="galleryGrid">
          {images.map((image, index) => (
            <div key={index} className="galleryItem" onClick={() => setSelectedImage(image)}>
              <img src={image.url} alt={image.name} className="galleryImage" />
              <div className="imageInfo">
                <p className="imageName">{image.name}</p>
                <p className="imageMeta">{formatFileSize(image.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedImage(null)}>&times;</span>
            <img src={selectedImage.url} alt={selectedImage.name} className="modalImage" />
            <div className="modalInfo">
              <h3>{selectedImage.name}</h3>
              <p>Size: {formatFileSize(selectedImage.size)}</p>
              <p>Last Modified: {new Date(selectedImage.lastModified).toLocaleString()}</p>
              <a href={selectedImage.url} download className="downloadLink">Download Image</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;