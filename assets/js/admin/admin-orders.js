import { auth, db } from '../firebase-config.js';
import { checkAuth } from '../role-guard.js';
import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Auth & Role Check
checkAuth('admin').then(({ user, userData }) => {
    loadOrders();
}).catch(err => {
    console.error('Auth failed:', err);
});

async function loadOrders() {
    const container = document.getElementById('ordersTable');
    // Query all orders ordered by date
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="p-4 text-center text-muted">No orders found.</div>';
            return;
        }

        let html = `
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="ps-4">ID</th>
                        <th>Date</th>
                        <th>Customer & Vendor</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Parallel fetch for vendor names to speed up
        const orders = [];
        querySnapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

        for (const order of orders) {
            const date = new Date(order.createdAt).toLocaleString();
            const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

            // Fetch Vendor Name
            let vendorName = 'Unknown Vendor';
            if (order.restaurantId) {
                try {
                    // Try restaurants collection first
                    const resDoc = await getDoc(doc(db, 'restaurants', order.restaurantId));
                    if (resDoc.exists()) vendorName = resDoc.data().name;
                    else {
                        // Try users if restaurant doc not found
                        const userDoc = await getDoc(doc(db, 'users', order.restaurantId));
                        if (userDoc.exists()) vendorName = userDoc.data().fullName + " (User)";
                    }
                } catch (e) {
                    console.error('Error fetching vendor:', e);
                }
            }

            const badgeClass = {
                'pending': 'bg-warning text-dark',
                'preparing': 'bg-info text-dark',
                'ready': 'bg-primary',
                'on-the-way': 'bg-secondary',
                'delivered': 'bg-success',
                'cancelled': 'bg-danger',
                'rejected': 'bg-danger'
            }[order.status] || 'bg-secondary';

            html += `
                <tr>
                    <td class="ps-4 fw-bold">#${order.id.slice(0, 6)}</td>
                    <td><small>${date}</small></td>
                    <td>
                        <div><i class="fas fa-user-circle"></i> ${order.deliveryAddress?.fullName || 'Guest'}</div>
                        <div class="text-muted small"><i class="fas fa-store"></i> ${vendorName}</div>
                    </td>
                    <td><small>${itemsSummary.slice(0, 50)}${itemsSummary.length > 50 ? '...' : ''}</small></td>
                    <td class="fw-bold">Rs. ${Math.round(order.total)}</td>
                    <td><span class="badge ${badgeClass}">${order.status.toUpperCase()}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                    </td>
                </tr>
            `;
        }

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<div class="p-4 text-center text-danger">Error loading data.</div>';
    }
}

window.viewOrderDetails = (orderId) => {
    // Future: Modal with full details
    Swal.fire({
        title: 'Order Details',
        text: 'Order ID: ' + orderId,
        icon: 'info'
    });
};
