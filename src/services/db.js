import { ROMANIAN_COUNTIES, HOBBIES_LIST } from '../utils/constants';

export const initDb = () => {
  // Reset database pentru noile cerințe (ștergem datele o singură dată la load)
  if (!localStorage.getItem('db_reset_v5')) {
    localStorage.removeItem('users');
    localStorage.removeItem('events');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('paid_dummy_added');
    localStorage.setItem('db_reset_v5', 'true');
  }

  if (!localStorage.getItem('users')) {
    // Add a dummy creator / admin for events
    const dummyAdmin = {
      id: 999,
      firstName: 'Admin',
      lastName: 'Platformă',
      name: 'Admin Platformă',
      username: 'admin',
      email: 'admin@passionmates.ro',
      password: 'admin',
      role: 'admin',
      status: 'active',
      age: 30,
      city: 'București',
      hobbies: ['Sport', 'Muzică'],
      about: 'Organizator principal și administrator',
      joinedEvents: []
    };

    // Add Tudor User
    const dummyTudor = {
      id: 2,
      firstName: 'Ionuț',
      lastName: 'Tudor',
      name: 'Ionuț Tudor',
      username: 'tudor',
      email: 'tudor@yahoo.com',
      password: 'tudor',
      role: 'user',
      status: 'active',
      age: 22,
      city: 'București',
      hobbies: ['Sport', 'Citit', 'Gaming'],
      about: 'Pasionat de sport, literatură fantasy și esports.',
      joinedEvents: [1, 2, 3, 4, 5]
    };

    localStorage.setItem('users', JSON.stringify([dummyAdmin, dummyTudor]));
  }

  // Initialize events with Tudor's events
  if (!localStorage.getItem('events')) {
    const dummyEvents = [
      {
        id: 1,
        title: 'Alergare în Parcul Carol',
        description: 'Vă invit la o alergare de relaxare (5 km) în aer liber, urmată de o discuție amicală pe iarbă. Nu contează ce ritm aveți, grupul nostru e făcut să fie relaxant, nu competitiv. Haideți să ne bucurăm de natură și de mișcare!',
        date: '2026-05-15',
        time: '09:00',
        location: 'Parcul Carol (Intrarea Principală)',
        city: 'București',
        hobbies: ['Sport'],
        isPrivate: false,
        isPaid: false,
        price: 0,
        image: '/images/carol.jpg',
        creatorId: 2,
        participants: [2],
        pendingParticipants: [],
        chat: []
      },
      {
        id: 2,
        title: 'Club de carte: Game of Thrones 🐉',
        description: 'Sezonul rece e ideal pentru fantasy. Organizăm o întrunire discretă (grup restrâns) pentru cei care abia descoperă saga Cântec de Gheață și Foc (A Song of Ice and Fire). Vom dezbate motivațiile caselor Stark și Lannister la un ceai cald. Eveniment exclusiv privat, necesită o aprobare în prealabil.',
        date: '2026-06-02',
        time: '18:30',
        location: 'Ceainăria Infinitea',
        city: 'București',
        hobbies: ['Citit'],
        isPrivate: true,
        isPaid: false,
        price: 0,
        image: '/images/carte.jpg',
        creatorId: 2,
        participants: [2],
        pendingParticipants: [],
        chat: []
      },
      {
        id: 3,
        title: 'Campionat Gaming: Counter-Strike 2',
        description: 'Organizăm un LAN party / Turneu local de CS2! Căutăm jucători pasionați, fie pentru echipe formate, fie solo (vă alocăm noi într-o echipă). Atmosferă competitivă, calculatoare perfomante și distracție la cote maxime. Avem premii surpriză pentru echipa câștigătoare!',
        date: '2026-06-15',
        time: '12:00',
        location: 'Arena Gaming Club',
        city: 'București',
        hobbies: ['Gaming', 'Tehnologie'],
        isPrivate: false,
        isPaid: false,
        price: 0,
        image: '/images/gaming.jpg',
        creatorId: 2,
        participants: [2],
        pendingParticipants: [],
        chat: []
      },
      {
        id: 4,
        title: '🍷 Degustare de Vinuri Premium',
        description: 'O seară relaxantă dedicată degustării a 5 tipuri de vinuri premium locale. Biletul acoperă toate băuturile și o selecție de brânzeturi fine.',
        date: '2026-07-15',
        time: '19:00',
        location: 'Restaurant Micul Paris',
        city: 'București',
        hobbies: ['Culinare', 'Socializare'],
        isPrivate: false,
        isPaid: true,
        price: 150,
        image: '/images/vin.jpg',
        creatorId: 2,
        participants: [2],
        pendingParticipants: [],
        chat: []
      },
      {
        id: 5,
        title: '⛵ Plimbare de relaxare cu Barca',
        description: 'Bucură-te de briza și liniștea apei într-o plimbare ghidată cu barca. Biletele acoperă costul ambarcațiunii, veste de salvare și un mini-ghid turistic. Aduceți cu voi doar dispoziție bună și aparatul foto!',
        date: '2026-08-10',
        time: '16:00',
        location: 'Parcul Herăstrău, Debarcader central',
        city: 'București',
        hobbies: ['Călătorii', 'Fotografie'],
        isPrivate: false,
        isPaid: true,
        price: 50,
        image: '/images/barca.jpg',
        creatorId: 2,
        participants: [2],
        pendingParticipants: [],
        chat: []
      }
    ];
    localStorage.setItem('events', JSON.stringify(dummyEvents));
  }
};

