class orderItem {
  constructor(productID, productName, orderPrice, orderQuanity, deliveryDate) {
    (this.productID = productID),
      (this.productName = productName),
      (this.orderPrice = orderPrice),
      (this.orderQuanity = orderQuanity),
      (this.deliveryDate = deliveryDate);
  }
}

function saveOrder() {
  localStorage.removeItem("myOrders");
  if (myOrders.length != 0) {
    localStorage.setItem("myOrders", JSON.stringify(myOrders));
  }
}

function loadOrder() {
  let data = localStorage.getItem("myOrders");
  if (data) {
    myOrders = JSON.parse(data);
  }
  console.log(myOrders);
}

function deleteOrder(orderID) {
  // ********** Todo: check array.filter **********
  let index = -1;
  for (let i = 0; i < myOrders.length; i++) {
    if (myOrders[i].orderID === orderID) index = i;
  }
  myOrders.splice(index, 1);
  saveOrder();
  genOrderHTML();
}

function genItemsHTML(order) {
  let itemHTML = "";
  for (let i = 0; i < order.orderItems.length; i++) {
    itemHTML += `
      <div class="order-item row justify-content-between p-0 my-3 mx-0">
        <!-- Item Image -->
        <img class="product-img col-md-4 col-sm-6" src="../${
          products[getProductIndex(order.orderItems[i].productID)].image
        }" alt="">
        <!-- Item Details -->
        <div class="col-md-6 col-sm-10">
          <div class="h5 p-0 m-0">${order.orderItems[i].productName}</div>
          <div>Arriving on: <span>${
            order.orderItems[i].deliveryDate
          }</span></div>
          <div>Quanity: ${order.orderItems[i].orderQuantity}</div>
          <button class="text-center text-bg-warning border-0 rounded-3 my-2 py-2 px-3" onclick="buyItAgain('${
            order.orderItems[i].productID
          }')">
            <img class="icons" src="../images/icons/buy-again.png">
            Buy it again
          </button>
        </div>
        <!-- Track Package -->
        <div class="col-md-2 col-sm-6">
          <button class="text-bg-light w-75 border-1 border-info rounded-1 m-auto">Track Package</button>
        </div>
      </div>
    `;
  }
  return itemHTML;
}

function genOrderHTML() {
  let orderHTML = "";
  for (let i = 0; i < myOrders.length; i++) {
    orderHTML +=
      `
    <div class="card my-4">
    <!-- Order Header -->
    <div class="card-header row d-flex justify-content-between">
      <div class="col-md-2 col-sm-7 mx-0 p-0">
        <div class="h5">Order Placed</div>
        <div class="text-sm-start">${myOrders[i].orderDeliveryDate}</div>
      </div>
      <div class="col-md-4 col-sm-7 mx-0 p-0">
        <div class="h5">Total</div>
        <div class="text-sm-start">$${myOrders[i].orderTotal / 100}</div>
      </div>
      <div class="col-md-5 col-sm-6 mx-0 p-0">
        <div class="h5">Order ID:</div>
        <div class="text-sm-start">${myOrders[i].orderID}</div>
      </div>
      <div class="col-1 mx-0 p-0" onclick="deleteOrder('${
        myOrders[i].orderID
      }')"><img class="icons" src="../images/icons/cancel.png"></div>
    </div>
    <!-- Order Items -->
    <div class="card-body">
      ` +
      genItemsHTML(myOrders[i]) +
      `
    </div>
  </div>
  `;
  }
  document.querySelector(".orders-container").innerHTML = orderHTML;
}

// Set Cart Quantity
function setCartQuantity() {
  let itemsCount = cartQuantity();
  document.querySelector(".cart-quantity").innerHTML = itemsCount;
}

function buyItAgain(productID) {
  session.item = productID;
  saveSession();
  window.location.replace("./item.html");
}

let myOrders = [];

loadOrder();
loadCart();
genOrderHTML();
setCartQuantity();
