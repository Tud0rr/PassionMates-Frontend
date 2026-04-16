import React, { useState, useEffect } from 'react';
import { getEvents, getCurrentUser, toggleFavoriteEvent, deleteEvent } from '../services/db';
import { Navigate, useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [currentUser] = useState(getCurrentUser());
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const navigate = useNavigate();
  const [favoriteEventIds, setFavoriteEventIds] = useState(currentUser?.favoriteEvents || []);

  useEffect(() => {
    if (currentUser) {
      const allEvents = getEvents();
      // Afișăm pe pagină evenimentele pe baza ID-urilor care se află fix la încărcarea paginii.
      // Dacă dă "un-favorite", putem fie să le lăsăm acolo până la refresh, fie să le excludem reactiv.
      // E mai bine să fie reactiv și să dispară cardul când dai un-favorite (sau doar inima devine goală).
      // Aici filtrăm reactiv după starea favoriteEventIds.
      const favs = allEvents.filter(e => favoriteEventIds.includes(e.id));
      setFavoriteEvents(favs);
    }
  }, [favoriteEventIds, currentUser]);

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
        setFavoriteEvents(prev => prev.filter(ev => ev.id !== eventId));
      } catch(err) {
        alert(err.message);
      }
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h2 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
        ❤️ My Favorites
      </h2>
      
      {favoriteEvents.length > 0 ? (
        <div className="events-grid">
          {favoriteEvents.map((event) => (
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
               
               <div className="mt-4 pt-2 d-flex gap-2" style={{ borderTop: '1px solid var(--card-border)' }}>
                 {currentUser?.role === 'admin' && (
                   <button 
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}
                      onClick={(e) => handleDeleteClick(e, event.id)}
                      title="Șterge Eveniment"
                   >
                      🗑️ Șterge
                   </button>
                 )}
                 <button 
                    className="btn btn-secondary w-100"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}
                    onClick={(e) => {
                       e.stopPropagation();
                       navigate(`/event/${event.id}`);
                    }}
                 >
                    Vezi Detalii
                 </button>
               </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4 glass-panel">
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', margin: '2rem 0' }}>
            Nu ai adăugat niciun eveniment la favorite încă. Descoperă evenimente și apasă pe inima de pe card!
          </p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>Înapoi la evenimente</button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
