/* ========================================================================== 
   JS/APP.JS - SISTEMA DE CARRITO, FILTROS Y ENLACE AUTOMÁTICO DE PEDIDOS
   ========================================================================== */

const products = [
    { id: 1, name: "Cheddar Boom Burger", price: 4.50, category: "burgers" },
    { id: 2, name: "Clásica Studio", price: 3.50, category: "burgers" },
    { id: 3, name: "Crispy Chicken Extra", price: 4.00, category: "burgers" },
    { id: 4, name: "Papas rústicas Supremas", price: 2.50, category: "sides" },
    { id: 5, name: "Papas Fritas Clásicas", price: 1.50, category: "sides" },
    { id: 6, name: "Papas BBQ Pulled Pork", price: 3.00, category: "sides" },
    { id: 7, name: "Monster Dog XL", price: 2.75, category: "hotdogs" },
    { id: 8, name: "Cheddar & Bacon Dog", price: 3.00, category: "hotdogs" },
    { id: 9, name: "Hot Dog Clásico", price: 1.75, category: "hotdogs" },
    { id: 10, name: "Salchipapa Suprema", price: 3.50, category: "salchipapas" },
    { id: 11, name: "Salchipapa Tradicional", price: 2.00, category: "salchipapas" },
    { id: 12, name: "Salchipapa Criolla", price: 2.75, category: "salchipapas" },
    { id: 13, name: "Papipollo Broaster", price: 3.00, category: "papipollos" },
    { id: 14, name: "Papipollo Tenders", price: 3.50, category: "papipollos" },
    { id: 15, name: "Papipollo Alitas BBQ", price: 4.00, category: "papipollos" },
    { id: 16, name: "Gaseosa Personal", price: 0.75, category: "drinks" },
    { id: 17, name: "Té Helado de la Casa", price: 1.00, category: "drinks" },
    { id: 18, name: "Agua Mineral", price: 0.50, category: "drinks" }
];

let cart = [];
const WHATSAPP_NUMBER = "593999999999";

const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");
const btnCheckout = document.getElementById("btnCheckout");
const productsGrid = document.getElementById("productsGrid");
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

categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
        categoryPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const selectedCategory = pill.getAttribute("data-category");
        const cards = productsGrid.querySelectorAll(".product-card");
        cards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            if (selectedCategory === "all" || cardCategory === selectedCategory) {
                card.style.display = "block";
                card.style.animation = "fadeIn 0.4s ease forwards";
            } else {
                card.style.display = "none";
            }
        });
    });
});

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
        cartBody.innerHTML = `<p class="empty-cart-text">El carrito está vacío. ¡Empieza a llenarlo!</p>`;
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
            <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px;">
                <div class="item-details" style="flex:1;padding-right:10px;">
                    <h4 style="font-size:15px;font-weight:700;margin-bottom:4px;color:#fff;">${item.name}</h4>
                    <p style="color:var(--text-muted);font-size:13px;">$${item.price.toFixed(2)} c/u</p>
                </div>
                <div class="item-actions" style="display:flex;align-items:center;gap:12px;">
                    <div class="quantity-controls" style="display:flex;align-items:center;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px 8px;gap:10px;">
                        <button onclick="changeQuantity(${item.id}, -1)" style="background:none;border:none;color:#fff;cursor:pointer;font-size:14px;"><i class="fa-solid fa-minus"></i></button>
                        <span style="font-weight:700;font-size:14px;color:#fff;">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" style="background:none;border:none;color:#fff;cursor:pointer;font-size:14px;"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;margin-left:5px;"><i class="fa-solid fa-trash"></i></button>
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
    let message = "BURGER STUDIO\n\n";
    message += "Hola, deseo realizar el siguiente pedido:\n\n";
    message += "PRODUCTOS:\n";

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalMoney += itemTotal;
        message += `- ${item.quantity}x ${item.name} - $${itemTotal.toFixed(2)}\n`;
    });

    message += `\nTOTAL ESTIMADO: $${totalMoney.toFixed(2)}\n\n`;
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
