//import { products } from "./products";
let newOrder = { orderID: "id", orderTotal: 0, orderDeliveryDate: "yyyy-mm-dd", orderItems: []};
let myOrders = [];

function genCartHTML(){
  let cartHTML = "";
  let product;
  for(let i=0;i<cart.length;i++){
    product = products[getProductIndex(cart[i].productId)];
    cartHTML += `
          <div class="row p-0" id="cart-item-${cart[i].productId}">
            <div class="card border-1 my-3 p-0">
              <div class="card-header text-success fw-bold">Delivery Date: ${cart[i].deliveryDate}</div>
              <div class="card-body p-3">
                <div class="row justify-content-between p-0 m-0 g-0 gap-0">
                  <div class="col-2 m-0"><img class="cart-photo" src="../${product.image}"></div>
                  <div class="col-lg-7 col-sm-5 m-0">
                    <div class="h5">${product.name}</div>
                    <div class="card-item text-danger">$${(cart[i].unitPrice/100).toFixed(2)}</div>
                    <div class=""> 
                      <div class="card-item mx-1">Quantity: <span id="item-qty-${cart[i].productId}">${cart[i].quantityOrder}</span></div>
                      </div>
                      
                      <div class="mx-1 btn btn-warning" onclick="removeFromCart('${cart[i].productId}')">Delete</div>

                      <div class="mx-1 btn"><a href="#edit-item-${cart[i].productId}" class="btn btn-primary  dropdown-toggle" data-bs-toggle="collapse">Update</a>
                      
                      <div id="edit-item-${cart[i].productId}" class="collapse">
                        <input class="form-control" type="number" id="edit-qty-${cart[i].productId}" value="${cart[i].quantityOrder}">
                        <button class="form-control btn btn-success d-inline" onclick="applyEdit('${cart[i].productId}')">Apply</button>
                      </div>

                    </div>
                  </div>
                  <div class="col-lg-3 col-sm-2">
                    <div class="row">
                      <div class="h5">Choose a delivery option:</div></div>
                    <div class="row d-flex">
                      <div class="col"><input type="radio" name="delivery-1"></div>
                      <div class="col-10">
                        <div class="text-success fw-bold">Tuesday, June 21</div>
                        <div>FREE Shipping</div>
                      </div>
                    </div>
                    <div class="row d-flex">
                      <div class="col"><input type="radio" name="delivery-1"></div>
                      <div class="col-10">
                        <div class="text-success fw-bold">Wednesday, June 15</div>
                        <div>$4.99 - Shipping</div>
                      </div>
                    </div>
                    <div class="row d-flex">
                      <div class="col"><input type="radio" name="delivery-1"></div>
                      <div class="col-10">
                        <div class="text-success fw-bold">Monday, June 13</div>
                        <div>$9.99 - Shipping</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
  }
  document.querySelector(".cart-items").innerHTML = cartHTML;
}

function saveOrder(){
  if(myOrders){
    localStorage.setItem('myOrders',JSON.stringify(myOrders));
  }
}

function loadOrder(){
  let data = localStorage.getItem('myOrders');
  if(data){
    myOrders = JSON.parse(data);
  }
}

function removeFromCart(productID){
  if(confirm("Are you sure you want to remove this item?\n Either Yes or Cancel")){
    cart.splice(getCartItemIndex(productID),1);
    document.getElementById("cart-item-"+productID).remove();
    saveCart();
    genSummary();
    alert("Item removed");
  }
}

function emptyCart(){
  //if(confirm("Are you sure you want to empty cart?\n Either Yes or Cancel")){
    while(cart.length){
      cart.pop()
    }
    saveCart();
    genCartHTML();
  //}
}

function genSummary(){
  let itemsCount = 0;
  let orderTotal = 0;
  loadCart();
  for(let i=0; i<(cart.length); i++){
    itemsCount += cart[i].quantityOrder;
    orderTotal += cart[i].unitPrice*cart[i].quantityOrder;
  }
  orderTotal = (orderTotal/100);
  let shippingPrice = (0.05*orderTotal);
  let tax = ((orderTotal+shippingPrice)*0.1);
  document.getElementById('items-count-1').innerHTML = itemsCount;
  document.getElementById('items-count-2').innerHTML = itemsCount;
  document.getElementById('items-price').innerHTML = orderTotal.toFixed(2);
  document.getElementById('items-shipping-price').innerHTML = shippingPrice.toFixed(2);
  document.getElementById('items-total-before-tax').innerHTML = (orderTotal+shippingPrice).toFixed(2);
  document.getElementById('items-estimated-tax').innerHTML = tax.toFixed(2);
  document.getElementById('items-total-price').innerHTML = (orderTotal+shippingPrice+tax).toFixed(2);
  
  document.querySelector('.cart-quantity').innerHTML = itemsCount;
}

function applyEdit(productID){
  let newQTY = parseInt(document.getElementById("edit-qty-"+productID).value);
  if (newQTY > 0){
    for(let i=0; i<cart.length; i++){
      if(cart[i].productId == productID){
        cart[i].quantityOrder = newQTY;
        saveCart();
        document.getElementById("item-qty-"+productID).innerHTML = newQTY;
        genSummary();
        alert("done");
        return true;
      }
    }
  }
  return false;
} 

function createOrder(){
  if(cart && cart.length){
    cart.forEach(cartItem => {
      addNewItem(
        cartItem.productId,
        products[getProductIndex(cartItem.productId)].name,
        products[getProductIndex(cartItem.productId)].priceCents,
        cartItem.quantityOrder,
        cartItem.deliveryDate
      )
    })
    updateOrderTotal();
    updateOrderID();
    updateOrderDate();
    loadOrder();
    addOrder();
    saveOrder();
    emptyCart();
    if(confirm("New order placed, view orders page?")){
      window.location.href = "./orders.html";
    }
  } else {
    alert('Your cart is empty, add items from store')
  }
  /*item = {
      productId: productid,
      unitPrice: product.priceCents,
      quantityOrder: quantity,
      deliveryDate: "2023-10-10"
    }; */
}

function addOrder(){
  if(newOrder.orderID != 'id'){
    myOrders.push(newOrder);
    newOrder = { orderID: "id", orderTotal: 0, orderDeliveryDate: "yyyy-mm-dd", orderItems: []};
  }
}

class orderItem {
  constructor(ID, name, price, qty, date){
    this.productID = ID,
    this.productName = name,
    this.orderPrice = price,
    this.orderQuantity = qty,
    this.deliveryDate = date
  }
}

function addNewItem(productID, productName, orderPrice, orderQuantity, deliveryDate){
  let newOrderItem = new orderItem(productID, productName, orderPrice, orderQuantity, deliveryDate)
  newOrder.orderItems.push(newOrderItem)
}

function updateOrderTotal(){
  if(newOrder.orderItems != null && newOrder.orderItems.length != 0){
    let orderTotal = 0;
    newOrder.orderItems.forEach(orderItem => {
      orderTotal += orderItem.orderPrice * orderItem.orderQuantity;
    })
    newOrder.orderTotal = orderTotal;
  }
}

function updateOrderID(){
  newOrder.orderID = genID();
}
function updateOrderDate(){
  newOrder.orderDeliveryDate = "2023-11-11"
}

loadCart();
genCartHTML();
genSummary();