import React, { useState } from 'react';

const USER_CREDENTIALS = {
  admin: 'admin123',
  user1: 'password1',
  user2: 'password2',
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (USER_CREDENTIALS[username] === password) {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login to Khione Compressor Analysis</h2>
      <input type="text" placeholder="Username" className="w-full mb-2 p-2 border" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="w-full mb-4 p-2 border" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={handleLogin}>Login</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
