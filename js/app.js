/* ========================================================================== 
   JS/APP.JS - SISTEMA DE CARRITO, FILTROS Y ENLACE AUTOMÁTICO DE PEDIDOS
   ========================================================================== */

const products = [
    { id: 1, name: "Cheddar Boom Burger", price: 4.50, category: "burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Clásica Studio", price: 3.50, category: "burgers", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Crispy Chicken Extra", price: 4.00, category: "burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Papas rústicas Supremas", price: 2.50, category: "sides", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Papas Fritas Clásicas", price: 1.50, category: "sides", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=600&auto=format&fit=crop" },
    { id: 6, name: "Papas BBQ Pulled Pork", price: 3.00, category: "sides", image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=600&auto=format&fit=crop" },
    { id: 7, name: "Monster Dog XL", price: 2.75, category: "hotdogs", image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=600&auto=format&fit=crop" },
    { id: 8, name: "Cheddar & Bacon Dog", price: 3.00, category: "hotdogs", image: "https://images.unsplash.com/photo-1541214113241-21578d2d9b62?q=80&w=600&auto=format&fit=crop" },
    { id: 9, name: "Hot Dog Clásico", price: 1.75, category: "hotdogs", image: "https://images.unsplash.com/photo-1612392062631-94dd858cba88?q=80&w=600&auto=format&fit=crop" },
    { id: 10, name: "Salchipapa Suprema", price: 3.50, category: "salchipapas", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop" },
    { id: 11, name: "Salchipapa Tradicional", price: 2.00, category: "salchipapas", image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop" },
    { id: 12, name: "Salchipapa Criolla", price: 2.75, category: "salchipapas", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=600&auto=format&fit=crop" },
    { id: 13, name: "Papipollo Broaster", price: 3.00, category: "papipollos", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=600&auto=format&fit=crop" },
    { id: 14, name: "Papipollo Tenders", price: 3.50, category: "papipollos", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=600&auto=format&fit=crop" },
    { id: 15, name: "Papipollo Alitas BBQ", price: 4.00, category: "papipollos", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=600&auto=format&fit=crop" },
    { id: 16, name: "Gaseosa Personal", price: 0.75, category: "drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop" },
    { id: 17, name: "Té Helado de la Casa", price: 1.00, category: "drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop" },
    { id: 18, name: "Agua Mineral", price: 0.50, category: "drinks", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop" }
];

let cart = [];
const WHATSAPP_NUMBER = "593999999999";
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop";

const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");
const btnCheckout = document.getElementById("btnCheckout");
const productsGrid = document.getElementById("productsGrid");
let productSearch = document.getElementById("productSearch");
const categoryPills = document.querySelectorAll(".category-pill");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const deliveryFields = document.getElementById("deliveryFields");
const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
const customerName = document.getElementById("customerName");
const customerAddress = document.getElementById("customerAddress");
const customerReference = document.getElementById("customerReference");
const customerPhone = document.getElementById("customerPhone");
const orderNotes = document.getElementById("orderNotes");
let noResultsMessage = null;

function injectCatalogEnhancementStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .product-card { height: 100%; display: flex; flex-direction: column; }
        .product-card .card-info { flex: 1; display: flex; flex-direction: column; }
        .product-card .card-footer { margin-top: auto; }
        .product-card .card-image { height: 210px; background: #111115; }
        .product-card .card-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-search input::placeholder { color: var(--text-muted); }
        .catalog-empty-state { grid-column: 1 / -1; padding: 34px 18px; border: 1px dashed rgba(255,255,255,0.16); border-radius: var(--radius-lg); color: var(--text-muted); text-align: center; background: rgba(255,255,255,0.03); font-weight: 700; }
        .cart-item-card { display: grid; gap: 12px; margin-bottom: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; background: rgba(255,255,255,0.04); }
        .cart-item-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
        .cart-item-name { font-size: 15px; font-weight: 800; color: #fff; line-height: 1.35; }
        .cart-item-price { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
        .cart-item-subtotal { color: var(--primary); font-weight: 800; white-space: nowrap; }
        .cart-item-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .quantity-controls { display: inline-flex; align-items: center; gap: 10px; padding: 5px 8px; border-radius: 10px; background: rgba(255,255,255,0.06); }
        .quantity-controls button, .btn-remove-item { width: 30px; height: 30px; border: none; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .quantity-controls button { background: rgba(255,255,255,0.08); color: #fff; }
        .quantity-controls button:hover { background: var(--primary); }
        .quantity-controls span { min-width: 18px; text-align: center; color: #fff; font-weight: 800; }
        .btn-remove-item { background: rgba(239,68,68,0.12); color: #f87171; }
        .btn-remove-item:hover { background: #ef4444; color: #fff; }
        .empty-cart-text { padding: 32px 16px; border: 1px dashed rgba(255,255,255,0.14); border-radius: 14px; background: rgba(255,255,255,0.03); }
        @media (max-width: 560px) {
            .cart-item-top, .cart-item-bottom { align-items: stretch; }
            .cart-item-bottom { flex-direction: column; }
            .quantity-controls { justify-content: space-between; width: 100%; }
            .btn-remove-item { width: 100%; }
        }
    `;
    document.head.appendChild(style);
}

function enhanceProductCards() {
    const cards = productsGrid.querySelectorAll(".product-card");

    cards.forEach(card => {
        const productName = card.querySelector("h3").innerText.trim();
        const productData = products.find(product => product.name === productName);
        const image = card.querySelector(".card-image img");

        if (!productData || !image) return;

        image.src = productData.image;
        image.alt = productData.name;
        image.loading = "lazy";
        image.onerror = () => {
            image.onerror = null;
            image.src = FALLBACK_PRODUCT_IMAGE;
        };
    });
}

function createNoResultsMessage() {
    noResultsMessage = document.createElement("div");
    noResultsMessage.className = "catalog-empty-state";
    noResultsMessage.innerText = "No se encontraron productos";
    noResultsMessage.style.display = "none";
    productsGrid.appendChild(noResultsMessage);
}

function showToast(message) {
    if (!toast || !toastText) return;
    toastText.innerText = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

function toggleCart() {
    cartSidebar.classList.toggle("open");
    cartOverlay.classList.toggle("open");
}

cartToggle.addEventListener("click", toggleCart);
closeCart.addEventListener("click", toggleCart);
cartOverlay.addEventListener("click", toggleCart);

function getDeliveryType() {
    const selected = document.querySelector('input[name="deliveryType"]:checked');
    return selected ? selected.value : "Retiro en local";
}

function updateDeliveryFields() {
    if (!deliveryFields) return;
    deliveryFields.style.display = getDeliveryType() === "Domicilio" ? "grid" : "none";
}

deliveryRadios.forEach(radio => radio.addEventListener("change", updateDeliveryFields));
updateDeliveryFields();

function createProductSearch() {
    if (productSearch || !productsGrid) return;

    const searchBox = document.createElement("label");
    searchBox.className = "product-search";
    searchBox.style.cssText = "width:100%;margin-bottom:24px;background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-md);color:var(--text-muted);display:flex;align-items:center;gap:12px;padding:0 16px;transition:var(--transition);";

    const searchIcon = document.createElement("i");
    searchIcon.className = "fa-solid fa-magnifying-glass";

    productSearch = document.createElement("input");
    productSearch.type = "search";
    productSearch.id = "productSearch";
    productSearch.placeholder = "Buscar productos";
    productSearch.style.cssText = "width:100%;background:transparent;border:none;color:var(--white);outline:none;padding:15px 0;font-size:15px;";

    searchBox.addEventListener("focusin", () => {
        searchBox.style.borderColor = "rgba(255,94,0,0.55)";
        searchBox.style.boxShadow = "0 0 0 3px rgba(255,94,0,0.12)";
        searchBox.style.color = "var(--white)";
    });

    searchBox.addEventListener("focusout", () => {
        searchBox.style.borderColor = "rgba(255,255,255,0.08)";
        searchBox.style.boxShadow = "none";
        searchBox.style.color = "var(--text-muted)";
    });

    searchBox.append(searchIcon, productSearch);
    productsGrid.parentNode.insertBefore(searchBox, productsGrid);
}

let selectedCategory = "all";

function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function applyProductFilters() {
    const searchTerm = productSearch ? normalizeText(productSearch.value.trim()) : "";
    const cards = productsGrid.querySelectorAll(".product-card");
    let visibleProducts = 0;

    cards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        const productName = normalizeText(card.querySelector("h3").innerText.trim());
        const matchesCategory = selectedCategory === "all" || cardCategory === selectedCategory;
        const matchesSearch = productName.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            card.style.display = "flex";
            card.style.animation = "fadeIn 0.4s ease forwards";
            visibleProducts += 1;
        } else {
            card.style.display = "none";
        }
    });

    if (noResultsMessage) {
        noResultsMessage.style.display = visibleProducts === 0 ? "block" : "none";
    }
}

injectCatalogEnhancementStyles();
enhanceProductCards();
createProductSearch();
createNoResultsMessage();
applyProductFilters();

categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
        categoryPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        selectedCategory = pill.getAttribute("data-category");
        applyProductFilters();
    });
});

if (productSearch) productSearch.addEventListener("input", applyProductFilters);

productsGrid.addEventListener("click", (e) => {
    const targetButton = e.target.closest(".btn-add-cart");
    if (!targetButton) return;
    const productCard = targetButton.closest(".product-card");
    const productName = productCard.querySelector("h3").innerText.trim();
    const productData = products.find(p => p.name === productName);
    if (productData) addToCart(productData);
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    showToast(`${product.name} agregado al carrito`);
    updateCartDOM();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDOM();
}

window.changeQuantity = function(productId, amount) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    updateCartDOM();
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDOM();
};

window.clearCart = function() {
    if (cart.length === 0) {
        showToast("El carrito ya está vacío");
        return;
    }
    cart = [];
    updateCartDOM();
    showToast("Carrito vaciado correctamente");
};

function updateCartDOM() {
    cartBody.innerHTML = "";
    if (cart.length === 0) {
        cartBody.innerHTML = `<p class="empty-cart-text">Tu carrito está vacío</p>`;
        cartCount.innerText = "0";
        cartTotal.innerText = "$0.00";
        return;
    }

    let totalItemsCount = 0;
    let totalMoney = 0;

    cart.forEach(item => {
        totalItemsCount += item.quantity;
        const itemTotal = item.price * item.quantity;
        totalMoney += itemTotal;
        cartBody.innerHTML += `
            <div class="cart-item-card">
                <div class="cart-item-top">
                    <div>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
                    </div>
                    <span class="cart-item-subtotal">$${itemTotal.toFixed(2)}</span>
                </div>
                <div class="cart-item-bottom">
                    <div class="quantity-controls" aria-label="Cantidad de ${item.name}">
                        <button onclick="changeQuantity(${item.id}, -1)" aria-label="Disminuir ${item.name}"><i class="fa-solid fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" aria-label="Aumentar ${item.name}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="btn-remove-item" onclick="removeFromCart(${item.id})" aria-label="Eliminar ${item.name}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
    });

    cartCount.innerText = totalItemsCount;
    cartTotal.innerText = `$${totalMoney.toFixed(2)}`;
}

btnCheckout.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega un producto antes de confirmar el pedido.");
        return;
    }

    const deliveryType = getDeliveryType();

    if (deliveryType === "Domicilio" && (!customerName.value.trim() || !customerAddress.value.trim() || !customerPhone.value.trim())) {
        alert("Para domicilio, completa nombre, dirección y teléfono.");
        return;
    }

    let totalMoney = 0;
    let message = "Hola Burger Studio, quiero realizar este pedido:\n\n";
    message += "PRODUCTOS\n";

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalMoney += itemTotal;
        message += `- ${item.quantity} x ${item.name}\n`;
        message += `  Precio: $${item.price.toFixed(2)} c/u\n`;
        message += `  Subtotal: $${itemTotal.toFixed(2)}\n`;
    });

    message += `\nTOTAL FINAL: $${totalMoney.toFixed(2)}\n\n`;
    message += `FORMA DE ENTREGA: ${deliveryType}\n`;

    if (deliveryType === "Domicilio") {
        message += `CLIENTE: ${customerName.value.trim()}\n`;
        message += `DIRECCION: ${customerAddress.value.trim()}\n`;
        if (customerReference.value.trim()) message += `REFERENCIA: ${customerReference.value.trim()}\n`;
        message += `TELEFONO: ${customerPhone.value.trim()}\n`;
    } else {
        message += "El cliente retirara el pedido en el local.\n";
    }

    if (orderNotes && orderNotes.value.trim()) {
        message += `\nOBSERVACIONES: ${orderNotes.value.trim()}\n`;
    }

    message += "\nGracias.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
});

updateCartDOM();
