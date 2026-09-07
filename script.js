/* =====================================================
   GLAM HOUSE
   FUNCIONALIDAD PRINCIPAL
===================================================== */


/* ================= CONFIGURACIÓN ================= */

const WHATSAPP_NUMBER = "573114408123";

let shoppingCart = [];


/* ================= ELEMENTOS ================= */

const cart = document.getElementById("cart");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCounter = document.getElementById("cartCounter");

const checkoutButton = document.getElementById("checkoutButton");

const orderOverlay = document.getElementById("orderOverlay");
const closeOrder = document.getElementById("closeOrder");
const orderForm = document.getElementById("orderForm");

const toast = document.getElementById("toast");

const searchButton = document.getElementById("searchButton");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const closeSearch = document.getElementById("closeSearch");

const productGrid = document.getElementById("productGrid");

const filterButtons = document.querySelectorAll(".filter-button");

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");


/* ================= FORMATO DE PRECIO ================= */

function formatPrice(price) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(price);

}


/* ================= CARRITO ================= */

function openCart() {

    cart.classList.add("active");

    cartOverlay.classList.add("active");

}


function closeCartFunction() {

    cart.classList.remove("active");

    cartOverlay.classList.remove("active");

}


cartBtn.addEventListener("click", openCart);

closeCart.addEventListener("click", closeCartFunction);

cartOverlay.addEventListener("click", closeCartFunction);


/* ================= AGREGAR PRODUCTOS ================= */

const addButtons = document.querySelectorAll(".add-button");


addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;

        const price = Number(button.dataset.price);


        const existingProduct = shoppingCart.find(
            product => product.name === name
        );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            shoppingCart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }


        updateCart();

        showToast(`${name} agregado al carrito`);

    });

});


/* ================= ACTUALIZAR CARRITO ================= */

function updateCart() {

    cartItems.innerHTML = "";


    if (shoppingCart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">

                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H7"></path>
                        <circle cx="10" cy="19" r="1.3"></circle>
                        <circle cx="18" cy="19" r="1.3"></circle>
                    </svg>

                </div>

                <p>Tu carrito está vacío</p>

                <span>
                    Agrega productos para comenzar.
                </span>

            </div>
        `;


        cartTotal.textContent = "$0";

        cartCounter.textContent = "0";

        return;

    }


    let total = 0;

    let totalQuantity = 0;


    shoppingCart.forEach((product, index) => {

        const subtotal =
            product.price * product.quantity;


        total += subtotal;

        totalQuantity += product.quantity;


        const item = document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(product.name)}
                </h4>

                <span class="cart-item-price">
                    ${formatPrice(product.price)}
                </span>


                <div class="cart-item-controls">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                        aria-label="Disminuir cantidad">
                        −
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                        aria-label="Aumentar cantidad">
                        +
                    </button>

                    <button
                        class="remove-item"
                        onclick="removeProduct(${index})">
                        Eliminar
                    </button>

                </div>

            </div>


            <strong>
                ${formatPrice(subtotal)}
            </strong>

        `;


        cartItems.appendChild(item);

    });


    cartTotal.textContent = formatPrice(total);

    cartCounter.textContent = totalQuantity;

}


/* ================= CAMBIAR CANTIDAD ================= */

function changeQuantity(index, amount) {

    shoppingCart[index].quantity += amount;


    if (shoppingCart[index].quantity <= 0) {

        shoppingCart.splice(index, 1);

    }


    updateCart();

}


/* ================= ELIMINAR PRODUCTO ================= */

function removeProduct(index) {

    shoppingCart.splice(index, 1);

    updateCart();

    showToast("Producto eliminado");

}


/* ================= TOAST ================= */

let toastTimeout;


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("active");


    clearTimeout(toastTimeout);


    toastTimeout = setTimeout(() => {

        toast.classList.remove("active");

    }, 2500);

}


/* ================= FAVORITOS ================= */

const favoriteButtons =
    document.querySelectorAll(".favorite");


favoriteButtons.forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        button.classList.toggle("active");


        if (button.classList.contains("active")) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});


/* ================= FILTROS ================= */

