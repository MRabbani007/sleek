// Declare Variables

// number of products to display per page
let productCount = 12;
// users file
const usersFile = "./users.txt";
// hold user information
let users = [];
// hold cart information
let cart = [];
// store settings and transfer data between pages
let session = {
  username: "user",
  item: "productID",
  searchCat: "all",
  searchQuery: "",
};

function loadSession() {
  let data = localStorage.getItem("session");
  if (data) {
    session = JSON.parse(data);
  }
}

function saveSession() {
  localStorage.setItem("session", JSON.stringify(session));
}

// Load Cart From Local Storage
function loadCart() {
  let data = localStorage.getItem("cart");
  if (data) {
    cart = JSON.parse(data);
  }
}

// Save Cart to Local Storage
function saveCart() {
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Calculate quantity of items in cart
function cartQuantity() {
  let itemsCount = 0;
  for (let i = 0; i < cart.length; i++) {
    itemsCount += cart[i].quantityOrder;
  }
  return itemsCount;
}

// Set Cart Quantity
function setCartQuantity() {
  let itemsCount = cartQuantity();
  document.querySelector(".cart-quantity").innerHTML = itemsCount;
}

// get index of product in cart
function getCartItemIndex(productID) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId == productID) {
      return i;
    }
  }
  return -1;
}

function loadUsers() {
  fs.readFile(usersFile, "utf8", function (err, data) {
    if (err) throw err;
    users = JSON.parse(data);
  });
}

function saveUsers() {
  if (users && users.length) {
    fs.writeFile(usersFile, JSON.stringify(users), function (err) {
      if (err) throw err;
    });
  } else {
  }
}

function createUser(userName) {
  let user = {
    userID: genID(),
    userName: userName,
    firstName: "firstName",
    lastName: "lastName",
    cart: [],
    orders: [],
  };
}

function genID() {
  // return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(32).toString().slice(2).replace('.','')).toString(36)
  return crypto.randomUUID();
}

function calcShipping(
  unitPrice,
  unitWeight = 1,
  shipsFrom = "USA",
  shipsTo = "KAZAKHSTAN"
) {
  let shippingRate = 0;
  switch (shipsFrom + "-" + shipsTo) {
    case "USA-USA":
      shippingRate = 0;
    case "USA-KAZAKHSTAN":
      shippingRate = 0.05;
    default:
      shippingRate = 0.1;
  }
  return unitPrice * shippingRate * unitWeight;
}

function searchNavbar(page = "") {
  let searchCat = document.getElementById("cat-list").value.toLowerCase();
  let searchQuery = document.querySelector(".searchBox").value.toLowerCase();
  session.searchCat = searchCat;
  session.searchQuery = searchQuery;
  saveSession();
  if (page === "index") {
    window.location.replace("./views/store.html");
  } else {
    window.location.replace("./store.html");
  }
}

function displayItem(productID) {
  session.item = productID;
  saveSession();
  window.location.replace("./item.html");
}

function redirect(target, callingPage = "", category = "all") {
  let destination = "";
  if (callingPage === "index") {
    destination += "./views/";
  } else {
    destination += "./";
  }
  if (target === "signin") {
    destination += "signin.html";
  } else if (target === "signup") {
    destination += "signup.html";
  } else if (target === "store") {
    destination += "store.html";
    session.searchCat = category;
    saveSession();
  }
  window.location.replace(destination);
}

function genRatings(rating) {
  console.log(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i === rating - 0.5) {
      stars += '<span class="fa fa-star-half-o checked"></span>';
    } else {
      if (i <= rating) {
        stars += '<span class="fa fa-star checked"></span>';
      } else {
        stars += '<span class="fa fa-star-o checked"></span>';
      }
    }
  }
  return stars;
}
