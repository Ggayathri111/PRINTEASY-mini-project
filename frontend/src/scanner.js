//scanning through mobile 
import React, { useState, useRef, useContext, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr"; // Install via npm: npm install jsqr
import axios from "axios";
import { AuthContext } from "./AuthContext";

const QRScannerPage = () => {
  const [scanResult, setScanResult] = useState("");
  const { token } = useContext(AuthContext);
  const webcamRef = useRef(null);
  const [error, setError] = useState("");

  const videoConstraints = {
    facingMode: "environment", 
  };

  const captureAndScan = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);
          if (qrCodeData) {
            handleScan(qrCodeData.data);
          } else {
            setError("QR code not detected. Try again.");
          }
        };
      }
    }
  };

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);
      try {
        const response = await axios.patch(
          "   https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app/update",
          { tag: data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Update response from server:", response.data);
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(captureAndScan, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: "white", color: "white", minHeight: "100vh", padding: "20px" }}>
      <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 className="heading" style={{ color: "black", fontFamily: "sans-serif", fontSize: "24px", marginBottom: "20px" }}>
          Scan QR Code
        </h2>
        <div className="webcamContainer" style={{ margin: "auto", width: "300px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        {error && <p className="error" style={{ color: "red", fontFamily: "sans-serif", fontSize: "18px", marginTop: "20px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default QRScannerPage;

