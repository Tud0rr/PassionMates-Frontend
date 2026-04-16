import { useState, useEffect } from 'react';
import { toggleFavoriteEvent, getCurrentUser, deleteEvent } from '../services/db';

const CATEGORY_COLORS = {
  'Sport':        { bg: '#dbeafe', text: '#1d4ed8', emoji: '🏃' },
  'Cultură':      { bg: '#ede9fe', text: '#7c3aed', emoji: '📚' },
  'Petrecere':    { bg: '#fce7f3', text: '#be185d', emoji: '🎉' },
  'Artă':         { bg: '#fef3c7', text: '#b45309', emoji: '🎨' },
  'Divertisment': { bg: '#dcfce7', text: '#15803d', emoji: '🎭' },
};


function EventCard({ event }) {


  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState(event.participants);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (currentUser && currentUser.favoriteEvents && currentUser.favoriteEvents.includes(event.id)) {
      setIsFavorite(true);
    }
  }, [event.id, currentUser]);

  const handleJoin = () => {
    if (!joined) {
      setJoined(true);
      setParticipants(prev => prev + 1); 
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Trebuie să fii conectat pentru a adăuga la favorite!");
      return;
    }
    const newStatus = toggleFavoriteEvent(event.id);
    setIsFavorite(newStatus);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Ești sigur că vrei să ștergi acest eveniment? Această acțiune este ireversibilă!")) {
      try {
        deleteEvent(event.id);
        // Page reload will refresh the events list. Alternatively, notify parent component.
        alert("Eveniment șters cu succes!");
        window.location.reload();
      } catch(err) {
        alert(err.message);
      }
    }
  };

  const occupancy = Math.round((participants / event.maxParticipants) * 100);

  const categoryStyle = CATEGORY_COLORS[event.category] || 
    { bg: '#f1f5f9', text: '#475569', emoji: '📌' };

  const isFull = participants >= event.maxParticipants;

  return (
    <div style={styles.card}>

      {}
      <div style={styles.cardHeader}>
        <span style={{
          ...styles.categoryBadge,
          backgroundColor: categoryStyle.bg,
          color: categoryStyle.text,
        }}>
          {categoryStyle.emoji} {event.category}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={handleFavoriteClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '0',
              color: isFavorite ? '#ef4444' : '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            title={isFavorite ? "Șterge din favorite" : "Adaugă la favorite"}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          
          {isFull && (
            <span style={styles.fullBadge}>Complet</span>
          )}
        </div>
      </div>

      {/* Titlul evenimentului */}
      <h3 style={styles.title}>{event.title}</h3>

      {}
      <p style={styles.description}>{event.description}</p>

      {}
      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.detailIcon}>📍</span>
          <span style={styles.detailText}>{event.location}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailIcon}>📅</span>
          <span style={styles.detailText}>{event.date}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailIcon}>🕐</span>
          <span style={styles.detailText}>{event.time}</span>
        </div>
      </div>

      {/* Bara de progres pentru participanți */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Participanți</span>
          <span style={styles.progressCount}>
            {participants} / {event.maxParticipants}
          </span>
        </div>
        {}
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${occupancy}%`,
            
            backgroundColor: occupancy >= 90 ? '#ef4444' 
                           : occupancy >= 60 ? '#f59e0b' 
                           : '#10b981',
          }} />
        </div>
      </div>

      {}
      <div style={styles.actions}>
        {currentUser?.role === 'admin' && (
          <button
            style={styles.deleteButton}
            onClick={handleDeleteClick}
          >
            🗑️ Șterge
          </button>
        )}
        <button
          style={styles.detailsButton}
          onClick={() => alert(`Detalii pentru: ${event.title}`)}
        >
          Detalii
        </button>

        <button
          style={{
            ...styles.joinButton,
            backgroundColor: joined ? '#10b981' 
                           : isFull ? '#94a3b8' 
                           : '#6366f1',
            cursor: (joined || isFull) ? 'not-allowed' : 'pointer',
          }}
          onClick={handleJoin}
          disabled={joined || isFull}
        >
          {joined ? '✓ Înscris' : isFull ? 'Complet' : 'Join'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #f1f5f9',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  fullBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.3',
  },
  description: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  detailIcon: {
    fontSize: '14px',
    width: '20px',
  },
  detailText: {
    fontSize: '13px',
    color: '#475569',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  progressCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
  },
  deleteButton: {
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  detailsButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: 'transparent',
    color: '#475569',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  joinButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
};

export default EventCard;