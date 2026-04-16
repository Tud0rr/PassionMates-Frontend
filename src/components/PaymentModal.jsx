import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, onSuccess, price, eventName }) => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cardNumber') {
       value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
       if (value.length > 19) return;
    }
    
    if (name === 'expiry') {
       value = value.replace(/\D/g, '');
       if (value.length > 4) return;
       if (value.length >= 2) {
          value = value.slice(0,2) + '/' + value.slice(2);
       }
    }
    
    // CVV - doar cifre
    if (name === 'cvv') {
       value = value.replace(/\D/g, '');
       if (value.length > 3) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!formData.name || formData.cardNumber.length < 19 || formData.expiry.length < 5 || formData.cvv.length < 3) {
       setError('Te rugăm să completezi toate datele corect.');
       return;
    }

    setError('');
    setIsProcessing(true);

    // Simulăm o procesare gateway autentică care durează 1.5s
    setTimeout(() => {
       setIsProcessing(false);
       onSuccess();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(8px)'
    }}>
       <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', position: 'relative', background: 'var(--bg-secondary)', borderRadius: '20px', padding: '2rem' }}>
          <button 
             onClick={onClose} 
             style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', outline: 'none' }}
          >
             ×
          </button>
          
          <h2 className="mb-2" style={{ color: 'var(--primary-color)' }}>Finalizare Plată</h2>
          <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Cumperi bilet pentru: <strong>{eventName}</strong></p>

          <form onSubmit={handlePay}>
             {error && <div className="mb-3" style={{ color: '#ff4757', background: 'rgba(255, 71, 87, 0.1)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}>{error}</div>}
             
             <div className="form-group mb-3">
                <label className="form-label text-sm text-muted">Nume pe Card</label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: ION POPESCU" required style={{ background: 'var(--bg-primary)' }} />
             </div>

             <div className="form-group mb-3">
                <label className="form-label text-sm text-muted">Număr Card</label>
                <div style={{ position: 'relative' }}>
                    <input type="text" className="form-input" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" required style={{ letterSpacing: '2px', fontFamily: 'monospace', background: 'var(--bg-primary)', paddingRight: '40px' }} />
                    <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>💳</span>
                </div>
             </div>

             <div className="d-flex gap-3 mb-4">
                <div className="form-group m-0" style={{ flex: 1 }}>
                   <label className="form-label text-sm text-muted">Data Expirare</label>
                   <input type="text" className="form-input" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="LL/AA" required style={{ textAlign: 'center', background: 'var(--bg-primary)' }} />
                </div>
                <div className="form-group m-0" style={{ flex: 1 }}>
                   <label className="form-label text-sm text-muted">CVV / CVC</label>
                   <input type="text" className="form-input" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" required style={{ textAlign: 'center', background: 'var(--bg-primary)' }} />
                </div>
             </div>

             <div className="d-flex justify-between align-center" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total de plată</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{price} <span style={{fontSize: '1rem', color: 'var(--primary-color)'}}>RON</span></span>
                 </div>
                 <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)' }}>
                    {isProcessing ? 'Se procesează...' : 'Confirma 🔒'}
                 </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export default PaymentModal;
