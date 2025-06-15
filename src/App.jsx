import React, { useState } from 'react';
import CompressorForm from './components/CompressorForm';
import Login from './components/Login';
import Header from './components/Header';
import kirloskarLogo from './assets/kirloskar_logo.jpg'; // Adjust path if needed

function HomePage({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-lg w-full text-center">
        <img
          src={kirloskarLogo}
          alt="Compressor"
          className="mx-auto mb-6 h-32 object-contain"
        />
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Khione Compressor Analysis</h1>
        <p className="text-lg text-gray-700 mb-8">
          Analyze and generate detailed reports for Kirloskar compressors. Please log in to continue.
        </p>
        <button
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showHome, setShowHome] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  if (showHome) {
    return <HomePage onStart={() => setShowHome(false)} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {!authenticated ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Login to Khione</h2>
            <Login onLogin={(user) => { setAuthenticated(true); setUsername(user); }} />
          </div>
        </div>
      ) : (
        <>
          <Header onLogout={() => setAuthenticated(false)} username={username} />
          <CompressorForm />
        </>
      )}
    </div>
  );
}

export default App;