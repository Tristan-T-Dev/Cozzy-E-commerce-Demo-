let iconBag = document.querySelector('.icon-bag');
let closeCart = document.querySelector('.close');
let section = document.querySelector('section');
let listProductHTML = document.querySelector('.ListProd');
let LisCartHTML = document.querySelector('.ListBag');
let iconCartSpan = document.querySelector('.icon-bag span');
let checkOut = document.querySelector('.checkOut');
let checkOutOrder = document.querySelector('.checkOutOrder');
let placeOrder = document.querySelector('.placeOrder');
let closeCheck = document.querySelector('.close_checkOut');
let checkoutList = document.querySelector('.checkoutlist');
let cartTab = document.querySelector('.cartTab');
let listProducts = [];
let cart = [];

iconBag.addEventListener('click', () => {
  section.classList.toggle('showCart')
})
closeCart.addEventListener('click', () => {
    section.classList.toggle('showCart')
})
checkOut.addEventListener('click', () => {
    section.classList.toggle('showCart')
})
checkOut.addEventListener('click', () => {
    section.classList.toggle('showCheckOut')
})
closeCheck.addEventListener('click', () => {
    section.classList.toggle('showCart')
})
closeCheck.addEventListener('click', () => {
    section.classList.toggle('showCheckOut')
})

//error handler for checking out without item on the list bag 
checkOut.addEventListener('click', () => {
    if (cart.length === 0) {
        cartTab.classList.add('error');
        setTimeout(() => {
            cartTab.classList.remove('error');
        }, 1000); // The timeout matches the animation duration
    } 
});
const addDataToHTML = () => {
    listProductHTML.innerHTML = ``;
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <span class="price"> ₱${product.price}</span>
                <button class="addCart">Add To Bag</button>
            `;
            listProductHTML.appendChild(newProduct);
        })
   }
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addtoCart(product_id);
    }
})

const addtoCart = (product_id) => {
    let positionThisProduct = cart.findIndex((value) => value.product_id == product_id)
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProduct < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        })
    }else{
        cart[positionThisProduct].quantity = cart[positionThisProduct].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    LisCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {

        cart.forEach(cartItem => {
            totalQuantity += cartItem.quantity;
            
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cartItem.product_id;

            // Find the product in the listProducts array
            let positionProduct = listProducts.findIndex(product => product.id == cartItem.product_id);
            
            // Check if the product exists in the list
            if (positionProduct >= 0) {
                let info = listProducts[positionProduct];
                
                newCart.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        ₱${info.price * cartItem.quantity}
                    </div>
                    <div class="quantity">
                        <span class="minus"> < </span>
                        <span> ${cartItem.quantity} </span>
                        <span class="plus"> > </span>
                    </div>
                `;
                LisCartHTML.appendChild(newCart);
            } else {
                console.error(`Product with ID ${cartItem.product_id} not found.`);
            }
        });
    }
    iconCartSpan.innerText = totalQuantity;
    updateTotalAmount();
};


LisCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target; 
    if(positionClick.classList.contains('minus') || (positionClick.classList.contains('plus'))){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})
// for total amount
function calculateTotalPrice(cartItem) {
    const product = listProducts.find(product => product.id == cartItem.product_id);
    if (product) {
        const price = parseFloat(product.price) || 0;  // Get price from product data
        const quantity = cartItem.quantity || 0;       // Use the cartItem quantity

        console.log('Product Price:', price, 'Quantity:', quantity);

        return price * quantity;
    }
    return 0; // If product is not found, return 0
}

// to calculate the total amount for all items in the cart
function calculateTotalAmount(cart) {
    if (!cart || cart.length === 0) {
        console.log("Cart is empty or undefined");
        return 0;
    }

    return cart.reduce((total, item) => {
        return total + calculateTotalPrice(item);
    }, 0);
}

// to update the total amount displayed on the page
function updateTotalAmount() {
    const totalAmount = calculateTotalAmount(cart);
    document.getElementById('totalAmount').innerText = `₱${totalAmount}`;
}
function changeQuantity(product_id, type) {
    let positionItemCart = cart.findIndex((item) => item.product_id == product_id);

    if (positionItemCart !== -1) {
        switch(type) {
            case 'plus':
                cart[positionItemCart].quantity += 1;
                break;
            case 'minus':
                if (cart[positionItemCart].quantity > 1) {
                    cart[positionItemCart].quantity -= 1;
                } else {
                    cart.splice(positionItemCart, 1); 
                }
                break;
        }
        addCartToHTML();  // Re-render the cart to update the quantities and items
        updateTotalAmount(); // Update the total amount
        addCartToMemory(); // Save the updated cart to local storage
    }
}


let checkoutOrder = document.querySelector('.checkoutlist');
let checkoutBtn = document.querySelector('.checkOut');

// to render the checkout items
const renderCheckoutItems = () => {
    // Clear the current checkout list
    checkoutOrder.innerHTML = '';

    // Loop through the cart items and add them to the checkout list
    cart.forEach(cartItem => {
        // Find the product in the list of products
        let product = listProducts.find(item => item.id == cartItem.product_id);

        if (product) {
            // Create a new div for each product in the checkout
            let checkoutItem = document.createElement('div');
            checkoutItem.classList.add('item');
            checkoutItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="">
                </div>
                <div class="name">
                    ${product.name}
                </div>
                <div class="totalPrice">
                    ₱ ${product.price}
                </div>
                <div class="quantity">
                    <span class="quantity">${cartItem.quantity}</span>
                </div>
            `;
            checkoutOrder.appendChild(checkoutItem);
        }
    });
};

// to checkout button to show the checkout items
checkoutBtn.addEventListener('click', () => {
    renderCheckoutItems(); // Populate the checkout list with the cart items
    document.querySelector('.checkOutOrder').classList.toggle('showCheckOut');
});

// to update the total amount displayed on the page and checkout tab
function updateTotalAmount() {
    const totalAmount = calculateTotalAmount(cart);
    
    document.getElementById('totalAmount').innerText = `₱${totalAmount}`;

    const checkoutTotalElement = document.querySelector('.checkOutOrder .total #totalAmount');
    if (checkoutTotalElement) {
        checkoutTotalElement.innerText = `₱${totalAmount}`;
    }
}


const initApp = () => {
    //data for the products (json)
    fetch('product.json')
    .then(response => response.json())
    .then(data =>{
        listProducts = data;
        console.log(listProducts);
        addDataToHTML();
    
    //memory holder for the shopping bag
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
    })
};
initApp();