import { useState, useEffect } from 'react';
import axios from 'axios';
import Certificate from './Certificate';

export default function ResultPage({ roll, setFrontPage, setRoll }) {
  const [certificateData, setCertificateData] = useState(null);

  const fetchCertificateData = async (regNo) => {
    try {
      const response = await axios.get(`http://192.168.124.197:4000/getData/${regNo}`);
      if (response.status === 200) {
        setCertificateData(response.data);
      } else if (response.status === 404) {
        alert('Result Not Found');
        handleBack();
      } else {
        alert('Result Not Found');
        handleBack();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      handleBack();
    }
  };

  useEffect(() => {
    if (roll) {
      fetchCertificateData(roll);
    }
  }, [roll]);

  const handleBack = () => {
    setFrontPage(true);
    setRoll('');
  };

  const handlePrint = () => {
    const buttons = document.getElementById('buttons');
    buttons.style.display = 'none'
    window.print();
    buttons.style.display = ''
  };

  return (
    <div className="flex flex-col items-center justify-center h-full border-none">
      {certificateData ? (
        <div className="p-4 border-none">
          <div id="printable-certificate">
            <Certificate certificateData={certificateData} />
          </div>
          <div id="buttons" className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
