========================================================================
PasiuneMates - Platformă pentru Evenimente și Socializare
**Autor:** Tudor Stefan  
**Grupa:** C113
========================================================================

1. DESCRIERE GENERALĂ
---------------------
PassionMates este o aplicație web modernă care facilitează interacțiunea 
socială și organizarea timpului liber. Proiectul este dedicat pasionaților 
care doresc să găsească persoane cu interese comune prin participarea 
sau crearea de evenimente.

2. STACK TEHNIC
---------------
- Frontend: React.js (randare dinamică)
- Navigare: React Router
- Stocare Date: Sistem de reprezentare ierarhică JSON integrat în 
  localStorage (emulează comportamentul unui server real).
- Interfață: HTML5 și Vanilla CSS (fundamente web, fără framework-uri de design).

3. PORNIRE ȘI ACCES
-------------------
- Comandă pornire: npm run dev
- Cont Utilizator (Principal): tudor / tudor
- Cont Administrator: admin / admin

4. CAPABILITĂȚI MAJORE INTEGRATE
--------------------------------
- Sistem de Evenimente (Public/Privat/Cu Plată): 
  * Public: Permite oricui să se înscrie instantaneu.
  * Privat: Necesită acceptul creatorului pentru înscriere.
  * Cu Plată: Adaugă o ramură logică extra, solicitând achiziția biletului.
  * Chat dedicat pentru participanții fiecărui eveniment.
- Sistem de Prietenii: Gestionare Friend Requests (Accept/Reject) și profile publice.
- Căutare Globală (Global Search): Filtrare directă în Javascript după text 
  (match pe litere) și categorii (evenimente sau persoane).
- Leaderboard: Sistem de gamification care sortează utilizatorii algoritmic 
  în funcție de implicarea activă în evenimente.
- Admin Dashboard: Zonă centralizată pentru admin ("admin"/"admin") cu 
  putere de moderare (suspendare/ban utilizatori și ștergere evenimente).
- My Favorites: Sistem de salvare a evenimentelor preferate prin marcarea 
  simbolului "inimioară".

5. DETALII TEHNICE: IMPLEMENTARE "CREARE EVENIMENT"
---------------------------------------------------
Contribuția mea principală a vizat întreg fluxul de generare a conținutului 
nou în platformă, de la punctul de intrare în UI până la persistența datelor.

A. Arhitectură și Rute:
- În fișierul App.jsx, am definit ruta path="/create-event" pentru a mapa 
  componenta paginii de creare.
- În src/components/Navbar.jsx, am integrat butonul "+ Creare Eveniment". 
  Acesta include o logică de afișare condiționată (butonul este vizibil 
  doar pentru utilizatorii autentificați).

B. Interfața și Logica de Formular (src/pages/CreateEvent.jsx):
- Am construit un formular complex gestionat integral prin instanțe de 
  useState pentru a menține controlul asupra datelor introduse.
- Elemente integrate:
  * Radio buttons pentru tipul de eveniment (Public, Privat, Cu Plată).
  * Rendering condiționat: Bifarea opțiunii "Cu Plată" declanșează 
    apariția unui input numeric suplimentar pentru "Prețul biletului".
  * Input-uri HTML predefinite (type="date" și type="time").
  * Meniu <select> populat dinamic dintr-un array de orașe/județe 
    importat din constants.js.
  * Textarea pentru Bio/Detalii și un container de selecție pentru 
    pasiuni (Hobby-uri). Acestea sunt redate printr-un .map() din lista 
    de constante și, deși funcționează ca checkbox-uri în spate, sunt 
    stilizate vizual sub formă de "pastile" (chips).

C. Backend-ul Local și Persistența (src/services/db.js):
- La evenimentul de Submit, datele sunt colectate și trimise către funcția 
  createEvent(formData) pe care am scris-o în panoul de backend local.
- Funcția realizează următoarele:
  1. Generează un ID unic pentru eveniment.
  2. Alocă automat ID-ul utilizatorului curent ca și 'creatorId'.
  3. Inserează obiectul în array-ul central din LocalStorage.

D. Sincronizarea UI:
- După trimitere, am folosit hook-ul navigate('/') pentru a redirecționa 
  utilizatorul pe pagina Home.jsx.
- Am configurat Home.jsx astfel încât, la fiecare montare, un hook 
  useEffect să apeleze getEvents(), asigurând afișarea instantanee 
  a noului eveniment pe ecran direct din memorie.

========================================================================