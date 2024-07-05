// cargar la cesta
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// actualizar la cesta
function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// anyadir a la cesta
function addToCart(imgSrc, info, quantity) {
    const existingItemIndex = cart.findIndex(item => item.imgSrc === imgSrc && item.info === info);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        let price;
        if (info.includes("HakeMate")) {
            price = 1.5;
        } else {
            price = 2.5;
        }
        cart.push({ imgSrc, info, quantity, price });
    } 
    
    updateLocalStorage();
}

// actualizar pagina de la cesta
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector(".shopping-cart");
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = `
        <div class="column-labels">
            <label class="product-image">Imagen</label>
            <label class="product-details">Producto</label>
            <label class="product-price">Precio</label>
            <label class="product-quantity">Cantidad</label>
            <label class="product-removal">Quitar</label>
            <label class="product-line-price">Total</label>
        </div>
    `;

    let subtotal = 0;
    cart.forEach((item, index) => {
        const totalPrice = (item.price * item.quantity).toFixed(2);
        subtotal += parseFloat(totalPrice);

        const cartItemHTML = `
            <div class="product">
                <div class="product-image">
                    <img src="${item.imgSrc}" alt="${item.info}">
                </div>
                <div class="product-details">
                    <div class="product-title">${item.info}</div>
                    <p class="product-description">${item.info}</p>
                </div>
                <div class="product-price">${item.price}e</div>
                <div class="product-quantity">
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}">
                </div>
                <div class="product-line-price">${totalPrice}e</div>
                <div class="product-removal">
                    <button class="remove-product" data-index="${index}">Quitar</button>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
    });

    const tax = (subtotal * 0.21).toFixed(2);
    const shipping = 5.00;
    const total = (subtotal + parseFloat(tax) + shipping).toFixed(2);

    cartItemsContainer.insertAdjacentHTML("beforeend", `
        <div class="totals">
            <div class="totals-item">
                <label>Subtotal</label>
                <div class="totals-value" id="cart-subtotal">${subtotal.toFixed(2)}e</div>
            </div>
            <div class="totals-item">
                <label>Taxas (21%)</label>
                <div class="totals-value" id="cart-tax">${tax}e</div>
            </div>
            <div class="totals-item">
                <label>Envio</label>
                <div class="totals-value" id="cart-shipping">5.00e</div>
            </div>
            <div class="totals-item totals-item-total">
                <label>Total</label>
                <div class="totals-value" id="cart-total">${total}e</div>
                <button class="checkout" style="margin-bottom: 50px 0;">Comprar</button> 
            </div>
        </div>
    `);

    document.querySelector(".checkout").addEventListener("click", function() {
        // Guardar la cesta en localstorage
        updateLocalStorage();
    
        // Codifica los datos del carrito para pasarlos como parámetro de URL
        const encodedCart = encodeURIComponent(JSON.stringify(cart));
    
        // Enviar a compra.html con los datos de la cesta
        window.location.href = `compra.html?cart=${encodedCart}`;
    });
    
    // funccion parar actualizar localstorage con los datos que tenemos
    function updateLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    



    // anyadir y quitar
    cartItemsContainer.addEventListener("change", event => {
        if (event.target.type === "number") {
            handleQuantityChange(event);
        }
    });
    cartItemsContainer.addEventListener("click", event => {
        if (event.target.classList.contains("remove-product")) {
            handleItemRemoval(event);
        }
    });
}


// manejar el cambio de cantidad
function handleQuantityChange(event) {
    const index = event.target.dataset.index;
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        updateLocalStorage();
        updateCartDisplay();
    }
}

// manejar la eliminacion de un producto
function handleItemRemoval(event) {
    const index = event.target.dataset.index;
    cart.splice(index, 1);
    updateLocalStorage();
    updateCartDisplay();
}


document.addEventListener("DOMContentLoaded", function() {
    updateCartDisplay();
});


/*************CestaCOMPRA*********************/


// Funccion parar parametros de url
function getUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(searchParams.entries());
}

// funccion para cargar los datos de la cesta desde el parametro url 
function loadCartFromUrlParams() {
    const urlParams = getUrlParams();
    if (urlParams.cart) {
        const decodedCart = decodeURIComponent(urlParams.cart);
        return JSON.parse(decodedCart);
    }
    return [];
}

// funccion para poner en la pantalla productos de la cesta en compra.html
function displayCartItems() {
    const cart = loadCartFromUrlParams();
    const compraForm = document.getElementById("compra-form");

    // Iterar a través de los artículos del carrito y crear campos de formulario HTML
    cart.forEach((item) => {
        const precio = (item.price * item.quantity);
        const impuesto = (precio * 0.21);
        const precioTotal = (precio + impuesto);
        const cartItemHTML = `
            <div class="product">
                <label>Producto: ${item.info}</label>
                <label>Precio unitario: ${item.price}e</label>
                <label>Cantidad: ${item.quantity}</label>
                <label>Total: ${precio}e</label>
                <label>Impuestos: ${impuesto}e</label>
                <label>Precio total: ${precioTotal}e</label>
            </div>

        `;
        compraForm.insertAdjacentHTML("beforeend", cartItemHTML);
    });
}

// Cargar y ensenyar los datos de la cesta en la paginda load
document.addEventListener("DOMContentLoaded", function() {
    displayCartItems();
});












/**********************PagPRODUCTOS(HAKE)************************/
document.addEventListener("DOMContentLoaded", () => {
    // Iterar sobre los elementos de la galería
    document.querySelectorAll(".gallery-item").forEach(item => {
        const img = item.querySelector(".gallery-img").src;
        const info = item.querySelector(".product-info").textContent;
        const addButton = item.querySelector(".add-btn");
        const removeButton = item.querySelector(".remove-btn");
        const quantityDisplay = item.querySelector(".quantity");
        const addToCartButton = item.querySelector(".add-to-cart-btn");

        let quantity = 0;

        
        
        addButton.addEventListener("click", () => {
            quantity++;
            quantityDisplay.textContent = quantity;
        });

        removeButton.addEventListener("click", () => {
            if (quantity > 0) {
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });

        addToCartButton.addEventListener("click", () => {
            if (quantity > 0) {
                addToCart(img, info, quantity);
                quantity = 0;
                quantityDisplay.textContent = quantity;
                alert(`Has anyadido ${info} a la cesta`);
            } else {
                alert("Por favor, añade una cantidad válida");
            }
        });

        // Añadir event listener para ampliar la imagen
        item.querySelector(".gallery-img").addEventListener("click", () => {
            const modal = document.getElementById("modal");
            const modalImg = document.getElementById("modal-img");
            modal.style.display = "block";
            modalImg.src = img;
        });
    });

    // Actualizar el display del carrito
    if (document.querySelector(".shopping-cart")) {
        updateCartDisplay();
    }

    // Cerrar modal
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".cerrar");
    if (modal && closeModal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    } else {
        ("Modal o closeModal boton no econtrado.");
    }
});



/***************************LOGIN******************************/
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signupMessage = document.getElementById('signupMessage');
    
    // array para guardar los datos de usuario
    let customers = [];

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // coger valores de form
            const nombreSign = document.getElementById('signName').value.trim();
            const email = document.getElementById('signEmail').value.trim();
            const contrasenyaSign = document.getElementById('signPasswordNew').value.trim();

            if (nombreSign === "" || email === "" || contrasenyaSign === "") {
                signupMessage.textContent = "Por favor, complete todos los campos.";
                signupMessage.style.color = "red";
                return;
            }

            // guardar datos en array
            const newCustomer = { nombreSign, email, contrasenyaSign };
            customers.push(newCustomer);

            
            signupMessage.textContent = "Usuario creado exitosamente.";
            signupMessage.style.color = "green";

            // limpiar formulario de signin
            signupForm.reset();

            //console.log(customers)
        })}
    });
/*************ENVIO***************/
document.addEventListener('DOMContentLoaded', () => {
    const shippingForm = document.getElementById('shipping-form');
    const shippingMessage = document.getElementById('shippingMessage');
    
    // Array para guardar los datos del usuario
    let shippingData = [];

    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // coger valor del formulario
            const nombre = document.getElementById('name').value.trim();
            const direccion = document.getElementById('address').value.trim();
            const ciudad = document.getElementById('city').value.trim();
            const codiPostal = document.getElementById('postal-code').value.trim();
            const comentarios = document.getElementById('comments').value.trim();

            if (nombre === "" || direccion === "" || ciudad === "" || codiPostal === "") {
                shippingMessage.textContent = "Por favor, complete todos los campos obligatorios.";
                shippingMessage.style.color = "red";
                return;
            }

            // guardar data en el array
            const newShippingInfo = { nombre, direccion, ciudad, codiPostal, comentarios };
            shippingData.push(newShippingInfo);

            //console.log(shippingData);

            // simular envio del formulario
            shippingMessage.textContent = "Información de envío guardada exitosamente.";
            shippingMessage.style.color = "green";

            // limpiar el formulario
            shippingForm.reset();
        });
    }
});
