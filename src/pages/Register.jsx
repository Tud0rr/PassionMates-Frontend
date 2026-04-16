import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/db';
import { ROMANIAN_COUNTIES, HOBBIES_LIST } from '../utils/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    city: ROMANIAN_COUNTIES[0],
    about: ''
  });
  
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHobbyToggle = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      if (selectedHobbies.length === 0) {
        setError('Te rugăm să alegi cel puțin un hobby!');
        return;
      }

      registerUser(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.age,
        formData.city,
        selectedHobbies,
        formData.about // Now passed to db
      );
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-center align-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="text-center mb-4 text-gradient">Înregistrare Cont</h2>
        
        {error && <div className="mb-4" style={{ color: 'var(--danger-color)' }}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Nume</label>
              <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Prenume</label>
              <input type="text" className="form-input" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Parolă</label>
              <input type="password" className="form-input" name="password" value={formData.password} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="d-flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '0.5', minWidth: '100px' }}>
              <label className="form-label">Vârstă</label>
              <input type="number" className="form-input" name="age" min="14" max="100" value={formData.age} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Județ / Oraș</label>
              <select className="form-input" name="city" value={formData.city} onChange={handleInputChange} required>
                {ROMANIAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* New Biography section */}
          <div className="form-group">
             <label className="form-label">Scurtă Descriere (Obligatoriu)</label>
             <textarea 
               className="form-input" 
               name="about" 
               value={formData.about} 
               onChange={handleInputChange} 
               required 
               placeholder="Prezintă-te pe scurt celorlalți membri. Ce te motivează?" 
             />
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Alege-ți Hobby-urile (poți bifa mai multe)</label>
            <div className="d-flex gap-2" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {HOBBIES_LIST.map(h => (
                <label key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--input-bg)', padding: '0.5rem 1rem', borderRadius: '20px', border: selectedHobbies.includes(h) ? '2px solid var(--primary-color)' : '1px solid var(--input-border)' }}>
                  <input type="checkbox" checked={selectedHobbies.includes(h)} onChange={() => handleHobbyToggle(h)} style={{ display: 'none' }} />
                  {h}
                </label>
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }}>Creare Cont</button>
        </form>
        
        <p className="text-center mt-4 text-muted">
          Ai deja cont? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Conectează-te aici</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
