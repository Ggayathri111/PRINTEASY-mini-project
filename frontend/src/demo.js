import React, { useState } from "react";
import axios from "axios";

function App() {
  const [productData, setProductData] = useState([]); // Store product data
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await axios.post(" https://b033-2405-201-c010-695e-c031-72cf-6583-2019.ngrok-free.app");
      console.log("Response Data:", response.data);
      setProductData(response.data.products); // Set product data
      setIsSubmitted(true); // Show the product list
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="app">
      <form onSubmit={onSubmit}>
        <input type="submit" value="Submit" />
      </form>

      {/* Render product list if submission is successful */}
      {isSubmitted && (
        <div>
          <h2>Products:</h2>
          <ul>
            
        
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;