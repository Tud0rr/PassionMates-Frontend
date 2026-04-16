import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById, joinEvent, joinPaidEvent, getCurrentUser, approveParticipant, rejectParticipant, getUserBasicInfo, sendMessage } from '../services/db';
import PaymentModal from '../components/PaymentModal';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  
  // Chat state
  const [chatMessage, setChatMessage] = useState('');

  const currentUser = getCurrentUser();

  const loadData = () => {
    const e = getEventById(id);
    if (e) setEvent(e);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!event) return <div className="container text-center mt-4"><h3>Evenimentul nu a fost găsit.</h3></div>;

  const isLogged = !!currentUser;
  const isCreator = currentUser && event.creatorId === currentUser.id;
  const isJoined = currentUser && event.participants.includes(currentUser.id);
  const isPending = currentUser && event.pendingParticipants?.includes(currentUser.id);

  const handleJoin = () => {
    if (!isLogged) {
      navigate('/login');
      return;
    }
    
    try {
      if (isJoined || isPending) {
        setError('Acțiune nepermisă!');
      } else if (event.isPaid) {
        setShowPayment(true);
      } else {
        joinEvent(id);
        setSuccess(event.isPrivate ? 'Solicitarea ta de a participa a fost trimisă spre aprobare!' : 'Te-ai înscris cu succes la eveniment!');
        setError('');
        // Reload event data to reflect changes
        loadData();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePaymentSuccess = () => {
    try {
       setShowPayment(false);
       joinPaidEvent(id);
       setSuccess('Bilet achiziționat cu succes! Te-ai înscris la eveniment.');
       setError('');
       loadData();
    } catch (err) {
       setError(err.message);
    }
  };

  const handleApprove = (userId) => {
    approveParticipant(id, userId);
    loadData();
  };

  const handleReject = (userId) => {
    rejectParticipant(id, userId);
    loadData();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    try {
      sendMessage(id, chatMessage);
      setChatMessage('');
      loadData(); // Re-fetch to get the new message
    } catch (err) {
      setError(err.message);
    }
  };

  // Pre-render logic for button
  let joinButtonText = "Înscrie-te la Eveniment";
  if (event.isPrivate) joinButtonText = "Solicită Înscrierea 🔒";
  if (event.isPaid) joinButtonText = `🎟️ Cumpără Bilet (${event.price} RON)`;
  if (isJoined) joinButtonText = "Te-ai înscris ✓";
  if (isPending) joinButtonText = "Cerere În Așteptare ⏳";

  return (
    <div className="container">
      <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>
          &larr; Înapoi la Lista de Evenimente
        </button>

        {event.image && (
           <div style={{ width: '100%', height: '300px', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
        )}

        <h1 className="text-gradient mb-2">{event.title} {event.isPrivate ? '🔒' : ''}</h1>
        
        <div className="d-flex mb-4 gap-2" style={{ flexWrap: 'wrap' }}>
           <span style={{background: event.isPaid ? 'var(--primary-color)' : 'var(--success-color)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem'}}>
             {event.isPaid ? 'Eveniment Cu Plată' : (event.isPrivate ? 'Eveniment Privat' : 'Eveniment Public')}
           </span>
           {event.isPaid && (
              <span style={{background: '#ff9f43', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold'}}>
                🎟️ {event.price} RON
              </span>
           )}
           {event.hobbies?.map(h => (
              <span key={h} style={{background: 'var(--primary-color)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem'}}>
                {h}
              </span>
           ))}
        </div>

        <div className="d-flex gap-4 text-muted mb-4 mt-4" style={{flexWrap: 'wrap'}}>
          <div><strong>📅 Data:</strong> {event.date}</div>
          <div><strong>⏰ Ora:</strong> {event.time}</div>
          <div><strong>📍 Locație:</strong> {event.city}, {event.location}</div>
        </div>

        <div className="mb-4">
          <h3>Descriere Eveniment</h3>
          <p className="mt-4" style={{ lineHeight: '1.6' }}>{event.description}</p>
        </div>

        <div className="d-flex justify-between align-center mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
          <div style={{ flex: 1 }}>
            <strong>Participanți aprobați {event.participants.length}:</strong>
            <div className="mt-1 text-sm text-muted d-flex gap-2" style={{ flexWrap: 'wrap' }}>
               {event.participants.map((pid, idx) => {
                   const pUser = getUserBasicInfo(pid);
                   return pUser ? (
                      <span key={pid}>
                         <Link to={`/user/${pid}`} style={{color: 'var(--primary-color)'}}>{pUser.name}</Link>{idx < event.participants.length - 1 ? ', ' : ''}
                      </span>
                   ) : null;
               })}
            </div>
          </div>
          
          {/* Join action logic for non-creators */}
          {!isCreator && (
            <button 
              className={`btn ${isJoined || isPending ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={handleJoin}
              disabled={isJoined || isPending}
            >
              {joinButtonText}
            </button>
          )}
        </div>
        
        {error && <div className="mt-4" style={{ color: 'var(--danger-color)' }}>{error}</div>}
        {success && <div className="mt-4" style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>{success}</div>}

        {/* =========================================
            ZONA PENTRU ORGANIZATOR (CREATOR ONLY)
            ========================================= */}
        {isCreator && event.isPrivate && event.pendingParticipants?.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px dotted var(--primary-color)' }}>
            <h3 className="mb-4 text-gradient">Cereri de Participare ({event.pendingParticipants.length})</h3>
            <div className="d-flex flex-column gap-2">
              {event.pendingParticipants.map(pendingId => {
                const pUser = getUserBasicInfo(pendingId);
                if (!pUser) return null;
                return (
                  <div key={pendingId} className="request-item">
                    <div>
                       <Link to={`/user/${pendingId}`} style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{pUser.name}</Link> <span className="text-muted" style={{fontSize:'0.85rem'}}>({pUser.email})</span>
                    </div>
                    <div className="d-flex gap-2">
                       <button className="btn btn-success" style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem'}} onClick={() => handleApprove(pendingId)}>Acceptă</button>
                       <button className="btn btn-danger" style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem'}} onClick={() => handleReject(pendingId)}>Respinge</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================
            ZONA DE CHAT (PARTICIPANȚI & ADMIN)
            ========================================= */}
        {(isJoined || isCreator || currentUser?.role === 'admin') && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
             <h3 className="mb-4">Discuția Evenimentului💬</h3>
             
             <div className="chat-container">
               <div className="chat-messages">
                  {(!event.chat || event.chat.length === 0) ? (
                    <div className="text-center text-muted mt-4">Spune un salut! Începe tu discuția. 😊</div>
                  ) : (
                    event.chat.map((msg) => {
                       const isOwnMessage = currentUser.id === msg.senderId;
                       return (
                         <div key={msg.id} className={`chat-message ${isOwnMessage ? 'own-message' : ''}`}>
                            <div className="chat-sender">
                               <Link to={`/user/${msg.senderId}`} style={{ color: 'inherit', textDecoration: 'none' }}>{msg.senderName}</Link>
                            </div>
                            <div className="chat-text">{msg.text}</div>
                            <div className="chat-time">
                               {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                         </div>
                       )
                    })
                  )}
               </div>

               <form className="chat-input-area" onSubmit={handleSendMessage}>
                 <input 
                   type="text" 
                   className="form-input" 
                   placeholder="Scrie un mesaj aici..." 
                   value={chatMessage}
                   onChange={e => setChatMessage(e.target.value)}
                   style={{ flex: 1 }}
                 />
                 <button type="submit" className="btn btn-primary" disabled={!chatMessage.trim()}>Trimite</button>
               </form>
              </div>
           </div>
        )}

      </div>
      
      <PaymentModal 
         isOpen={showPayment}
         onClose={() => setShowPayment(false)}
         onSuccess={handlePaymentSuccess}
         price={event.price}
         eventName={event.title}
      />
    </div>
  );
};

export default EventDetails;
