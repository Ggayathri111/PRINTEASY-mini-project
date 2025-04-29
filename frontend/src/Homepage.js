import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
//file uploads in mobile
function Homepage() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const line = "  https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${line}/myfiles`, { 
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedFiles(res.data);
      } catch (error) {
        console.error("Error fetching files:", error);    
      }
    };

    if (token) {
      fetchFiles();
    }
  }, [token]);

  const handleCheckboxChange = async (e, file) => {
    const newCheckedState = e.target.checked;
    
    setIsChecked(newCheckedState);
    await axios.patch(
      `${line}/toggle`,
      { isChecked: newCheckedState, objectId: file._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUploadedFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.filename === file.filename ? { ...f, flag: newCheckedState } : f
      )
    );
  };

  const handleFileUpload = async () => {
    const files = fileInputRef.current.files;
    if (files.length === 0) {
      alert("No files selected");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(`${line}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const uploadedFiles = response.data.files || [];
      for (const file of uploadedFiles) {
        const sendfile = {
          filename: file.name,
          url: file.url,
          tag: 0,
          flag: false
        };  
        console.log(sendfile);
        await axios.post(`${line}/file`, sendfile, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUploadedFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDelete = async (index) => {
    const selectedFile = uploadedFiles[index];
    try {
      await axios.delete(`${line}/deletefile`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { url: selectedFile.url },
      });

      setUploadedFiles((prevFiles) =>
        prevFiles.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (!token) return <Navigate to="/login" replace />;

  const filteredFiles = uploadedFiles.filter((file) =>
    (file.name || file.filename).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "white", color: "black", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <div className="input-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "10px 40px 10px 10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #24272b", backgroundColor: "white", color: "black" }}
          />
          <img width="25" height="25" src="https://img.icons8.com/pastel-glyph/128/search--v2.png" alt="Search" style={{ position: "absolute", right: "19%", cursor: "pointer" }} />
          <button
            onClick={() => fileInputRef.current.click()} // Trigger the file input click
            style={{ padding: "8px 16px", backgroundColor: "black", color: "white", fontSize: "14px", border: "none", borderRadius: "5px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: "700", marginLeft: "10px", flexShrink: 0 }}
          >
            Choose File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>

        {/* Show loading indicator */}
        {isLoading && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p>Uploading files... Please wait.</p>
            <div className="loader"></div> {/* You can replace this with an actual loader component */}
          </div>
        )}

        {/* Uploaded Files Table */}
        <div className="table-container">
          {filteredFiles.length > 0 ? (
            <>
              <h3 style={{ fontFamily: "sans-serif", fontSize: "25px", lineHeight:"2" }}>UPLOADED FILES</h3>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding:"10px", textAlign:"left" }}>File Name</th>
                    <th style={{ padding:"10px", textAlign:"left" }}>Status</th>
                    <th style={{ padding:"10px", textAlign:"right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td style={{ padding:"10px" }}>
                          <a
                            style={{
                              color:"black",
                              fontFamily:"sans-serif",
                              fontSize:"20px",
                              textDecoration:"none",
                            }} 
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.name || file.filename}
                          </a>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`flexSwitchCheckChecked-${index}`}
                              checked={file.flag}
                              onChange={(e) => handleCheckboxChange(e, file)}
                            />
                            <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${index}`}>
                              {file.flag ? "Printable" : "Disabled"}
                            </label>
                          </div>
                        </td>
                        <td style={{ width:"1%", textAlign:"right" }}>
                          <div className="dropdown">
                            <button
                              className="btn btn-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style={{
                                backgroundColor:"white",
                                border:"none",
                                color:"black",
                                padding:"5px 10px",
                                fontSize:"14px",
                                borderRadius:"5px",
                                cursor:"pointer",
                              }}
                            ></button>
                            <ul className="dropdown-menu dropdown-menu-end" style={{
                              backgroundColor:"#24272b",
                              border:"1px solid #444",
                              color:"white",
                              fontSize:"14px",
                              borderRadius:"5px",
                              padding:"5px 0",
                              marginTop:"5px",
                            }}>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={() => handleDelete(index)}
                                  style={{
                                    color:"white",
                                    padding:"5px 15px",
                                    textDecoration:"none",
                                    display:"block",
                                  }}
                                >
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr><td colSpan={3}><hr /></td></tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            
    </>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "30px",
      }}
    >
      <img
        src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150584271.jpg?t=st=1734847732~exp=1734851332~hmac=fdeaa9ad2ff919c5e86cd016002d7f5a16ab20bb1f31a996a58d7ca8fcd3668d&w=740"
        alt="No Files Found"
        style={{
          height: "300px",
          width: "300px",
        }}
      />
      <span
        style={{
          marginTop: "10px",
          fontSize: "18px",
          color: "#555",
          fontFamily: "sans-serif",
        }}
      >
        No documents found
      </span>
    </div>
  )}
</div>

      </div>

      
      <div
        className="scanbar"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Link to="/scancode">
          <button
            style={{
              padding: "16px",
              backgroundColor: "black",
              color: "white",
              fontFamily:"sans-serif",
              fontSize: "16px",
              border: "none",
              borderRadius: "50%", // Circular button
              cursor: "pointer",
              fontWeight: "700",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
             
            }}
          >
          Scan
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
