const alertBox = document.getElementById("alert");
const alertIcon = document.getElementById("alertIcon");
const alertTitle = document.getElementById("alertTitle");
const alertText = document.getElementById("alertText");
const alertButton = document.getElementById("alertButton");

function showAlert(title, message, type = "error") {
  alertTitle.textContent = title;
  alertText.textContent = message;
  alertIcon.textContent = type === "success" ? "✓" : "!";
  alertBox.dataset.type = type;
  alertBox.hidden = false;
  requestAnimationFrame(() => alertBox.classList.add("open"));
  alertButton.focus();
}

function closeAlert() {
  alertBox.classList.remove("open");
  setTimeout(() => {
    alertBox.hidden = true;
  }, 250);
}

alertButton.addEventListener("click", closeAlert);

alertBox.addEventListener("click", (event) => {
  if (event.target === alertBox) {
    closeAlert();
  }
});


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!name || !password) {
    showAlert("Oops!", "Please fill in your name and password.");
    return;
  }

  document.querySelector(".login").hidden = true;
  document.getElementById("welcome").classList.add("show");
  document.getElementById("welcomeText").textContent = `${name}, you are logged in.`;
  showAlert(`Hello, ${name}!`, "You have logged in successfully.", "success");
});


const cart = [];
const cartBox = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function openCart() {
  cartBox.classList.add("open");
  overlay.classList.add("open");
}

function closeCart() {
  cartBox.classList.remove("open");
  overlay.classList.remove("open");
}

function addToCart(name, price) {
  const item = cart.find((product) => product.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  renderCart();
}

function changeQty(name, step) {
  const item = cart.find((product) => product.name === name);
  item.qty += step;

  if (item.qty === 0) {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <b>${item.name}</b>
        <span>$${item.price} × ${item.qty}</span>
      </div>
      <div class="qty">
        <button type="button" data-step="-1">−</button>
        <span>${item.qty}</span>
        <button type="button" data-step="1">+</button>
      </div>
    `;

    li.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => changeQty(item.name, Number(button.dataset.step)));
    });

    cartItems.appendChild(li);
  });

  cartTotal.textContent = `$${total}`;
  cartCount.textContent = count;
  cartEmpty.hidden = cart.length > 0;

  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
}

document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.name, Number(button.dataset.price));

    button.textContent = "Added ✓";
    button.classList.add("added");

    setTimeout(() => {
      button.textContent = "Add to cart";
      button.classList.remove("added");
    }, 1200);
  });
});

document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    showAlert("Cart is empty", "Add a pen to your cart first.");
    return;
  }

  const total = cartTotal.textContent;
  cart.length = 0;
  renderCart();
  closeCart();
  showAlert("Thank you!", `Your order of ${total} has been placed.`, "success");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAlert();
    closeCart();
  }
});
