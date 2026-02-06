import { auth, db } from '../firebase-config.js';
import { checkAuth } from '../role-guard.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Auth & Role Check
checkAuth('admin').then(({ user, userData }) => {
    loadUsers();
}).catch(err => {
    console.error('Auth failed:', err);
});

async function loadUsers() {
    const container = document.getElementById('usersTable');
    const q = query(collection(db, "users"), where("role", "==", "user"));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="p-4 text-center text-muted">No users found.</div>';
            return;
        }

        let html = `
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="ps-4">Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
        `;

        querySnapshot.forEach(doc => {
            const user = doc.data();
            const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-';

            html += `
                <tr>
                    <td class="ps-4 fw-bold">${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || '-'}</td>
                    <td>${date}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<div class="p-4 text-center text-danger">Error loading data.</div>';
    }
}
