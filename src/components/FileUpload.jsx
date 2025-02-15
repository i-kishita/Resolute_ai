import { useState } from 'react';

const FileUpload = ({ onFileUploaded, maxSizeInMB = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset error state
    setError('');

    // Validate file size
    const maxSize = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    try {
      setUploading(true);

      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

      // Create object URL for the file
      const objectUrl = URL.createObjectURL(file);

      // Create the file metadata object
      const fileData = {
        url: objectUrl,
        name: uniqueFileName,
        originalName: file.name,
        type: file.type,
        size: file.size
      };

      // Call the callback with the file data
      onFileUploaded(fileData);
    } catch (error) {
      console.error('File processing error:', error);
      setError('Failed to process file. Please try again.');
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
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="animate-pulse text-blue-500">Processing...</div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;