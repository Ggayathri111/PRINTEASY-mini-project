// qr code page at vendor shopkeeper side
import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const QRCodePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const results = Array.isArray(state?.result) ? state.result : [];
  const qrCodeValue = state?.qrCodeValue;
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(results);

  useEffect(() => {
    if (qrCodeValue) {
      fetchScanData(qrCodeValue);
    } else {
      console.warn("QR Code value is missing.");
    }
  }, [qrCodeValue]);

  const fetchScanData = async (qrCodeValue) => {
    try {
      const response = await axios.get(" https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app/scan", {
        params: { code: qrCodeValue },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response data:", response.data);

      if (response.data && response.data !== "not found") {
        const scannedData = response.data.filter(doc => doc.flag === true);
        setFilteredResults(scannedData);
      } else {
        console.log("No data found for this QR code.");
      }
    } catch (error) {
      console.error("Error fetching scan data:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = results.filter((doc) =>
      doc.filename.toLowerCase().includes(query)
    );
    setFilteredResults(filtered);
  };

  const handleLogout = async () => {
    const randomQRCodeValue = Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
    setIsLoading(true);
    try {
      for (const doc of results) {
        if (doc.tag) {
          await axios.patch(
            "  https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app/vendor",
            { tag: doc.tag },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      navigate("/qr", { state: { qrCodeValue: randomQRCodeValue } });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred during logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col w-full">
      <div className="flex-grow flex flex-col items-center justify-start p-4 w-full">
        {results.length > 0 ? (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search by filename"
                value={searchQuery}
                onChange={handleSearch}
                className="p-2 border border-gray-300 rounded w-full mr-2"
              />
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={`p-2 rounded bg-black text-white ${isLoading ? 'bg-gray-400' : 'hover:bg-gray-800'}`}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
            <ul className="w-full">
              {filteredResults.map((doc, index) => (
                <li key={index} className="mb-4 w-full">
                  <a className="block text-blue-600 hover:underline w-full" href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.filename}
                  </a>
                  <hr className="border-t border-gray-300 my-2" />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center mt-10 text-lg">***No documents found***</p>
        )}
      </div>
    </div>
  );
};

export default QRCodePage;

