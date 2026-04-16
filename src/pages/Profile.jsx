import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUser, getEventById } from '../services/db';
import { HOBBIES_LIST } from '../utils/constants';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [about, setAbout] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [loadingObj, setLoading] = useState(true);
  const [joinedEventsDetails, setJoinedEventsDetails] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setAbout(currentUser.about || '');
      setSelectedHobbies(currentUser.hobbies || []);
      
      const events = (currentUser.joinedEvents || []).map(id => getEventById(id)).filter(Boolean);
      setJoinedEventsDetails(events);
      setLoading(false);
    }
  }, [navigate]);

  const handleHobbyToggle = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = updateUser({ about, hobbies: selectedHobbies });
    if(updated) {
      setUser(updated);
      setIsEditing(false);
    }
  };

  if (loadingObj || !user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="d-flex gap-4" style={{ flexWrap: 'wrap' }}>
        
        {/* Setări Profil */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h2 className="mb-4">Bun venit, <span className="text-gradient">{user.firstName} {user.lastName}</span></h2>
          <div className="mb-4">
            <p className="text-muted"><strong>Email:</strong> {user.email}</p>
            <p className="text-muted"><strong>Vârstă:</strong> {user.age} ani</p>
            <p className="text-muted"><strong>Oraș / Județ:</strong> {user.city}</p>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSave} className="mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
              
              <div className="form-group">
                <label className="form-label">Editează Hobby-urile</label>
                <div className="d-flex gap-2" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {HOBBIES_LIST.map(h => (
                    <label key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--input-bg)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', border: selectedHobbies.includes(h) ? '2px solid var(--primary-color)' : '1px solid var(--input-border)' }}>
                      <input type="checkbox" checked={selectedHobbies.includes(h)} onChange={() => handleHobbyToggle(h)} style={{ display: 'none' }} />
                      {h}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label">Despre mine (Bio)</label>
                <textarea 
                  className="form-input" 
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Scrie câteva cuvinte care te reprezintă..."
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Salvează Modificările</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setIsEditing(false);
                  setSelectedHobbies(user.hobbies); // Revert changes
                }}>Anulează</button>
              </div>
            </form>
          ) : (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
              <div className="mb-4">
                <strong>Hobby-uri salvate:</strong> 
                <div className="d-flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                  {user.hobbies && user.hobbies.length > 0 ? (
                    user.hobbies.map(h => 
                      <span key={h} style={{ background: 'var(--input-bg)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid var(--primary-color)' }}>{h}</span>
                    )
                  ) : (
                    <span className="text-muted">Nespecificat</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <strong>Bio:</strong> <br/>
                <p className="mt-4">{user.about ? user.about : <span className="text-muted">Nu ai adăugat o descriere momentan.</span>}</p>
              </div>

              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Editează Info Adiționale</button>
            </div>
          )}
        </div>

        {/* Evenimentele la care s-a dat participare */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h2 className="mb-4">Evenimentele mele ({joinedEventsDetails.length})</h2>
          
          {joinedEventsDetails.length === 0 ? (
            <div className="text-center mt-4">
              <p className="text-muted mb-4">Nu te-ai înscris la niciun eveniment încă.</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Găsește evenimente</button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {joinedEventsDetails.map(ev => (
                <div key={ev.id} style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '1rem', transition: 'transform 0.2s' }} className="event-history-card">
                  <h4 className="mb-2">{ev.title}</h4>
                  <p className="text-muted mb-2 text-sm">📅 {ev.date} | 📍 {ev.city}</p>
                  
                  {/* Hobby Tags limited display */}
                  <div className="mb-2">
                    {ev.hobbies?.slice(0, 2).map(h => (
                       <span key={h} style={{ fontSize: '0.7rem', background: 'var(--secondary-color)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '8px', marginRight: '4px' }}>{h}</span>
                    ))}
                    {ev.hobbies?.length > 2 && <span style={{ fontSize: '0.7rem' }}>+{ev.hobbies.length - 2}</span>}
                  </div>

                  <button className="btn btn-secondary w-100" style={{ width: '100%', marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => navigate(`/event/${ev.id}`)}>
                    Mergi la pagină
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
