import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, getCurrentUser } from '../services/db';
import { ROMANIAN_COUNTIES, HOBBIES_LIST } from '../utils/constants';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    city: ROMANIAN_COUNTIES[0],
    eventType: 'public',
    price: '',
    image: null
  });
  
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!getCurrentUser()) {
     navigate('/login');
     return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHobbyToggle = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    try {
      if (selectedHobbies.length === 0) {
        setError('Alege cel puțin o tematică (hobby) pentru evenimentul tău!');
        return;
      }

      const newEvent = createEvent({
        ...formData,
        isPrivate: formData.eventType === 'private',
        isPaid: formData.eventType === 'paid',
        price: formData.eventType === 'paid' ? Number(formData.price) : 0,
        hobbies: selectedHobbies
      });
      
      navigate(`/event/${newEvent.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-center align-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '700px' }}>
        <h2 className="text-center mb-4 text-gradient">Organizează un Eveniment Nou</h2>
        
        {error && <div className="mb-4" style={{ color: 'var(--danger-color)' }}>{error}</div>}
        
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Titlul Evenimentului</label>
            <input type="text" className="form-input" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Ex: Curs de Ceramică" />
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Imagine Eveniment (Opțional)</label>
            <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} style={{ padding: '0.4rem' }} />
            {formData.image && (
               <img src={formData.image} alt="Preview" style={{ marginTop: '10px', height: '150px', borderRadius: '8px', objectFit: 'cover' }} />
            )}
          </div>

          <div className="d-flex gap-4 mb-4 mt-4" style={{ padding: '1rem', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)', flexWrap: 'wrap' }}>
             <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   <input type="radio" name="eventType" value="public" checked={formData.eventType === 'public'} onChange={handleInputChange} />
                   <strong>🌍 Public</strong>
                </label>
                <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Oricine se poate înscrie direct.</p>
             </div>
             <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   <input type="radio" name="eventType" value="private" checked={formData.eventType === 'private'} onChange={handleInputChange} />
                   <strong>🔒 Privat</strong>
                </label>
                <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Aprobare manuală necesară.</p>
             </div>
             <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   <input type="radio" name="eventType" value="paid" checked={formData.eventType === 'paid'} onChange={handleInputChange} />
                   <strong>🎟️ Cu Plată</strong>
                </label>
                <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Intrare pe bază de bilet cumpărat.</p>
             </div>
          </div>
          
          {formData.eventType === 'paid' && (
             <div className="form-group mb-4" style={{ animation: 'fadeIn 0.3s ease' }}>
                <label className="form-label text-gradient" style={{ fontWeight: 'bold' }}>Preț Bilet (RON)</label>
                <input type="number" className="form-input" name="price" value={formData.price} onChange={handleInputChange} required={formData.eventType === 'paid'} placeholder="Ex: 50" min="1" style={{ maxWidth: '200px' }} />
             </div>
          )}

          <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
              <label className="form-label">Data</label>
              <input type="date" className="form-input" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
              <label className="form-label">Ora (HH:MM)</label>
              <input type="time" className="form-input" name="time" value={formData.time} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
             <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Județ</label>
              <select className="form-input" name="city" value={formData.city} onChange={handleInputChange}>
                {ROMANIAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: '2', minWidth: '250px' }}>
              <label className="form-label">Locație Exactă (adresă, stradă)</label>
              <input type="text" className="form-input" name="location" value={formData.location} onChange={handleInputChange} required placeholder="Strada Fericirii, nr. 1" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrierea Evenimentului</label>
            <textarea className="form-input" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Câteva detalii pentru potențialii vizitatori..." style={{ minHeight: "120px" }}/>
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Etichetează Pasiunile Targetate (Hobby-uri)</label>
            <div className="d-flex gap-2" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {HOBBIES_LIST.map(h => (
                <label key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--input-bg)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', border: selectedHobbies.includes(h) ? '2px solid var(--primary-color)' : '1px solid var(--input-border)' }}>
                  <input type="checkbox" checked={selectedHobbies.includes(h)} onChange={() => handleHobbyToggle(h)} style={{ display: 'none' }} />
                  {h}
                </label>
              ))}
            </div>
          </div>
          
          <div className="d-flex justify-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Anulează</button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: "200px" }}>Postează Evenimentul</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
