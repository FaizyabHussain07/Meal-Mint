import { auth, db } from '../firebase-config.js';
import { checkAuth } from '../role-guard.js';
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Auth & Role Check
checkAuth('admin').then(({ user, userData }) => {
    loadVendors();
}).catch(err => {
    console.error('Auth failed:', err);
});

async function loadVendors() {
    const container = document.getElementById('vendorsTable');
    const q = query(collection(db, "users"), where("role", "==", "vendor"));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="p-4 text-center text-muted">No vendors found.</div>';
            return;
        }

        let html = `
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="ps-4">Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        querySnapshot.forEach(doc => {
            const vendor = doc.data();
            const isPending = !vendor.isVerified;
            const statusBadge = vendor.isVerified
                ? '<span class="badge bg-success">Active</span>'
                : '<span class="badge bg-warning text-dark">Pending</span>';

            const date = vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : '-';

            let actions = '';
            if (isPending) {
                actions = `
                    <button class="btn btn-sm btn-success me-2" onclick="approveVendor('${doc.id}')">Approve</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectVendor('${doc.id}')">Reject</button>
                `;
            } else {
                actions = `<button class="btn btn-sm btn-outline-secondary" disabled>Verified</button>`;
            }

            html += `
                <tr>
                    <td class="ps-4 fw-bold">${vendor.fullName}</td>
                    <td>${vendor.email}</td>
                    <td>${vendor.phone || '-'}</td>
                    <td>${statusBadge}</td>
                    <td>${date}</td>
                    <td>${actions}</td>
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

window.approveVendor = async (uid) => {
    try {
        // Update User
        await updateDoc(doc(db, "users", uid), { isVerified: true });

        // Update Restaurant
        try {
            await updateDoc(doc(db, "restaurants", uid), { isActive: true });
        } catch (e) {
            console.error("Failed to activate restaurant:", e);
            Swal.fire('Warning', 'Vendor verified, but failed to activate restaurant.', 'warning');
            return;
        }

        Swal.fire('Approved', 'Vendor has been approved.', 'success');
        loadVendors(); // Refresh the list
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
};

window.rejectVendor = async (uid) => {
    if (await Swal.fire({ title: 'Reject Vendor?', text: 'This action cannot be undone immediately.', icon: 'warning', showCancelButton: true }).then(r => r.isConfirmed)) {
        Swal.fire('Rejected', 'Vendor rejection logic pending implementation', 'info');
    }
};
