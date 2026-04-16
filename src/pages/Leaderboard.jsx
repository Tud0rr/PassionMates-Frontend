import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/db';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const users = getAllUsers();
    // Sortam utilizatorii dupa numarul de evenimente la care participa, descrescator.
    // Daca un user nu are "joinedEvents", consideram 0.
    const sortedUsers = users.sort((a, b) => {
      const aEvents = a.joinedEvents?.length || 0;
      const bEvents = b.joinedEvents?.length || 0;
      return bEvents - aEvents;
    });

    // Luam doar primii 10
    setTopUsers(sortedUsers.slice(0, 10));
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🏆 Leaderboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Top 10 cei mai activi utilizatori din platformă</p>
      </div>
      
      <div className="card" style={{ padding: '2rem', borderRadius: '15px', backgroundColor: 'var(--bg-secondary)' }}>
        {topUsers.length === 0 ? (
          <p className="text-center">Nu există utilizatori momentan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topUsers.map((user, index) => {
              const eventCount = user.joinedEvents?.length || 0;
              return (
                <div 
                  key={user.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    borderLeft: index === 0 ? '5px solid #FFD700' : 
                                index === 1 ? '5px solid #C0C0C0' : 
                                index === 2 ? '5px solid #CD7F32' : '5px solid transparent',
                    transition: 'transform 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                      width: '45px', 
                      height: '45px', 
                      borderRadius: '50%', 
                      backgroundColor: index === 0 ? '#FFF8DC' : 
                                       index === 1 ? '#F5F5F5' : 
                                       index === 2 ? '#FFF3E0' : 'var(--primary-color)', 
                      color: index === 0 ? '#B8860B' : 
                             index === 1 ? '#696969' : 
                             index === 2 ? '#8B4513' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.3rem',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                        <Link to={`/user/${user.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                          {user.name}
                        </Link>
                      </h3>
                      {index === 0 && <span style={{ fontSize: '0.85rem', color: '#B8860B', fontWeight: '500' }}>👑 Cel mai activ</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)', lineHeight: '1' }}>
                      {eventCount}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {eventCount === 1 ? 'eveniment' : 'evenimente'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
