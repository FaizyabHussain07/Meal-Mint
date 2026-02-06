import { auth, db } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, getDocs, doc, updateDoc, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { checkAuth } from '../role-guard.js';

// Auth & Role Check
checkAuth('admin').then(({ user, userData }) => {
    loadStats();
    loadPendingVendors();
}).catch(err => {
    console.error('Auth failed:', err);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = 'login.html');
});

async function loadStats() {
    try {
        // Total Users (role == user)
        const usersColl = collection(db, "users");
        const qUsers = query(usersColl, where("role", "==", "user"));
        const snapUsers = await getCountFromServer(qUsers);
        document.getElementById('totalUsers').innerText = snapUsers.data().count;

        // Active Vendors (role == vendor && isVerified == true)
        const qVendors = query(usersColl, where("role", "==", "vendor"), where("isVerified", "==", true));
        const snapVendors = await getCountFromServer(qVendors);
        document.getElementById('totalVendors').innerText = snapVendors.data().count;

        // Total Orders
        const ordersColl = collection(db, "orders");
        const snapOrders = await getCountFromServer(ordersColl);
        document.getElementById('totalOrders').innerText = snapOrders.data().count;

    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

async function loadPendingVendors() {
    const container = document.getElementById('pendingVendors');
    const q = query(collection(db, "users"), where("role", "==", "vendor"), where("isVerified", "==", false));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="p-4 text-center text-muted">No pending approvals.</div>';
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Owner Name</th>
                            <th>Email</th>
                            <th>Registered Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        querySnapshot.forEach(doc => {
            const vendor = doc.data();
            const date = vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A';

            html += `
                <tr>
                    <td class="ps-4 fw-bold">${vendor.fullName}</td>
                    <td>${vendor.email}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-sm btn-success me-2" onclick="approveVendor('${doc.id}')">Approve</button>
                        <button class="btn btn-sm btn-danger" onclick="rejectVendor('${doc.id}')">Reject</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

    } catch (error) {
        console.error("Error loading vendors:", error);
        container.innerHTML = '<div class="p-4 text-center text-danger">Error loading data.</div>';
    }
}

window.approveVendor = async (uid) => {
    try {
        // Update User
        await updateDoc(doc(db, "users", uid), { isVerified: true });

        // Update Restaurant
        try {
            await updateDoc(doc(db, "restaurants", uid), { isActive: true });
        } catch (e) {
            console.error("Failed to activate restaurant:", e);
            Swal.fire('Warning', 'Vendor verified, but failed to activate restaurant. Check permissions.', 'warning');
            return;
        }

        Swal.fire('Approved', 'Vendor has been approved and shop is active.', 'success');
        loadPendingVendors();
        loadStats();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to approve vendor: ' + error.message, 'error');
    }
};

window.rejectVendor = async (uid) => {
    Swal.fire('Rejected', 'Vendor has been rejected (Implementation pending)', 'info');
};
