
const books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", price: 499, category: "Programming", icon: "💻" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", price: 299, category: "Fiction", icon: "✨" },
  { id: 3, title: "Java Programming", author: "Herbert Schildt", price: 450, category: "Programming", icon: "☕" },
  { id: 4, title: "Atomic Habits", author: "James Clear", price: 350, category: "Self Help", icon: "🌱" },
  { id: 5, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 275, category: "Self Help", icon: "💰" },
  { id: 6, title: "Data Structures", author: "Seymour Lipschutz", price: 399, category: "Education", icon: "📘" },
  { id: 7, title: "Python Basics", author: "Mark Lutz", price: 420, category: "Programming", icon: "🐍" },
  { id: 8, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 250, category: "Education", icon: "🚀" }
];

let cart = JSON.parse(localStorage.getItem("booknest-cart") || "[]");

function saveCart() {
  localStorage.setItem("booknest-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) {
    count.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  alert("Book added to cart!");
}

function renderBooks() {
  const list = document.getElementById("book-list");
  if (!list) return;

  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  const sort = document.getElementById("sort").value;

  let filtered = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  if (filtered.length === 0) {
    list.innerHTML = "<p>No books found. Try another search.</p>";
    return;
  }

  list.innerHTML = filtered.map(book => `
    <article class="book-card">
      <div class="book-cover">${book.icon}</div>
      <p class="muted">${book.category}</p>
      <h3>${book.title}</h3>
      <p class="author">By ${book.author}</p>
      <p class="price">₹${book.price}</p>
      <button onclick="addToCart(${book.id})">Add to Cart</button>
    </article>
  `).join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty. <a href="index.html">Browse books</a></p>';
    document.getElementById("cart-total").textContent = "₹0";
    return;
  }

  let total = 0;

  container.innerHTML = cart.map(item => {
    const book = books.find(book => book.id === item.id);
    if (!book) return "";

    total += book.price * item.qty;

    return `
      <div class="cart-item">
        <div>
          <h3>${book.icon} ${book.title}</h3>
          <p>₹${book.price} × ${item.qty}</p>
        </div>
        <div>
          <button class="action-btn" onclick="changeQty(${book.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button class="action-btn" onclick="changeQty(${book.id}, 1)">+</button>
          <button class="action-btn" onclick="removeBook(${book.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cart-total").textContent = "₹" + total;
}

function changeQty(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  renderCart();
}

function removeBook(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  ["search", "category", "sort"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.addEventListener("input", renderBooks);
  });

  renderBooks();
  renderCart();

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", event => {
      event.preventDefault();

      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      alert("Demo order placed successfully!");
      cart = [];
      saveCart();
      window.location.href = "index.html";
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      document.getElementById("login-message").textContent =
        "Demo login form submitted. Real authentication is not configured.";
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", event => {
      event.preventDefault();

      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm-password").value;
      const message = document.getElementById("register-message");

      if (password !== confirm) {
        message.textContent = "Passwords do not match.";
        return;
      }

      message.textContent =
        "Demo registration submitted. No account has been saved.";
      registerForm.reset();
    });
  }
});
