// Cart Management (localStorage)

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('mealmint_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('mealmint_cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            shopId: item.shopId,
            shopName: item.shopName,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast('Item added to cart!', 'success');
    updateCartBadge();
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    updateCartBadge();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);

    if (item) {
        item.quantity += change;

        // Don't allow quantity below 1
        if (item.quantity < 1) {
            item.quantity = 1;
            return;
        }

        saveCart(cart);
        updateCartBadge();
    }
}

// Clear cart
function clearCart() {
    localStorage.removeItem('mealmint_cart');
    updateCartBadge();
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// Export functions
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
window.updateCartBadge = updateCartBadge;
