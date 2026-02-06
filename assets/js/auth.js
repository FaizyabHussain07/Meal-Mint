import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Global Loader Helpers
window.hideLoader = () => {
    const loader = document.getElementById('loader-wrapper');
    if (loader) loader.style.display = 'none';
};

window.showLoader = () => {
    const loader = document.getElementById('loader-wrapper');
    if (loader) loader.style.display = 'flex';
};

// Vendor Login Logic
export async function vendorLogin(email, password) {
    showLoader();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Verify Role
        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'vendor') {
                if (userData.isVerified) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Welcome back!',
                        text: 'Redirecting to dashboard...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'vendor-dashboard.html';
                    });
                } else {
                    window.location.href = 'vendor-waiting.html';
                }
            } else {
                throw new Error("Access Denied: Not a vendor account.");
            }
        } else {
            throw new Error("User profile not found.");
        }
    } catch (error) {
        console.error(error);
        hideLoader();
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message
        });
        await signOut(auth);
    }
}

// Vendor Signup Logic
export async function vendorSignup(data) {
    showLoader();
    try {
        // Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const uid = userCredential.user.uid;

        // Update Profile
        await updateProfile(userCredential.user, { displayName: data.ownerName });

        // Create User Doc
        await setDoc(doc(db, "users", uid), {
            fullName: data.ownerName,
            email: data.email,
            phone: data.phone,
            role: 'vendor',
            isVerified: false,
            restaurantId: uid,
            createdAt: new Date().toISOString()
        });

        // Create Restaurant Doc
        await setDoc(doc(db, "restaurants", uid), {
            name: data.restaurantName,
            ownerId: uid,
            cuisine: data.cuisine,
            phone: data.phone,
            rating: 0,
            isActive: false,
            image: 'https://placehold.co/600x400?text=Restaurant+Image'
        });

        hideLoader();
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created and is pending approval.',
            confirmButtonColor: '#16a34a'
        }).then(() => {
            window.location.href = 'vendor-waiting.html';
        });

    } catch (error) {
        hideLoader();
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message
        });
    }
}

// Expose functions to window if needed for inline onclick (though module usage is preferred)
// Customer Signup Logic
export async function userSignup(email, password, name, phone, address) {
    showLoader();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await updateProfile(userCredential.user, { displayName: name });

        await setDoc(doc(db, "users", uid), {
            fullName: name,
            email: email,
            phone: phone,
            address: address,
            role: 'user', // Explicitly set role
            walletBalance: 1000, // Free joining bonus
            totalSpent: 0,
            createdAt: new Date().toISOString()
        });

        hideLoader();
        Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'Redirecting to home...',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'home.html';
        });

    } catch (error) {
        hideLoader();
        console.error(error);
        Swal.fire('Signup Failed', error.message, 'error');
    }
}

// Customer Login Logic
export async function userLogin(email, password) {
    showLoader();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Verify Role
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
                window.location.href = '../admin/dashboard.html';
            } else if (userData.role === 'vendor') {
                window.location.href = '../vendor/vendor-dashboard.html';
            } else {
                window.location.href = 'home.html';
            }
        } else {
            // New user or missing doc? (shouldn't happen with correct signup flow)
            window.location.href = 'home.html';
        }
    } catch (error) {
        hideLoader();
        Swal.fire('Login Failed', error.message, 'error');
        await signOut(auth);
    }
}

// Expose functions to window
window.vendorLogin = vendorLogin;
window.vendorSignup = vendorSignup;
window.userSignup = userSignup;
window.userLogin = userLogin;
