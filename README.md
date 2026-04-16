# PassionMates - Platformă pentru Evenimente și Socializare

**Autor:** Tudor Stefan-Ionuț

**Grupa:** C113-B

---

## 1. DESCRIERE GENERALĂ
PassionMates este o aplicație web modernă care facilitează interacțiunea socială și organizarea timpului liber. Proiectul este dedicat pasionaților care doresc să găsească persoane cu interese comune prin participarea sau crearea de evenimente.

## 2. STACK TEHNIC
* **Frontend:** React.js (randare dinamică)
* **Navigare:** React Router
* **Stocare Date:** Sistem de reprezentare ierarhică JSON integrat în `localStorage` (emulează comportamentul unui server real).
* **Interfață:** HTML5 și Vanilla CSS (fundamente web, fără framework-uri de design).

## 3. PORNIRE ȘI ACCES
* **Comandă pornire:** `npm run dev`
* **Aplicația poate permite înregistrarea conturilor noi.**
* **Cont Utilizator (Principal):** `tudor` / `tudor`
* **Cont Administrator:** `admin` / `admin`

## 4. CAPABILITĂȚI MAJORE INTEGRATE
1.  **Sistem de Evenimente (Public/Privat/Cu Plată):** * Public: Permite oricui să se înscrie instantaneu.
    * Privat: Necesită acceptul creatorului pentru înscriere.
    * Cu Plată: Solicită achiziția biletului pre-configurat.
    * Chat dedicat pentru participanții fiecărui eveniment.
2.  **Sistem de Prietenii:** Gestionare Friend Requests (Accept/Reject) și profile publice.
3.  **Căutare Globală (Global Search):** Filtrare directă în Javascript după text și categorii.
4.  **Leaderboard:** Sistem de gamification care sortează utilizatorii după implicarea activă.
5.  **Admin Dashboard:** Moderare conținut (ban/suspendare utilizatori și ștergere evenimente).
6.  **My Favorites:** Salvarea evenimentelor preferate prin marcarea cu "inimioară".

## 5. CONTRIBUȚIA MEA: IMPLEMENTARE "CREARE EVENIMENT"
Contribuția mea principală a vizat întreg fluxul de generare a evenimentelor noi în platformă.

### A. Securitate și Navigare
* **Protecția Rutei:** Am implementat o verificare de securitate la nivel de componentă folosind `getCurrentUser()`. Dacă un utilizator neautorizat încearcă să acceseze `/create-event`, aplicația îl redirecționează automat către pagina de Login.
* **Punct de Acces:** Am integrat butonul "+ Creare Eveniment" în **Navbar.jsx**, utilizând randare condiționată pentru a fi vizibil doar membrilor logați.

### B. Gestionarea Formularului (src/pages/CreateEvent.jsx)
Am dezvoltat un formular care utilizează următoarele tehnici React:
* **State Management:** Utilizarea hook-ului `useState` pentru obiectul `formData`.
* **Procesare Imagini (FileReader API):** Am implementat funcția `handleImageUpload` care permite utilizatorilor să încarce o poză pentru eveniment.
* **Logica de UI Dinamică:**
    * **Radio Buttons custom:** Selector pentru tipul de vizibilitate (Public, Privat, Cu Plată).
    * **Conditional Rendering:** Câmpul pentru "Preț Bilet" apare cu o animație `fadeIn` doar atunci când este selectată opțiunea "Cu Plată".
    * **Sistem de Hobby-uri (Chips):** Utilizatorul poate selecta multiple tematici dintr-o listă predefinită în `constants.js`.

### C. Validare și Backend Local (src/services/db.js)
* **Validare Front-end:** Înainte de trimitere, formularul verifică dacă a fost selectat cel puțin un hobby, afișând mesaje de eroare sugestive într-un panou dedicat.
* **Procesarea Datelor la Submit:** În funcția `handleCreate`, am implementat transformarea datelor de tip "string" din input-uri în tipuri de date corecte pentru baza de date (ex: conversia prețului în `Number`).
* **Integrare DB:** Datele finale sunt pasate funcției `createEvent()`, care:
    1.  Generează un ID unic.
    2.  Asociază automat `creatorId`.
    3.  Salvează obiectul în `localStorage`.

### D. Finalizarea Fluxului (UX)
* După succesul operațiunii, am utilizat `useNavigate` pentru a trimite utilizatorul direct pe pagina noului eveniment creat (`/event/:id`), oferind un feedback imediat.
* Am adăugat și opțiunea de "Anulare" care returnează utilizatorul la pagina principală fără a salva modificările.
---
© 2026 Tudor Stefan - Grupa C113
