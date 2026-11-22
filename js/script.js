// ---------- 1) Product data (edit this list to change the shop) ----------
const products = [
  { id: 1, name: "Classic Tee",      cat: "tops",      price: 15, color: "#c8553d", shape: "tee" },
  { id: 2, name: "Linen Shirt",      cat: "tops",      price: 28, color: "#6b9080", shape: "tee" },
  { id: 3, name: "Everyday Hoodie",  cat: "tops",      price: 40, color: "#3d5a80", shape: "hoodie" },
  { id: 4, name: "Slim Chinos",      cat: "bottoms",   price: 32, color: "#b08968", shape: "pants" },
  { id: 5, name: "Relaxed Jeans",    cat: "bottoms",   price: 36, color: "#4a6fa5", shape: "pants" },
  { id: 6, name: "Light Jacket",     cat: "outerwear", price: 55, color: "#555b6e", shape: "hoodie" },
  { id: 7, name: "Cozy Sweater",     cat: "tops",      price: 34, color: "#e0a458", shape: "hoodie" },
  { id: 8, name: "Jogger Pants",     cat: "bottoms",   price: 26, color: "#2f3e46", shape: "pants" }
];

// ---------- 2) Simple drawn clothes (no image files needed) ----------
function clothesSvg(shape, color) {
  const shapes = {
    tee:    '<path d="M30 12 L8 28 L20 44 L32 38 L32 108 L88 108 L88 38 L100 44 L112 28 L90 12 Q60 30 30 12Z"/>',
    hoodie: '<path d="M32 14 L6 34 L16 56 L30 48 L30 108 L90 108 L90 48 L104 56 L114 34 L88 14 Q60 36 32 14Z"/>',
    pants:  '<path d="M30 8 L90 8 L96 112 L66 112 L60 44 L54 112 L24 112Z"/>'
  };
  return '<svg viewBox="0 0 120 120" fill="' + color + '" aria-hidden="true">' + shapes[shape] + '</svg>';
}

// ---------- 3) Cart (saved in the browser with localStorage) ----------
let cart = JSON.parse(localStorage.getItem("threadly-cart") || "[]");
const $ = (id) => document.getElementById(id);

function saveCart() { localStorage.setItem("threadly-cart", JSON.stringify(cart)); }

function addToCart(id) {
  const found = cart.find((i) => i.id === id);
  if (found) found.qty += 1; else cart.push({ id: id, qty: 1 });
  saveCart(); renderCart(); openCart();
}
function changeQty(id, step) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += step;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart(); renderCart();
}
function removeItem(id) { cart = cart.filter((i) => i.id !== id); saveCart(); renderCart(); }

function renderCart() {
  const box = $("cart-items");
  let total = 0, count = 0;
  if (cart.length === 0) {
    box.innerHTML = '<p class="empty">Your cart is empty.</p>';
  } else {
    box.innerHTML = cart.map((i) => {
      const p = products.find((x) => x.id === i.id);
      total += p.price * i.qty; count += i.qty;
      return '<div class="item">' +
        '<div class="item-img">' + clothesSvg(p.shape, p.color) + '</div>' +
        '<div><div class="item-name">' + p.name + '</div>' +
        '<div class="item-price">$' + p.price + '</div>' +
        '<div class="qty"><button data-act="minus" data-id="' + p.id + '" aria-label="Less">-</button>' +
        '<span>' + i.qty + '</span>' +
        '<button data-act="plus" data-id="' + p.id + '" aria-label="More">+</button></div></div>' +
        '<button class="remove" data-act="remove" data-id="' + p.id + '">Remove</button></div>';
    }).join("");
  }
  $("cart-total").textContent = "$" + total;
  $("cart-count").textContent = count;
}

function openCart()  { $("cart").classList.add("open");  $("overlay").classList.add("open"); }
function closeCart() { $("cart").classList.remove("open"); $("overlay").classList.remove("open"); }

// ---------- 4) Product grid + filters ----------
function renderProducts(cat) {
  const list = cat === "all" ? products : products.filter((p) => p.cat === cat);
  $("products").innerHTML = list.map((p) =>
    '<article class="card">' +
      '<div class="card-img">' + clothesSvg(p.shape, p.color) + '</div>' +
      '<div class="card-body"><span class="card-cat">' + p.cat + '</span>' +
      '<span class="card-name">' + p.name + '</span>' +
      '<span class="card-price">$' + p.price + '</span>' +
      '<button class="btn" data-add="' + p.id + '">Add to cart</button></div>' +
    '</article>'
  ).join("");
}

// ---------- 5) Events ----------
$("products").addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (id) addToCart(Number(id));
});
$("filters").addEventListener("click", (e) => {
  if (!e.target.dataset.cat) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  e.target.classList.add("active");
  renderProducts(e.target.dataset.cat);
});
$("cart-items").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id), act = e.target.dataset.act;
  if (act === "plus") changeQty(id, 1);
  if (act === "minus") changeQty(id, -1);
  if (act === "remove") removeItem(id);
});
$("cart-btn").addEventListener("click", openCart);
$("cart-close").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
$("checkout").addEventListener("click", () => {
  $("cart-note").textContent = cart.length ? "This is a demo shop. No payment was taken." : "Add something first.";
});
$("menu-btn").addEventListener("click", () => $("menu").classList.toggle("open"));
$("menu").addEventListener("click", () => $("menu").classList.remove("open"));
$("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  $("form-msg").textContent = "Thanks, " + $("c-name").value + "! (Demo form: nothing was sent.)";
  e.target.reset();
});

// ---------- 6) Start ----------
$("hero-art").innerHTML = clothesSvg("hoodie", "#c8553d") + clothesSvg("tee", "#3d5a80");
renderProducts("all");
renderCart();
