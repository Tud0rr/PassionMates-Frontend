// useState — pentru starea locală (date, loading, erori)
// useEffect — pentru a executa cod la montarea componentei (ex: fetch date)
import { useState, useEffect } from 'react';

// Importăm funcția din serviciul nostru
import { getAllEvents } from '../services/eventService';

// Importăm componenta EventCard
import EventCard from '../components/EventCard';

function Dashboard() {

  // State-uri:
  // events = lista de evenimente primite de la backend
  const [events, setEvents] = useState([]);

  // loading = true cât timp așteptăm răspunsul de la server
  const [loading, setLoading] = useState(true);

  // error = mesajul de eroare dacă ceva merge prost
  const [error, setError] = useState(null);

  // searchTerm = textul scris în câmpul de căutare
  const [searchTerm, setSearchTerm] = useState('');

  // selectedCategory = filtrul de categorie selectat
  const [selectedCategory, setSelectedCategory] = useState('Toate');

  // useEffect — se execută DUPĂ ce componenta este randată în DOM
  // Al doilea parametru [] = se execută DOAR o dată (la montarea componentei)
  // Dacă ai pune [searchTerm] s-ar executa de fiecare dată când searchTerm se schimbă
  useEffect(() => {
    // Definim o funcție async înăuntru (nu putem face useEffect async direct)
    const fetchEvents = async () => {
      try {
        setLoading(true); // Pornim loading indicator-ul

        // Așteptăm răspunsul de la backend
        // getAllEvents() returnează un Promise, await îl „despachetează"
        const response = await getAllEvents();

        // response.data = corpul răspunsului HTTP (JSON-ul convertit de axios)
        setEvents(response.data);

      } catch (err) {
        // Dacă backend-ul e oprit sau e o eroare de rețea, ajungem aici
        console.error('Eroare la fetch events:', err);
        setError('Nu am putut conecta la server. Pornește Spring Boot!');
      } finally {
        // finally = se execută ÎNTOTDEAUNA, indiferent de succes/eșec
        setLoading(false);
      }
    };

    fetchEvents(); // Apelăm funcția
  }, []); // Array-ul gol = dependențe (niciuna = rulează doar la montare)

  // Categoriile disponibile pentru filtrare
  const categories = ['Toate', 'Sport', 'Cultură', 'Petrecere', 'Artă', 'Divertisment'];

  // Filtrăm evenimentele pe baza căutării și categoriei selectate
  // .filter() = parcurge array-ul și ține doar elementele care satisfac condiția
  const filteredEvents = events.filter(event => {
    // Condiția de căutare: titlul sau locația conține textul căutat
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
                       || event.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Condiția de categorie: "Toate" înseamnă fără filtru
    const matchesCategory = selectedCategory === 'Toate' 
                          || event.category === selectedCategory;

    // Evenimentul apare DOAR dacă ambele condiții sunt îndeplinite
    return matchesSearch && matchesCategory;
  });

  // --- RANDARE CONDIȚIONATĂ ---
  // React evaluează ce se returnează și randează în DOM

  // Dacă datele se încarcă, afișăm un mesaj de loading
  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Se încarcă evenimentele...</p>
      </div>
    );
  }

  // Dacă a apărut o eroare, o afișăm
  if (error) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.errorBox}>
          <span style={{ fontSize: '48px' }}>⚠️</span>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  // Randarea principală — componenta funcționează normal
  return (
    <div style={styles.page}>

      {/* HEADER / NAVBAR */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🗓️</span>
            <span style={styles.logoText}>EventHub</span>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.loginButton}>Autentificare</button>
            <button style={styles.registerButton}>Înregistrare</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION — titlul principal */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Descoperă Evenimente în <span style={styles.heroAccent}>Orașul Tău</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Alergări, petreceri, cluburi de carte și multe altele — toate într-un singur loc.
        </p>

        {/* Câmpul de căutare */}
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Caută un eveniment sau locație..."
            value={searchTerm}
            // onChange se apelează la fiecare tastă apăsată
            // e.target.value = textul curent din input
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </section>

      {/* CONȚINUTUL PRINCIPAL */}
      <main style={styles.main}>

        {/* Filtrul de categorii */}
        <div style={styles.filterRow}>
          {categories.map(cat => (
            // .map() = parcurge array-ul și creează un element JSX pentru fiecare
            // key = necesar pentru React să identifice elementele din liste
            <button
              key={cat}
              style={{
                ...styles.filterChip,
                // Stil activ pentru categoria selectată
                backgroundColor: selectedCategory === cat ? '#6366f1' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Numărul de rezultate */}
        <p style={styles.resultsCount}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'eveniment găsit' : 'evenimente găsite'}
        </p>

        {/* Grid-ul cu carduri */}
        {filteredEvents.length > 0 ? (
          <div style={styles.grid}>
            {filteredEvents.map(event => (
              // Pasăm fiecare eveniment ca prop către EventCard
              // Componenta EventCard nu știe de unde vin datele, doar le afișează
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          // Dacă nu există rezultate după filtrare
          <div style={styles.emptyState}>
            <span style={{ fontSize: '64px' }}>🔎</span>
            <p style={styles.emptyTitle}>Niciun eveniment găsit</p>
            <p style={styles.emptySubtitle}>Încearcă alte cuvinte cheie sau altă categorie.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  errorText: {
    color: '#64748b',
    fontSize: '16px',
    textAlign: 'center',
  },
  retryButton: {
    padding: '10px 24px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: '-0.5px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  loginButton: {
    padding: '8px 20px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: '#475569',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  registerButton: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  hero: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    padding: '64px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#ffffff',
    maxWidth: '600px',
    lineHeight: '1.2',
    letterSpacing: '-1px',
  },
  heroAccent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '0 8px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.85)',
    maxWidth: '480px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '14px 20px',
    width: '100%',
    maxWidth: '520px',
    gap: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  searchIcon: { fontSize: '18px' },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    color: '#1e293b',
    backgroundColor: 'transparent',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  filterRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resultsCount: {
    color: '#64748b',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    // Coloane responsive: cel puțin 300px, se ajustează automat
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '60px 0',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    color: '#9ca3af',
    fontSize: '15px',
  },
};

export default Dashboard;