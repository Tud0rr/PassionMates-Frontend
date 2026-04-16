import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/db';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-center align-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 text-gradient">Autentificare</h2>
        
        {error && <div className="mb-4" style={{ color: 'var(--danger-color)' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email sau Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Parolă</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        
        <p className="text-center mt-4 text-muted">
          Nu ai cont? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Înregistrează-te</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
