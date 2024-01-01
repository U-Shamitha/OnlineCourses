import React, { useEffect, useState } from 'react';
import axios from './axios/axiosConfig';

function VideoList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Replace with your server's API endpoint to retrieve files
    axios.get('/files')
      .then((response) => response.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => {
        console.error('Error fetching files:', error);
      });
  }, []);

  return (
    <div>
      <h1>Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <a
              href={`http://localhost:3000/file/${file._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoList;



