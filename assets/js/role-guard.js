// Role Guard - Protects pages based on user role
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Checks if the user is authenticated and has the required role.
 * @param {string} requiredRole - 'admin', 'vendor', or 'user'
 * @param {boolean} requireVerification - Whether the vendor needs to be verified
 * @returns {Promise<object>} - Resolves with {user, userData}
 */
export async function checkAuth(requiredRole, requireVerification = false) {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // Unsubscribe to avoid multiple triggers
            unsubscribe();

            if (!user) {
                console.warn("No user authenticated. Redirecting to login...");
                redirectToLogin(requiredRole);
                reject('Not authenticated');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (!userDoc.exists()) {
                    console.error("User document not found in Firestore.");
                    await signOut(auth);
                    window.location.href = findRootPath() + 'pages/login.html';
                    reject('User data not found');
                    return;
                }

                const userData = userDoc.data();

                // Check role
                if (userData.role !== requiredRole) {
                    console.error(`Unauthorized access: Required ${requiredRole}, but user is ${userData.role}`);
                    // Instead of full logout, we redirect to their own dashboard or home
                    let redirectPath = findRootPath();
                    if (userData.role === 'admin') redirectPath += 'admin/dashboard.html';
                    else if (userData.role === 'vendor') redirectPath += 'vendor/vendor-dashboard.html';
                    else redirectPath += 'pages/home.html';

                    Swal.fire({
                        title: 'Access Denied',
                        text: `You do not have permission to access this page.`,
                        icon: 'error',
                        confirmButtonText: 'Go to My Dashboard'
                    }).then(() => {
                        window.location.href = redirectPath;
                    });

                    reject('Wrong role');
                    return;
                }

                // Check verification for vendors
                if (requiredRole === 'vendor' && requireVerification && !userData.isVerified) {
                    window.location.href = findRootPath() + 'vendor/vendor-waiting.html';
                    reject('Not verified');
                    return;
                }

                resolve({ user, userData });
            } catch (error) {
                console.error('Error checking auth:', error);
                reject(error);
            }
        });
    });
}

/**
 * Gets the current authenticated user's data.
 */
export async function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (!user) {
                resolve(null);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists()) {
                    resolve(null);
                    return;
                }

                resolve({ user, userData: userDoc.data() });
            } catch (error) {
                reject(error);
            }
        });
    });
}

/**
 * Helper to find the project root path based on current location
 */
function findRootPath() {
    const path = window.location.pathname;
    if (path.includes('/admin/') || path.includes('/vendor/') || path.includes('/pages/')) {
        return '../';
    }
    return './';
}

/**
 * Helper to redirect to correct login page
 */
function redirectToLogin(role) {
    const root = findRootPath();
    if (role === 'admin') window.location.href = root + 'admin/login.html';
    else if (role === 'vendor') window.location.href = root + 'vendor/vendor-login.html';
    else window.location.href = root + 'pages/login.html';
}

// Keep window assignments for non-module scripts if necessary
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
