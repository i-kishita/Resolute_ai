import { useState } from 'react';

const FileUpload = ({ onFileUploaded, maxSizeInMB = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Function to store file in IndexedDB
  const storeFileInIndexedDB = async (file) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FileStorageDB', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');

        const fileData = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          file, // Store the file as a Blob
        };

        const addRequest = store.add(fileData);

        addRequest.onsuccess = () => {
          resolve(fileData);
        };

        addRequest.onerror = () => {
          reject(new Error('Failed to store file in IndexedDB'));
        };
      };

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');

    // Validate file size
    const maxSize = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    try {
      setUploading(true);

      // Store the file in IndexedDB
      const fileData = await storeFileInIndexedDB(file);

      // Pass file metadata to the parent component
      onFileUploaded(fileData);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#7C7CF8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="animate-pulse text-[#7C7CF8]">Uploading...</div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;