export const registerUser = (firstName, lastName, email, password, age, city, hobbies, about) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find((u) => u.email === email)) {
    throw new Error('Acest email este deja înregistrat!');
  }

  if (!about || about.trim() === '') {
    throw new Error('Descrierea (Despre mine) este obligatorie!');
  }

  const newUser = {
    id: Date.now(),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email,
    password,
    role: 'user',
    status: 'active',
    age: Number(age),
    city,
    hobbies: hobbies || [],
    about: about,
    joinedEvents: [],
    favoriteEvents: []
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return newUser;
};

export const loginUser = (emailOrUsername, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find((u) =>
    (u.email === emailOrUsername || u.username === emailOrUsername) &&
    u.password === password
  );

  if (!user) {
    throw new Error('Email/Username sau parolă incorecte!');
  }

  if (user.status === 'banned') {
    throw new Error('Acest cont a fost blocat (banat). Nu te poți autentifica.');
  }

  if (user.status === 'deactivated') {
    throw new Error('Acest cont a fost dezactivat de către un administrator.');
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

export const updateUser = (updatedData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex !== -1) {
    const freshUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = freshUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Update current user
    if (localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(freshUser));
    }
    return freshUser;
  }
  return null;
};

export const getEvents = () => {
  return JSON.parse(localStorage.getItem('events')) || [];
};

export const getEventById = (id) => {
  const events = getEvents();
  return events.find((e) => e.id === Number(id));
};

export const joinEvent = (eventId) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Nu ești conectat!");

  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === Number(eventId));

  if (eventIndex !== -1) {
    const event = events[eventIndex];
    const isParticipant = event.participants.includes(user.id);
    const isPending = event.pendingParticipants && event.pendingParticipants.includes(user.id);

    if (isParticipant || isPending) {
      throw new Error("Ești deja înscris sau ai o cerere în așteptare!");
    }

    if (event.isPrivate) {
      if (!event.pendingParticipants) event.pendingParticipants = [];
      event.pendingParticipants.push(user.id);
    } else {
      event.participants.push(user.id);

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        if (!users[userIndex].joinedEvents) users[userIndex].joinedEvents = [];
        users[userIndex].joinedEvents.push(Number(eventId));
        localStorage.setItem('users', JSON.stringify(users));
        if (getCurrentUser() && getCurrentUser().id === user.id) {
          localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
      }
    }

    localStorage.setItem('events', JSON.stringify(events));
    return events[eventIndex];
  }
  return null;
};

