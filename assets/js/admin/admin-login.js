import { auth, db } from '../firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Check if user is admin
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

        if (userDoc.exists() && userDoc.data().role === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            Swal.fire('Access Denied', 'You do not have admin privileges.', 'error');
            auth.signOut();
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
});
