import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import images
import KRS4115 from '../assets/KRS4115.png';
import KRS4133 from '../assets/KRS4133.png';
import KRS4150 from '../assets/KRS4150.png';
import KRS4170 from '../assets/KRS4170.png';
import KRS4195 from '../assets/KRS4195.png';
import KRS4225 from '../assets/KRS4225.png';

// const backend_url = "https://kirloskar-lgbm.onrender.com/process";
//  const backend_url = `${process.env.REACT_APP_BACKEND_API_URL}/process`;
const backend_url = `${import.meta.env.VITE_BACKEND_API_URL}/process`;


console.log("Backend URL:", backend_url);
const outputOrder = [
  "Compressor Model", "Suction Pressure (bar abs)", "Suction Temperature (°C)", "Discharge Pressure (bar abs)",
  "Discharge Temperature (°C)", "Speed (RPM)", "Volume Flow Rate (kg/hr)", "Compressor Shaft Power (kW)",
  "Adiabatic Efficiency (%)", "Volumetric Efficiency (%)", "Isentropic Work (kW)", "Refrigeration Effect (kW)",
  "Coefficient of Performance (COP)"
];

// Map model names to images
const modelImages = {
  "KRS4115": KRS4115,
  "KRS4133": KRS4133,
  "KRS4150": KRS4150,
  "KRS4170": KRS4170,
  "KRS4195": KRS4195,
  "KRS4225": KRS4225,
};

export default function CompressorForm() {
  const [formData, setFormData] = useState({
    model: "KRS4115", refrigerant: "Ammonia", evap_temp: 10.0, cond_temp: 30.0, superheat: 0.0, speed: 2980
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(backend_url, formData);
      if (res.data.error) {
        setError(res.data.error);
        setResults(null);
      } else {
        setResults(res.data);
        setError('');
      }
    } catch (err) {
      setError("Failed to connect to backend");
    }
  };

  const generatePDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 15;
  let y = margin;

  // Add Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Khione Compressor Analysis Results', pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });

  y += 10;

  // Add Compressor Image (if available)
  const model = results["Compressor Model"];
  const image = modelImages[model];
  if (image) {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const imgWidth = 60;
      const imgHeight = (img.height / img.width) * imgWidth;
      pdf.addImage(img, 'PNG', (pdf.internal.pageSize.getWidth() - imgWidth) / 2, y, imgWidth, imgHeight);

      y += imgHeight + 10;

      // Add result fields
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      outputOrder.forEach(key => {
        if (results[key]) {
          pdf.text(`${key}: ${results[key]}`, margin, y);
          y += 7;
        }
      });

      // Save the PDF after image is rendered
      pdf.save('Khione_Compressor_Analysis_Results.pdf');
    };
  } else {
    // Fallback: no image, just data
    y += 10;
    outputOrder.forEach(key => {
      if (results[key]) {
        pdf.text(`${key}: ${results[key]}`, margin, y);
        y += 7;
      }
    });
    pdf.save('Khione_Compressor_Analysis_Results.pdf');
  }
};

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Enter Compressor Parameters</h2>

      <label>Compressor Model</label>
      <select
        name="model"
        className="w-full p-2 mb-2 border"
        value={formData.model}
        onChange={handleChange}
      >
        {Object.keys(modelImages).map(m => <option key={m}>{m}</option>)}
      </select>

      <label>Refrigerant</label>
      <select name="refrigerant" className="w-full p-2 mb-2 border" onChange={handleChange} value={formData.refrigerant}>
        {["Ammonia", "R134a", "R404A", "R410A", "R1234yf", "CO2"].map(r => <option key={r}>{r}</option>)}
      </select>

      <label>Evaporator Temperature (°C)</label>
      <input name="evap_temp" type="number" className="w-full p-2 mb-2 border" value={formData.evap_temp} onChange={handleChange} />

      <label>Condenser Temperature (°C)</label>
      <input name="cond_temp" type="number" className="w-full p-2 mb-2 border" value={formData.cond_temp} onChange={handleChange} />

      <label>Superheat (°C)</label>
      <input name="superheat" type="number" className="w-full p-2 mb-2 border" value={formData.superheat} onChange={handleChange} />

      <label>Speed (RPM)</label>
      <input name="speed" type="number" className="w-full p-2 mb-4 border" value={formData.speed} onChange={handleChange} />

      <button onClick={handleSubmit} className="bg-blue-600 text-white w-full p-2 rounded">Calculate</button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div id="result-section" className="mt-6">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Khione Compressor Analysis Results</h3>
          {results["Compressor Model"] && modelImages[results["Compressor Model"]] && (
            <div className="flex justify-center mb-4">
              <img
                src={modelImages[results["Compressor Model"]]}
                alt={results["Compressor Model"]}
                className="h-40 object-contain"
              />
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded shadow">
            {outputOrder.map(key => (
              key in results && (
                <div key={key} className="flex justify-between border-b py-2 last:border-b-0">
                  <span className="font-semibold">{key}:</span>
                  <span>{results[key]}</span>
                </div>
              )
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={generatePDF}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}