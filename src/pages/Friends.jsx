import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  getUserById, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  getDirectMessages, 
  sendDirectMessage 
} from '../services/db';

const Friends = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const bottomRef = useRef(null);

  const loadData = () => {
    if (!currentUser) {
        navigate('/login');
        return;
    }
    
    // Luam datele actualizate (friends / pending)
    const freshMe = getUserById(currentUser.id);
    if (freshMe) {
        const frs = (freshMe.friends || []).map(id => getUserById(id)).filter(Boolean);
        const reqs = (freshMe.friendRequests || []).map(id => getUserById(id)).filter(Boolean);
        setFriends(frs);
        setFriendRequests(reqs);
    }
  };

  useEffect(() => {
    loadData();
    // Polling simplu pentru mesaje live
    const interval = setInterval(() => {
        if (activeChatId) {
            setMessages(getDirectMessages(activeChatId));
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  useEffect(() => {
    if (activeChatId) {
        setMessages(getDirectMessages(activeChatId));
    }
  }, [activeChatId]);

  useEffect(() => {
     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAccept = (e, reqId) => {
    e.stopPropagation();
    if(acceptFriendRequest(reqId)){
      loadData();
    }
  };

  const handleReject = (e, reqId) => {
    e.stopPropagation();
    if(rejectFriendRequest(reqId)){
      loadData();
    }
  };

  const handleSendMessage = (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !activeChatId) return;
      
      const msg = sendDirectMessage(activeChatId, newMessage);
      if(msg) {
         setMessages(getDirectMessages(activeChatId));
         setNewMessage('');
      }
  };

  if (!currentUser) return null;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 className="mb-4 text-gradient">🤝 Prieteni & Mesaje</h1>
      
      <div className="d-flex gap-4" style={{ height: '75vh', flexWrap: 'wrap' }}>
         {/* LEFT COLUMN: FRIENDS LIST */}
         <div className="glass-panel" style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', padding: '1.5rem', overflowY: 'auto' }}>
            
            {friendRequests.length > 0 && (
                <div className="mb-4">
                  <h4 style={{ color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '1rem' }}>Cereri de prietenie ({friendRequests.length})</h4>
                  <div className="d-flex flex-column gap-2">
                     {friendRequests.map(req => (
                        <div key={req.id} className="p-3 d-flex justify-between align-center" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                           <div>
                              <Link to={`/user/${req.id}`} style={{ fontWeight: 'bold', textDecoration: 'none', color: 'var(--text-color)' }}>{req.name}</Link>
                           </div>
                           <div className="d-flex gap-2">
                              <button className="btn btn-success" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }} onClick={(e) => handleAccept(e, req.id)}>✔️ Acceptă</button>
                              <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }} onClick={(e) => handleReject(e, req.id)}>❌</button>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
            )}

            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Prietenii tăi ({friends.length})</h4>
            {friends.length === 0 ? (
                <p className="text-muted">Nu ai încă niciun prieten. Vizitează profilurile altor utilizatori pentru a le trimite cereri!</p>
            ) : (
                <div className="d-flex flex-column gap-2">
                   {friends.map(f => (
                       <div 
                         key={f.id} 
                         className="p-3 d-flex align-center gap-3" 
                         style={{ 
                            backgroundColor: activeChatId === f.id ? 'var(--primary-color)' : 'var(--bg-secondary)',
                            color: activeChatId === f.id ? 'white' : 'var(--text-color)',
                            borderRadius: '12px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            transform: activeChatId === f.id ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: activeChatId === f.id ? '0 4px 15px rgba(108, 92, 231, 0.4)' : 'none'
                         }}
                         onClick={() => setActiveChatId(f.id)}
                       >
                           <div style={{
                               width: '45px', height: '45px', borderRadius: '50%', 
                               backgroundColor: activeChatId === f.id ? 'rgba(255,255,255,0.2)' : 'var(--primary-color)',
                               color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                               fontWeight: 'bold', fontSize: '1.1rem'
                           }}>
                               {f.firstName[0]}{f.lastName[0]}
                           </div>
                           <div style={{ flex: 1 }}>
                               <h5 style={{ margin: 0, fontSize: '1.1rem' }}>{f.name}</h5>
                           </div>
                       </div>
                   ))}
                </div>
            )}
         </div>

         {/* RIGHT COLUMN: CHAT WINDOW */}
         <div className="glass-panel" style={{ flex: '2.5', minWidth: '400px', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            {!activeChatId ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>💬</div>
                    <h3>Selectează un prieten pentru a începe conversația</h3>
                </div>
            ) : (() => {
                const activeFriend = friends.find(f => f.id === activeChatId);
                // În caz că prietenul a dat unfriend între timp
                if (!activeFriend) { 
                    setActiveChatId(null); 
                    return null; 
                }

                return (
                    <>
                        <div className="p-3 d-flex align-center gap-3 mb-3" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem'
                            }}>
                               {activeFriend.firstName[0]}{activeFriend.lastName[0]}
                            </div>
                            <h3 style={{ margin: 0 }}>
                               <Link to={`/user/${activeFriend.id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>{activeFriend.name}</Link>
                            </h3>
                        </div>

                        {/* MESSAGES AREA */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: 'var(--text-muted)' }}>
                                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                                   <p>Niciun mesaj încă. Trimite-i un salut lui {activeFriend.firstName}!</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.senderId === currentUser.id;
                                    return (
                                        <div key={msg.id} style={{ 
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            backgroundColor: isMe ? 'var(--primary-color)' : 'var(--bg-secondary)',
                                            color: isMe ? 'white' : 'var(--text-primary)',
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: '18px',
                                            borderBottomRightRadius: isMe ? '4px' : '18px',
                                            borderBottomLeftRadius: !isMe ? '4px' : '18px',
                                            maxWidth: '75%',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ wordBreak: 'break-word' }}>{msg.text}</div>
                                            <div style={{ fontSize: '0.7rem', opacity: isMe ? 0.9 : 0.6, marginTop: '5px', textAlign: isMe ? 'right' : 'left' }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* INPUT AREA */}
                        <form onSubmit={handleSendMessage} className="mt-3 d-flex gap-2" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                            <input 
                               type="text" 
                               className="form-control" 
                               placeholder="Scrie un mesaj..." 
                               value={newMessage}
                               onChange={(e) => setNewMessage(e.target.value)}
                               style={{ flex: 1, borderRadius: '25px', padding: '0.8rem 1.5rem', border: '1px solid var(--input-bg)' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', padding: '0.8rem 1.8rem', fontWeight: 'bold' }}>
                                Trimite
                            </button>
                        </form>
                    </>
                );
            })()}
         </div>
      </div>
    </div>
  );
};

export default Friends;
