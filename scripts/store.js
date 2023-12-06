// Main Javascript for Store Page

// Declare Variables
displayProducts = products;

// Add Item to Cart
function addToCart(productid){
  let quantity = parseInt(document.getElementById("input-qty-"+productid).value);
  if(typeof(quantity) == "number"){
    let product = products[getProductIndex(productid)];
    let item = {
      productId: productid,
      unitPrice: product.priceCents,
      quantityOrder: quantity,
      deliveryDate: "2023-10-10"
    };
    let alreadyInCart = false;
    if (cart.length == 0){
      cart.push(item);
      alert("Item added to cart");
    } else {
      for(let i=0; i<cart.length;i++){
        if( cart[i].productId == productid){
          alreadyInCart = true;
          if(confirm("Item already in cart, add new quantity?"))
          {
            cart[i].quantityOrder += quantity;
            alert("Item added to cart");
            return true;
          } else return false;
        }
      }
      if(!alreadyInCart){
        cart.push(item);
        alert("Item added to cart");
      }
    }
    saveCart(cart);
    setCartQuantity(cart);
  }
}

// Generate Pagination
function genPagination(productCount, activeIndex = 1){
  let paginationHTML = `
    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
  `;
  if (productCount === 0){
  } else {
    for(let i=1; (i-1)*itemsPerPage < productCount; i++){
      if (i === activeIndex){
        paginationHTML += `<li class="page-item"><a class="page-link active" href="#" onclick="setProducts(${i})">${i}</a></li>`;
        continue;
      }
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="setProducts(${i})">${i}</a></li>`;
    }
  }
  paginationHTML += `
    <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
    <li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
  return paginationHTML;
}

function setPagination(productCount, activeIndex){
  document.querySelector('.pagination').innerHTML = genPagination(productCount, activeIndex);
}

function setProducts(batchNumber){
  document.querySelector('.products-container').innerHTML = loadProducts(batchNumber);
  document.querySelector('.pagination').innerHTML = genPagination(displayProducts.length, batchNumber);
}

function searchButton(){
  let searchQuery = document.querySelector('.searchBox').value.toLowerCase();
  let searchCat = document.getElementById("cat-list").value.toLowerCase();
  searchProducts(searchCat, searchQuery)
}

function searchProducts(searchCat, searchQuery){
  displayProducts = [];
  if ( searchCat === "all" ){
    displayProducts = searchProductName(searchQuery);
  }
  else {
    if( searchQuery === ""){
      // if empty return all products in category
      products.forEach(product => {
        if (product.category.toLowerCase().replace("-"," ").includes(searchCat.toLowerCase())){
            displayProducts.push(product);
        }
      });
    } else {
      // search matching text in category
      products.forEach(product => {
        if (product.category.toLowerCase().includes(searchCat.toLowerCase())){
          if (product.name.toLowerCase().includes(searchQuery.toLowerCase())){
            displayProducts.push(product);
          }
        }
      });
    }
  }
  setPagination(displayProducts.length,1);
  setProducts(1);
}

function main(){
  displayProducts = products;
  itemsPerPage = 12;

  // Load Cart from localstorage
  loadCart();

  loadSession();
  // check if user directed to search
  if(session.searchCat.toLowerCase() != 'all' || session.searchQuery != ''){
    document.getElementById("cat-list").value = session.searchCat;
    document.querySelector('.searchBox').value = session.searchQuery;
    searchProducts(session.searchCat, session.searchQuery)
  }

  setPagination(displayProducts.length, 1);
  setProducts(1);

  setCartQuantity();
}

main();