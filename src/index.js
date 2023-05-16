import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, getDoc, updateDoc,
    query, where, orderBy,
    serverTimestamp
} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBBTDCyuEMrE3r7Q82ssjXRCWa2R6ZHK6E",
    authDomain: "fir-9-dojo-f28d1.firebaseapp.com",
    projectId: "fir-9-dojo-f28d1",
    storageBucket: "fir-9-dojo-f28d1.appspot.com",
    messagingSenderId: "74368409706",
    appId: "1:74368409706:web:4d17e7da2c899d9d992a13"
};

// init firebase app
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore(app);
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

// queries
const q = query(colRef, orderBy('createdAt'));

// realtime collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    });
    console.log(books);
});

// adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    }).then(() => {
        addBookForm.reset();
    });
});

// deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', deleteBookForm.id.value);
    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset();
        });
});

// updating documents
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const docRef = doc(db, 'books', updateBookForm.id.value);
    updateDoc(docRef, {
        title: 'updated title',
        author: 'updated author'
    }).then(() => {
        updateBookForm.reset();
    });
});

// fetching a single document (& realtime)
const docRef = doc(db, 'books', 'Xk2YuB8bWkvhg0iFcSwm');
const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
            // console.log('user created: ', cred.user);
            signupForm.reset();
        })
        .catch(err => {
            console.log(err.message)
        });
});

// Logging in and out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // console.log('user signed out')
        })
        .catch((err) => {
            console.log(err.message)
        })
});

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
            // console.log('user logged in:', cred.user)
            loginForm.reset()
        })
        .catch(err => {
            console.log(err.message)
        })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubAuth()
    unsubCol()
    unsubDoc()
})