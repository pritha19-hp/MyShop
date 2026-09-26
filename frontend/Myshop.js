// Default Sample Data
let products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 50, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
  { id: 2, name: "Casual T-Shirt", category: "Clothing", price: 20, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300" },
  { id: 3, name: "JavaScript Beginner Guide", category: "Books", price: 15, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300" }
];

let currentUser = null; // { username: "...", role: "user" | "admin" }
let cart = [];
let orders = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

// Section Switcher
function showSection(sectionId) {
  document.getElementById("productsSection").style.display = "none";
  document.getElementById("cartSection").style.display = "none";
  document.getElementById("ordersSection").style.display = "none";
  document.getElementById("adminSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";

  document.getElementById(sectionId).style.display = "block";

  if (sectionId === 'ordersSection') renderUserOrders();
  if (sectionId === 'adminSection') renderAdminOrders();
}

// 1. User Login
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("usernameInput").value;
  const role = document.getElementById("userRole").value;

  currentUser = { username: username, role: role };

  document.getElementById("userInfo").textContent = `Logged in as: ${username} (${role})`;
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline-block";

  if (role === "admin") {
    document.getElementById("adminBtn").style.display = "inline-block";
    showSection("adminSection");
  } else {
    document.getElementById("adminBtn").style.display = "none";
    showSection("productsSection");
  }
}

function logout() {
  currentUser = null;
  document.getElementById("userInfo").textContent = "Not logged in";
  document.getElementById("loginBtn").style.display = "inline-block";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("adminBtn").style.display = "none";
  showSection("productsSection");
}

// 2. Load and Display Products
function loadProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categorySelect").value;
  const grid = document.getElementById("productGrid");

  grid.innerHTML = "";

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search);
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>Category: ${product.category}</p>
      <p><b>Price: $${product.price}</b></p>
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// 3. Cart & Checkout
function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  cart.push(prod);
  updateCartUI();
  alert(`${prod.name} added to your cart!`);
}

function updateCartUI() {
  document.getElementById("cartCount").textContent = cart.length;
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    container.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - $${item.price}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  document.getElementById("cartTotal").textContent = `Total: $${total}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function handleCheckout(event) {
  event.preventDefault();
  if (!currentUser) {
    alert("Please login first to place an order!");
    showSection("loginSection");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const address = document.getElementById("addressInput").value;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const newOrder = {
    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    user: currentUser.username,
    items: [...cart],
    total: total,
    address: address,
    status: "Pending" // Pending -> Shipped -> Delivered
  };

  orders.push(newOrder);
  cart = [];
  updateCartUI();

  alert(`Order ${newOrder.id} placed successfully!`);
  showSection("ordersSection");
}

// 4. User Order Tracking
function renderUserOrders() {
  const container = document.getElementById("userOrdersList");
  container.innerHTML = "";

  if (!currentUser) {
    container.innerHTML = "<p>Please login to view your orders.</p>";
    return;
  }

  const userOrders = orders.filter(o => o.user === currentUser.username);

  if (userOrders.length === 0) {
    container.innerHTML = "<p>You have not placed any orders yet.</p>";
    return;
  }

  userOrders.forEach(order => {
    container.innerHTML += `
      <div class="order-item">
        <div>
          <b>Order #${order.id}</b> - Total: $${order.total}<br>
          <small>Address: ${order.address}</small>
        </div>
        <span class="status-tag status-${order.status}">${order.status}</span>
      </div>
    `;
  });
}

// 5. Admin Panel (Add Product & Manage Order Status)
function handleAddProduct(event) {
  event.preventDefault();
  const name = document.getElementById("newProdName").value;
  const category = document.getElementById("newProdCategory").value;
  const price = parseFloat(document.getElementById("newProdPrice").value);
  const image = document.getElementById("newProdImg").value || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300";

  const newProd = { id: Date.now(), name, category, price, image };
  products.push(newProd);

  alert("New product added successfully!");
  loadProducts();
  showSection("productsSection");
}

function renderAdminOrders() {
  const container = document.getElementById("adminOrdersList");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No customer orders placed yet.</p>";
    return;
  }

  orders.forEach(order => {
    container.innerHTML += `
      <div class="order-item">
        <div>
          <b>Order #${order.id}</b> by <i>${order.user}</i> - $${order.total}<br>
          <small>Status: ${order.status}</small>
        </div>
        <div>
          <button class="btn" onclick="changeOrderStatus('${order.id}', 'Shipped')">Mark Shipped</button>
          <button class="btn btn-success" onclick="changeOrderStatus('${order.id}', 'Delivered')">Mark Delivered</button>
        </div>
      </div>
    `;
  });
}

function changeOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    renderAdminOrders();
    alert(`Order ${orderId} updated to ${newStatus}`);
  }
}