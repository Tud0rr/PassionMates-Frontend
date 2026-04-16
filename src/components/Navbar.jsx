import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { getCurrentUser, logoutUser } from '../services/db';
import GlobalSearch from './GlobalSearch';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo text-gradient">
          PassionMates
        </Link>
        
        <div className="nav-links">
          <GlobalSearch />
          <Link to="/leaderboard" className="nav-link" style={{ color: '#DAA520', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🏆</span> Leaderboard
          </Link>
          {user ? (
            <>
              <Link to="/friends" className="nav-link" style={{ fontWeight: 'bold' }}>🤝 Friends</Link>
              <Link to="/favorites" className="nav-link" style={{ fontWeight: 'bold' }}>❤️ My favorites</Link>
              <Link to="/" className="nav-link">Acasă</Link>
              <Link to="/create-event" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Creare Eveniment</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}> Admin 🛡️</Link>
              )}
              <Link to="/profile" className="nav-link">Profilul meu</Link>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Autentificare</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Înregistrare</Link>
            </>
          )}

          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Schimbă tema în ${theme === 'light' ? 'dark' : 'light'}`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
