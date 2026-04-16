import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getEvents, initDb, getCurrentUser, toggleFavoriteEvent, deleteEvent } from '../services/db';
import { ROMANIAN_COUNTIES, HOBBIES_LIST } from '../utils/constants';

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Filtre Active
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  
  // Stare pentru favorite
  const [favoriteEventIds, setFavoriteEventIds] = useState(currentUser?.favoriteEvents || []);

  const handleFavoriteClick = (e, eventId) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Trebuie să fii conectat pentru a adăuga la favorite!");
      return;
    }
    const isNowFav = toggleFavoriteEvent(eventId);
    setFavoriteEventIds(prev => 
      isNowFav ? [...prev, eventId] : prev.filter(id => id !== eventId)
    );
  };

  const handleDeleteClick = (e, eventId) => {
    e.stopPropagation();
    if (window.confirm("Ești sigur că vrei să ștergi acest eveniment? Această acțiune este ireversibilă!")) {
      try {
        deleteEvent(eventId);
        setEvents(prev => prev.filter(ev => ev.id !== eventId));
        // Remove from favorites as well optionally, but setEvents covers the view
      } catch(err) {
        alert(err.message);
      }
    }
  };

  useEffect(() => {
    initDb();
    setEvents(getEvents());
  }, []);

  const handleHobbyToggle = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedHobbies([]);
  };

  const filteredEvents = events.filter((event) => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
    }
    
    if (selectedCity && event.city !== selectedCity) {
        return false;
    }
    
    if (selectedHobbies.length > 0) {
      // Must match at least one of the selected hobbies
      const hasMatch = event.hobbies?.some(h => selectedHobbies.includes(h));
      if (!hasMatch) return false;
    }
    
    return true;
  });

  return (
    <div className="container">

      <div className="home-layout">
         {/* LEFT SIDEBAR (FILTERS) */}
         <div className="sidebar-filters glass-panel">
            <h3 className="mb-4 text-gradient">Filtre Căutare</h3>
            
            <div className="form-group">
               <label className="form-label">Cuvinte cheie</label>
               <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Maraton" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            <div className="form-group">
               <label className="form-label">Filtru Județ</label>
               <select className="form-input" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  <option value="">-- Toate Județele --</option>
                  {ROMANIAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="form-group">
               <label className="form-label mb-2">Pasiuni / Hobby-uri</label>
               <div className="filters-scroll">
                 <div className="d-flex flex-column gap-1">
                 {HOBBIES_LIST.map(h => (
                   <label key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                     <input type="checkbox" checked={selectedHobbies.includes(h)} onChange={() => handleHobbyToggle(h)} />
                     {h}
                   </label>
                 ))}
                 </div>
               </div>
            </div>

            <button className="btn btn-secondary w-100 mt-4" onClick={clearFilters}>Curăță Filtrele</button>
         </div>

         {/* RIGHT MAIN CONTENT */}
         <div className="main-content">
            <div className="mb-4">
               <h1 style={{fontSize: "2rem"}}>Descoperă Evenimente</h1>
               <p className="text-muted mt-2">Alege filtrele din stânga pentru a găsi activitățile perfecte pentru tine.</p>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center mt-4 glass-panel">
                <h3 className="text-muted">Niciun eveniment nu corespunde acestor criterii.</h3>
                {currentUser ? 
                   <button className="btn btn-primary mt-4" onClick={() => navigate('/create-event')}>Fii tu creatorul!</button>
                   : <Link to="/login" className="btn btn-primary mt-4">Loghează-te pentru a participa</Link>
                }
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="glass-panel event-card"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    {event.image && (
                       <div style={{ width: '100%', height: '150px', marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                          <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       </div>
                    )}
                    <div className="d-flex justify-between mb-2">
                       <h3 className="text-gradient" style={{ flex: 1, margin: 0 }}>{event.title}</h3>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <button 
                            onClick={(e) => handleFavoriteClick(e, event.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.8rem',
                              padding: '0',
                              color: favoriteEventIds.includes(event.id) ? '#ef4444' : 'var(--text-main)',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'transform 0.2s',
                              lineHeight: '1',
                            }}
                            title={favoriteEventIds.includes(event.id) ? "Șterge din favorite" : "Adaugă la favorite"}
                         >
                            {favoriteEventIds.includes(event.id) ? '❤️' : '♡'}
                         </button>
                         {event.isPrivate ? 
                            <span title="Eveniment Privat" style={{ fontSize: '1.2rem' }}>🔒</span> 
                            : <span title="Eveniment Public" style={{ fontSize: '1.2rem' }}>🌍</span>
                         }
                       </div>
                    </div>
                    
                    <div className="mb-2">
                      {event.hobbies?.map(h => (
                        <span key={h} style={{ fontSize: '0.75rem', background: 'var(--primary-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '12px', marginRight: '5px', display: 'inline-block' }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    <p className="text-muted mb-2 text-sm">
                      <strong>📅</strong> {event.date} | <strong>⏰</strong> {event.time}
                    </p>
                    <p className="text-muted mb-4 text-sm">
                      <strong>📍 {event.city}</strong> — {event.location}
                    </p>
                    
                    <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.9rem', flex: 1 }}>
                      {event.description}
                    </p>
                    
                    <div className="d-flex justify-between align-center mt-4 pt-2" style={{ borderTop: '1px solid var(--card-border)' }}>
                      <span className="text-muted text-sm">👥 {event.participants.length} persoane</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {currentUser?.role === 'admin' && (
                          <button 
                             className="btn btn-danger"
                             style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                             onClick={(e) => handleDeleteClick(e, event.id)}
                             title="Șterge Eveniment"
                          >
                             🗑️ Șterge
                          </button>
                        )}
                        <button 
                           className="btn btn-secondary"
                           style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                           onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/event/${event.id}`);
                           }}
                        >
                           Vezi Detalii
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Home;