let currentFilter = "todos";


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );


        button.classList.add("active");


        currentFilter = button.dataset.filter;

        filterProducts();

    });

});


function filterProducts() {

    const searchValue =
        searchInput.value.toLowerCase().trim();


    const products =
        document.querySelectorAll(".product-card");


    products.forEach(product => {

        const category =
            product.dataset.category;


        const name =
            product.dataset.name.toLowerCase();


        const matchesFilter =
            currentFilter === "todos" ||
            category === currentFilter;


        const matchesSearch =
            name.includes(searchValue);


        if (matchesFilter && matchesSearch) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

}


/* ================= BUSCADOR ================= */

searchButton.addEventListener("click", () => {

    searchContainer.classList.add("active");

    searchInput.focus();

});


closeSearch.addEventListener("click", () => {

    searchContainer.classList.remove("active");

    searchInput.value = "";

    filterProducts();

});


searchInput.addEventListener("input", filterProducts);


/* ================= MENÚ MÓVIL ================= */

menuButton.addEventListener("click", () => {

    nav.classList.toggle("active");

});


nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


/* ================= CHECKOUT ================= */

checkoutButton.addEventListener("click", () => {

    if (shoppingCart.length === 0) {

        showToast("Tu carrito está vacío");

        return;

    }


    orderOverlay.classList.add("active");

});


/* ================= CERRAR PEDIDO ================= */

closeOrder.addEventListener("click", () => {

    orderOverlay.classList.remove("active");

});


orderOverlay.addEventListener("click", event => {

    if (event.target === orderOverlay) {

        orderOverlay.classList.remove("active");

    }

});


/* ================= ENVIAR PEDIDO ================= */

orderForm.addEventListener("submit", event => {

    event.preventDefault();


    if (shoppingCart.length === 0) {

        showToast("Tu carrito está vacío");

        return;

    }


    const customerName =
        document.getElementById("customerName").value.trim();


    const customerAddress =
        document.getElementById("customerAddress").value.trim();


    const customerCity =
        document.getElementById("customerCity").value.trim();


    const customerPhone =
        document.getElementById("customerPhone").value.trim();


    const paymentMethod =
        document.getElementById("paymentMethod").value;


    if (
        !customerName ||
        !customerAddress ||
        !customerCity ||
        !customerPhone ||
        !paymentMethod
    ) {

        showToast("Completa todos los campos");

        return;

    }


    /* ================= NÚMERO DE PEDIDO ================= */

    const orderNumber =
        "GLH-" +
        Math.floor(1000 + Math.random() * 9000);


    /* ================= TOTAL ================= */

    let total = 0;


    shoppingCart.forEach(product => {

        total +=
            product.price * product.quantity;

    });


    /* ================= MENSAJE ================= */

    let message =
        `*NUEVO PEDIDO - GLAM HOUSE*%0A%0A`;


    message +=
        `*Pedido:* ${orderNumber}%0A%0A`;


    message +=
        `*PRODUCTOS:*%0A`;


    shoppingCart.forEach(product => {

        const subtotal =
            product.price * product.quantity;


        message +=
            `• ${product.name} x${product.quantity} - ${formatPrice(subtotal)}%0A`;

    });


    message +=
        `%0A*TOTAL:* ${formatPrice(total)}%0A%0A`;


    message +=
        `*DATOS DE ENTREGA:*%0A`;


    message +=
        `Nombre: ${customerName}%0A`;


    message +=
        `Dirección: ${customerAddress}%0A`;


    message +=
        `Ciudad: ${customerCity}%0A`;


    message +=
        `Teléfono: ${customerPhone}%0A`;


    message +=
        `Método de pago: ${paymentMethod}%0A`;


    /* ================= WHATSAPP ================= */

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(whatsappURL, "_blank");


    /* ================= LIMPIAR ================= */

    shoppingCart = [];


    updateCart();


    orderForm.reset();


    orderOverlay.classList.remove("active");


    closeCartFunction();


    showToast("Pedido preparado para WhatsApp");

});


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ================= TECLA ESC ================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCartFunction();

        orderOverlay.classList.remove("active");

        searchContainer.classList.remove("active");

    }

});


/* ================= INICIALIZAR ================= */

updateCart();