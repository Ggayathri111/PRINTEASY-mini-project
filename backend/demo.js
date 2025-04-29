import React, { useState } from "react";

function App() {
  const [fileData, setFileData] = useState(null);

  function handleChange(e) {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const fileURL = URL.createObjectURL(uploadedFile);
      setFileData({
        name: uploadedFile.name, // File name for the <a> tag
        url: fileURL,            // Temporary URL for the link
      });
    }
  }

  return (
    <div className="App">
      <h2>Add File:</h2>
      <input type="file" onChange={handleChange} />
      
      {fileData && (
        <div>
          <h3>Uploaded File:</h3>
          <a 
            href={fileData.url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {fileData.name}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;