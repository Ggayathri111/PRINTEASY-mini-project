import React, { useState, useEffect, useContext } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Laptop, Lock, SmartphoneNfc, QrCode } from 'lucide-react';

const QRCodeComponent = () => {
  const line = "https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app";
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const generateRandomCode = () => {
    return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
  };

  const [qrCodeValue, setCode] = useState(generateRandomCode());

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`${line}/scan`, {
          params: { code: qrCodeValue },
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.data;

        if (result && result !== 'not found' && result.length > 0) {
          navigate("/qrscan", { state: { result, qrCodeValue } });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchdata, 5000);

    return () => clearInterval(intervalId);
  }, [qrCodeValue, navigate, token]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-black py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2">
            <img 
              src="/images/quill.jpg" 
              alt="WhatsApp Logo" 
              className="h-7"
            />
            <h1 className="text-xl font-light text-white">PRINTEASY WEB</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-48">
          {/* Left Side - QR Code */}
          <div className="bg-white p-8 rounded-lg">
            <div className="w-72 h-72 bg-white flex items-center justify-center">
              <QRCodeSVG 
                value={qrCodeValue} 
                size={288}
                level="H"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Right Side - Instructions */}
          <div className="max-w-md">
            <h2 className="text-3xl font-light mb-8">To use PrintEasy on your computer:</h2>
            
            <ol className="space-y-8">
              <li className="flex items-start gap-6">
                <span className="mt-1"><SmartphoneNfc size={24} className="text-[#00a884]" /></span>
                <div>
                  <p className="font-medium text-lg">Login to PrintEasy</p>
                  <p className="text-gray-600 text-sm mt-1">New to PrintEasy? <a href="/Signup" className="text-[#00a884] hover:text-[#00806a]">Register</a></p>
                </div>
              </li>

              <li className="flex items-start gap-6">
                <span className="mt-1"><Laptop size={24} className="text-[#00a884]" /></span>
                <div>
                  <p className="font-medium text-lg">Upload your documents</p>
                  <p className="text-gray-600 text-sm mt-1">using the "Add File" button</p>
                </div>
              </li>

              <li className="flex items-start gap-6">
                <span className="mt-1"><QrCode size={24} className="text-[#00a884]" /></span>
                <div>
                  <p className="font-medium text-lg">Scan QR Code at Shop</p>
                  <p className="text-gray-600 text-sm mt-1">Point your phone to the QR code at the shop</p>
                </div>
              </li>
            </ol>

            <div className="mt-12 flex items-center gap-2 text-sm text-gray-600">
              <Lock size={16} />
              <p>End-to-end encrypted</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRCodeComponent;
