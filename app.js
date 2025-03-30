// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDL87SIF7z1QQR7U1-5yw5CzHQrqMiylHI",
    authDomain: "chat-app-2431d.firebaseapp.com",
    projectId: "chat-app-2431d",
    storageBucket: "chat-app-2431d.firebasestorage.app",
    messagingSenderId: "145232547210",
    appId: "1:145232547210:web:c1daeaaea20e9b6a3e0c73",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const signOutBtn = document.getElementById("signOutBtn");

    auth.onAuthStateChanged(user => {
        if (!user) {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider);
        }
    });

    sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message) {
            db.collection("messages").add({
                text: message,
                user: auth.currentUser.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            messageInput.value = "";
        }
    });

    signOutBtn.addEventListener("click", () => {
        auth.signOut();
    });

    db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
        chatBox.innerHTML = "";
        snapshot.forEach(doc => {
            const msg = doc.data();
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message");
            msgDiv.textContent = `${msg.user}: ${msg.text}`;
            chatBox.appendChild(msgDiv);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
