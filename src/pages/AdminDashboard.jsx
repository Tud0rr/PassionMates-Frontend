import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, getAllUsers, banUser, deactivateUser, getEvents } from '../services/db';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'events'

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect non-admins
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    setUsers(getAllUsers());
    setEvents(getEvents());
  };

  const handleBan = (userId) => {
    if (window.confirm('Ești sigur că vrei să banezi acest utilizator?')) {
      banUser(userId);
      loadData();
    }
  };

  const handleDeactivate = (userId) => {
    if (window.confirm('Ești sigur că vrei să dezactivezi acest cont?')) {
      deactivateUser(userId);
      loadData();
    }
  };

  return (
    <div className="container">
      <div className="glass-panel">
        <h1 className="text-gradient mb-4">Panou Administrator 🛡️</h1>

        <div className="d-flex gap-2 mb-4">
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            Gestionare Utilizatori
          </button>
          <button 
            className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('events')}
          >
            Examinează Evenimente
          </button>
        </div>

        {activeTab === 'users' && (
          <div>
            <h3 className="mb-4">Lista Utilizatori</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
                    <th style={{ padding: '0.5rem' }}>Nume</th>
                    <th style={{ padding: '0.5rem' }}>Email / Username</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem' }}>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '0.5rem' }}>
                        <Link to={`/user/${u.id}`} style={{ color: 'var(--primary-color)' }}>{u.name}</Link>
                      </td>
                      <td style={{ padding: '0.5rem' }}>{u.email} {u.username ? `(${u.username})` : ''}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '8px', 
                          fontSize: '0.8rem',
                          background: u.status === 'banned' ? 'var(--danger-color)' : (u.status === 'deactivated' ? 'gray' : 'var(--success-color)'),
                          color: 'white'
                        }}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem' }} className="d-flex gap-2">
                        {u.role !== 'admin' && (
                          <>
                            {u.status !== 'banned' && (
                              <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleBan(u.id)}>Ban</button>
                            )}
                            {u.status !== 'deactivated' && u.status !== 'banned' && (
                              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDeactivate(u.id)}>Dezactivează</button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="mb-4">Toate Evenimentele ({events.length})</h3>
            <div className="d-flex flex-column gap-2">
              {events.map((ev) => (
                <div key={ev.id} className="request-item">
                  <div>
                    <strong>{ev.title}</strong> {ev.isPrivate && '🔒'} <br/>
                    <span className="text-muted text-sm">{ev.city} | {ev.date}</span>
                  </div>
                  <div>
                    <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => navigate(`/event/${ev.id}`)}>
                      Deschide Eveniment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