export const joinPaidEvent = (eventId) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Nu ești conectat!");

  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === Number(eventId));

  if (eventIndex !== -1) {
    const event = events[eventIndex];
    if (event.participants.includes(user.id)) throw new Error("Ești deja înscris!");

    // Adăugare directă (bypass cerere) deoarece utilizatorul a plătit
    event.participants.push(user.id);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      if (!users[userIndex].joinedEvents) users[userIndex].joinedEvents = [];
      users[userIndex].joinedEvents.push(Number(eventId));
      localStorage.setItem('users', JSON.stringify(users));
      if (getCurrentUser() && getCurrentUser().id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      }
    }

    localStorage.setItem('events', JSON.stringify(events));
    return events[eventIndex];
  }
  return null;
};

export const approveParticipant = (eventId, userIdToApprove) => {
  const currentUser = getCurrentUser();
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === Number(eventId));

  if (eventIndex !== -1) {
    const event = events[eventIndex];
    if (event.creatorId !== currentUser.id) {
      throw new Error("Nu ai permisiuni!");
    }

    if (event.pendingParticipants) {
      event.pendingParticipants = event.pendingParticipants.filter(id => id !== userIdToApprove);
      if (!event.participants.includes(userIdToApprove)) {
        event.participants.push(userIdToApprove);

        // Update the approved user's joined events too
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === userIdToApprove);
        if (userIndex !== -1) {
          if (!users[userIndex].joinedEvents) users[userIndex].joinedEvents = [];
          if (!users[userIndex].joinedEvents.includes(Number(eventId))) {
            users[userIndex].joinedEvents.push(Number(eventId));
            localStorage.setItem('users', JSON.stringify(users));
            if (getCurrentUser() && getCurrentUser().id === userIdToApprove) {
              localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            }
          }
        }
      }
      localStorage.setItem('events', JSON.stringify(events));
    }
    return events[eventIndex];
  }
};

export const rejectParticipant = (eventId, userIdToReject) => {
  const currentUser = getCurrentUser();
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === Number(eventId));

  if (eventIndex !== -1) {
    const event = events[eventIndex];
    if (event.creatorId !== currentUser.id) {
      throw new Error("Nu ai permisiuni!");
    }

    if (event.pendingParticipants) {
      event.pendingParticipants = event.pendingParticipants.filter(id => id !== userIdToReject);
      localStorage.setItem('events', JSON.stringify(events));
    }
    return events[eventIndex];
  }
};

// Chat 
export const sendMessage = (eventId, text) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Trebuie să fii conectat!");

  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === Number(eventId));

  if (eventIndex !== -1) {
    const event = events[eventIndex];
    if (!event.participants.includes(user.id)) {
      throw new Error("Trebuie să faci parte din eveniment pentru a trimite mesaje.");
    }

    if (!event.chat) event.chat = [];

    const newMessage = {
      id: Date.now() + Math.random(),
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      text,
      timestamp: new Date().toISOString()
    };

    event.chat.push(newMessage);
    localStorage.setItem('events', JSON.stringify(events));
    return event;
  }
};

export const createEvent = (eventData) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Nu ești conectat pentru a crea un eveniment!");

  const events = getEvents();
  const newEvent = {
    id: Date.now(),
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    city: eventData.city,
    hobbies: eventData.hobbies || [],
    isPrivate: eventData.isPrivate || false,
    isPaid: eventData.isPaid || false,
    price: Number(eventData.price) || 0,
    image: eventData.image || null,
    creatorId: user.id,
    participants: [user.id],
    pendingParticipants: [],
    chat: []
  };

  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id === user.id);

  if (userIndex !== -1) {
    if (!users[userIndex].joinedEvents) users[userIndex].joinedEvents = [];
    users[userIndex].joinedEvents.push(newEvent.id);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
  }

  return newEvent;
};

export const getUserBasicInfo = (userId) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.id === userId);
  return user ? { id: user.id, name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email } : null;
};

export const getUserById = (userId) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.find(u => u.id === Number(userId));
};

export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
};

export const banUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id === Number(userId));
  if (userIndex !== -1) {
    users[userIndex].status = 'banned';
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const deactivateUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id === Number(userId));
  if (userIndex !== -1) {
    users[userIndex].status = 'deactivated';
    localStorage.setItem('users', JSON.stringify(users));
  }
};

// --- Friends & Direct Messaging ---

