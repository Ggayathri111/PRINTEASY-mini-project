// Scan.js
//file uploads
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
 function Scan() {
  const location = useLocation();
  const  result  = location.state;
  const history = useNavigate();
 async function deleteinfo(){
  try{
    const response=await axios.delete("   https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app/delete",{
      params: {tag:result.result.tag},
    });
    
  }
  catch{
    console.log("error while deleting");
  }
  }
 

 

  return (
    <div>
      <h1>File Information</h1>
      <button onClick={deleteinfo}>print</button>

    {result ? (
        <div>
          <p>Filename: {result.result.filename}</p>
          <p>URL: {result.result.url}</p>
          <p>Tag: {result.result.tag}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Scan;

