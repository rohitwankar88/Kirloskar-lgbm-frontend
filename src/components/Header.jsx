import React from 'react';
import logo from "../assets/kirloskar_logo.jpg" // Adjust path if needed

export default function Header({ username, onLogout }) {
  return (
    <div className="bg-blue-900 text-white p-4 rounded mb-4 flex items-center justify-between shadow">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Kirloskar Logo" className="h-10 w-auto object-contain" />
        <h1 className="text-xl font-bold">Khione Compressor Analysis - Kirloskar Pneumatic</h1>
      </div>
      <button
        className="bg-white text-blue-900 px-4 py-2 rounded hover:bg-gray-100 transition"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}