export const sendFriendRequest = (targetUserId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Nu ești conectat!");

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const targetUserIndex = users.findIndex(u => u.id === Number(targetUserId));

  if (targetUserIndex !== -1) {
    if (!users[targetUserIndex].friendRequests) users[targetUserIndex].friendRequests = [];
    if (!users[targetUserIndex].friendRequests.includes(currentUser.id)) {
      users[targetUserIndex].friendRequests.push(currentUser.id);
      localStorage.setItem('users', JSON.stringify(users));
    }
    return true;
  }
  return false;
};

export const acceptFriendRequest = (requesterId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Nu ești conectat!");

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currIndex = users.findIndex(u => u.id === currentUser.id);
  const reqIndex = users.findIndex(u => u.id === Number(requesterId));

  if (currIndex !== -1 && reqIndex !== -1) {
    if (!users[currIndex].friends) users[currIndex].friends = [];
    if (!users[reqIndex].friends) users[reqIndex].friends = [];
    if (!users[currIndex].friendRequests) users[currIndex].friendRequests = [];

    users[currIndex].friendRequests = users[currIndex].friendRequests.filter(id => id !== Number(requesterId));

    if (!users[currIndex].friends.includes(Number(requesterId))) {
      users[currIndex].friends.push(Number(requesterId));
    }
    if (!users[reqIndex].friends.includes(currentUser.id)) {
      users[reqIndex].friends.push(currentUser.id);
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[currIndex]));
    return true;
  }
  return false;
};

export const rejectFriendRequest = (requesterId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Nu ești conectat!");

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currIndex = users.findIndex(u => u.id === currentUser.id);

  if (currIndex !== -1) {
    if (!users[currIndex].friendRequests) users[currIndex].friendRequests = [];
    users[currIndex].friendRequests = users[currIndex].friendRequests.filter(id => id !== Number(requesterId));

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[currIndex]));
    return true;
  }
  return false;
};

export const removeFriend = (friendId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Nu ești conectat!");

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currIndex = users.findIndex(u => u.id === currentUser.id);
  const frIndex = users.findIndex(u => u.id === Number(friendId));

  if (currIndex !== -1 && frIndex !== -1) {
    if (users[currIndex].friends) {
      users[currIndex].friends = users[currIndex].friends.filter(id => id !== Number(friendId));
    }
    if (users[frIndex].friends) {
      users[frIndex].friends = users[frIndex].friends.filter(id => id !== currentUser.id);
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[currIndex]));
    return true;
  }
  return false;
};

export const getDirectMessages = (friendId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const chats = JSON.parse(localStorage.getItem('chats')) || {};
  const chatId = [currentUser.id, Number(friendId)].sort().join('_');
  return chats[chatId] || [];
};

export const sendDirectMessage = (friendId, text) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Nu ești conectat!");

  const chats = JSON.parse(localStorage.getItem('chats')) || {};
  const chatId = [currentUser.id, Number(friendId)].sort().join('_');

  if (!chats[chatId]) chats[chatId] = [];

  const newMessage = {
    id: Date.now() + Math.random(),
    senderId: currentUser.id,
    text,
    timestamp: new Date().toISOString()
  };

  chats[chatId].push(newMessage);
  localStorage.setItem('chats', JSON.stringify(chats));
  return newMessage;
};

export const toggleFavoriteEvent = (eventId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Trebuie să fii conectat!");

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex !== -1) {
    if (!users[userIndex].favoriteEvents) users[userIndex].favoriteEvents = [];
    
    const isFavorite = users[userIndex].favoriteEvents.includes(Number(eventId));
    if (isFavorite) {
      users[userIndex].favoriteEvents = users[userIndex].favoriteEvents.filter(id => id !== Number(eventId));
    } else {
      users[userIndex].favoriteEvents.push(Number(eventId));
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user in storage
    const freshUser = { ...users[userIndex] };
    localStorage.setItem('currentUser', JSON.stringify(freshUser));
    return !isFavorite;
  }
  return false;
};

export const deleteEvent = (eventId) => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error("Nu ai permisiuni de administrator pentru a șterge un eveniment!");
  }
  
  let events = getEvents();
  events = events.filter(e => e.id !== Number(eventId));
  localStorage.setItem('events', JSON.stringify(events));
  
  return true;
};
