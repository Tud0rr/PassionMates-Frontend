import React, { useState, useEffect, useRef } from 'react';
import { getAllUsers, getEvents } from '../services/db';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('users');
    const [results, setResults] = useState([]);
    
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        
        const performSearch = () => {
            if (searchType === 'users') {
                const allUsers = getAllUsers();
                const filtered = allUsers.filter(u => 
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (u.firstName && u.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (u.lastName && u.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                setResults(filtered);
            } else {
                const allEvents = getEvents();
                const filtered = allEvents.filter(e => 
                    e.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setResults(filtered);
            }
        };
        
        performSearch();
    }, [searchQuery, searchType]);

    const handleResultClick = (id) => {
        setIsOpen(false);
        setSearchQuery('');
        if (searchType === 'users') {
            navigate(`/user/${id}`);
        } else {
            navigate(`/event/${id}`);
        }
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                🔍 Caută...
            </button>

            {isOpen && (
                <div className="glass-panel" style={{ 
                    position: 'absolute', 
                    top: '120%', 
                    left: '0',
                    width: '320px', 
                    zIndex: 1000, 
                    padding: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}>
                    <input 
                        type="text" 
                        autoFocus
                        className="form-input mb-3" 
                        placeholder={searchType === 'users' ? "Nume, prenume..." : "Titlu eveniment..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
                    />

                    <div className="d-flex gap-3 mb-3 justify-center" style={{ fontSize: '0.9rem' }}>
                       <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <input type="radio" name="gSearchType" value="users" checked={searchType === 'users'} onChange={(e) => setSearchType(e.target.value)} />
                           👤 Persoane
                       </label>
                       <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <input type="radio" name="gSearchType" value="events" checked={searchType === 'events'} onChange={(e) => setSearchType(e.target.value)} />
                           📅 Evenimente
                       </label>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {searchQuery.trim() === '' ? (
                            <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>Scrie pentru a căuta...</p>
                        ) : results.length === 0 ? (
                            <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>Niciun rezultat.</p>
                        ) : (
                            results.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleResultClick(item.id)}
                                    style={{ 
                                        padding: '0.8rem', 
                                        borderBottom: '1px solid var(--card-border)', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ width: '35px', height: '35px', borderRadius: searchType === 'users' ? '50%' : '8px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                        {searchType === 'users' ? '👤' : (item.image ? <img src={item.image} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : '📅')}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {searchType === 'users' ? item.name : item.title}
                                        </h4>
                                        <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {searchType === 'users' ? item.city : item.date}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
