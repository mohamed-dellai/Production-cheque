import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.7, 
    };
  
    try {
      let compressedFile = await imageCompression(file, options);
      let attempts = 0;
      const maxAttempts = 3;
  
      // If the file is still too large, try compressing again with lower quality
      while (compressedFile.size > 300 * 1024 && attempts < maxAttempts) {
        options.initialQuality -= 0.1; // Reduce quality by 10% each attempt
        compressedFile = await imageCompression(compressedFile, options);
        attempts++;
      }
  
      
      console.log('Compressed file size:', compressedFile.size / 1024, 'KB');
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file; // Return original file if compression fails
    }
  };