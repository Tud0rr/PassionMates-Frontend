import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getUserById, 
  getCurrentUser, 
  banUser, 
  deactivateUser, 
  getEventById,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
} from '../services/db';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [userProfile, setUserProfile] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friendStatus, setFriendStatus] = useState('none');

  const loadData = () => {
    const u = getUserById(id);
    if (!u) {
      setError('Utilizatorul nu a fost găsit.');
      setLoading(false);
      return;
    }

    setUserProfile(u);
    const evs = (u.joinedEvents || []).map(eid => getEventById(eid)).filter(Boolean);
    setJoinedEvents(evs);
    
    if (currentUser && u.id !== currentUser.id) {
       const freshMe = getUserById(currentUser.id);
       const isFriend = freshMe.friends && freshMe.friends.includes(u.id);
       const sentReq = u.friendRequests && u.friendRequests.includes(currentUser.id);
       const rcvReq = freshMe.friendRequests && freshMe.friendRequests.includes(u.id);
       
       if (isFriend) setFriendStatus('friends');
       else if (sentReq) setFriendStatus('pending_sent');
       else if (rcvReq) setFriendStatus('pending_received');
       else setFriendStatus('none');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const isAdmin = currentUser?.role === 'admin';

  const handleBan = () => {
    if (window.confirm('Banare permanentă a acestui utilizator?')) {
      banUser(id);
      loadData();
    }
  };

  const handleDeactivate = () => {
    if (window.confirm('Dezactivare temporară a acestui cont?')) {
      deactivateUser(id);
      loadData();
    }
  };

  const handleAddFriend = () => {
    if (sendFriendRequest(id)) loadData();
  };
  const handleAcceptFriend = () => {
    if (acceptFriendRequest(id)) loadData();
  };
  const handleRejectFriend = () => {
    if (rejectFriendRequest(id)) loadData();
  };
  const handleRemoveFriend = () => {
    if (window.confirm('Ești sigur că vrei să ștergi acest prieten?')) {
      if (removeFriend(id)) loadData();
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container text-center mt-4"><h3>{error}</h3></div>;

  return (
    <div className="container">
      <div className="d-flex gap-4" style={{ flexWrap: 'wrap' }}>
        
        {/* Vizualizare Profil (stânga) */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <div className="d-flex justify-between align-center mb-4">
            <h2 className="mb-0">
              Profil: <span className="text-gradient">{userProfile.name}</span>
            </h2>
            {isAdmin && userProfile.role !== 'admin' && (
              <span style={{ 
                padding: '0.2rem 0.5rem', 
                borderRadius: '8px', 
                fontSize: '0.8rem',
                background: userProfile.status === 'banned' ? 'var(--danger-color)' : (userProfile.status === 'deactivated' ? 'gray' : 'var(--success-color)'),
                color: 'white'
              }}>
                Statut: {userProfile.status === 'banned' ? 'BANAT' : (userProfile.status === 'deactivated' ? 'DEZACTIVAT' : 'ACTIV')}
              </span>
            )}
          </div>
          
          <div className="mb-4">
             {isAdmin && <p className="text-muted"><strong>Email:</strong> {userProfile.email}</p>}
             <p className="text-muted"><strong>Vârstă:</strong> {userProfile.age} ani</p>
             <p className="text-muted"><strong>Oraș / Județ:</strong> {userProfile.city}</p>
          </div>

          <div className="mb-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
             <strong>Hobby-uri:</strong> 
             <div className="d-flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
               {userProfile.hobbies && userProfile.hobbies.length > 0 ? (
                 userProfile.hobbies.map(h => 
                   <span key={h} style={{ background: 'var(--input-bg)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid var(--primary-color)' }}>{h}</span>
                 )
               ) : (
                 <span className="text-muted">Nespecificat</span>
               )}
             </div>
          </div>

          <div className="mb-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
             <strong>Despre {userProfile.firstName}:</strong> <br/>
             <p className="mt-2">{userProfile.about ? userProfile.about : <span className="text-muted">Acest utilizator nu a adăugat o descriere momentan.</span>}</p>
          </div>

          {currentUser && currentUser.id !== userProfile.id && (
            <div className="mt-2 mb-2 d-flex flex-column gap-2">
              {friendStatus === 'none' && (
                <button className="btn btn-primary w-100" onClick={handleAddFriend}>🤝 Adaugă ca prieten</button>
              )}
              {friendStatus === 'pending_sent' && (
                <button className="btn btn-secondary w-100" disabled style={{ opacity: 0.7 }}>⏳ Cerere trimisă</button>
              )}
              {friendStatus === 'pending_received' && (
                <div className="d-flex gap-2">
                  <button className="btn btn-success flex-1" onClick={handleAcceptFriend}>✔️ Acceptă cererea</button>
                  <button className="btn btn-danger flex-1" onClick={handleRejectFriend}>❌ Respinge</button>
                </div>
              )}
              {friendStatus === 'friends' && (
                <div className="d-flex gap-2">
                   <button className="btn btn-primary flex-1" onClick={() => navigate('/friends')}>💬 Mesaj</button>
                   <button className="btn btn-secondary flex-1" onClick={handleRemoveFriend}>Șterge din prieteni</button>
                </div>
              )}
            </div>
          )}

          {/* ADMIN CONTROLS DIRECTLY ON PROFILE */}
          {isAdmin && userProfile.role !== 'admin' && (userProfile.status !== 'banned' || userProfile.status !== 'deactivated') && (
            <div className="mt-4 pt-4 d-flex gap-2" style={{ borderTop: '2px dashed var(--danger-color)' }}>
               {userProfile.status !== 'banned' && (
                 <button className="btn btn-danger flex-1" onClick={handleBan}>Blochează (Ban)</button>
               )}
               {userProfile.status !== 'deactivated' && userProfile.status !== 'banned' && (
                 <button className="btn btn-secondary flex-1" onClick={handleDeactivate}>Dezactivează cont</button>
               )}
            </div>
          )}
        </div>

        {/* Evenimentele utilizatorului (dreapta) */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h2 className="mb-4">Activitate Evenimente ({joinedEvents.length})</h2>
          
          {joinedEvents.length === 0 ? (
            <div className="text-center mt-4 text-muted">Aparent, nu se află la niciun eveniment.</div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {joinedEvents.map(ev => (
                <div key={ev.id} className="request-item">
                  <div style={{ flex: 1 }}>
                     <h4 className="mb-2">{ev.title} {ev.isPrivate && '🔒'}</h4>
                     <p className="text-muted text-sm m-0">📅 {ev.date} | 📍 {ev.city}</p>
                  </div>
                  <div>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => navigate(`/event/${ev.id}`)}>
                      Deschide
                    </button>
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

export default UserProfile;
