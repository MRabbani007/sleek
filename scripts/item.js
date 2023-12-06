  let product;

  // Array to hold all properties from variants of product
  let properties = []
  // properties = [{
  //   propertyName: '',
  //   values: []
  // }]

  function addProperty(propName,propertyValue){
    // if properties is empty push first property
    if (properties.length === 0){
      properties.push({
        propertyName: propName,
        values: new Set()
      })
      propertyValue.forEach(value =>{
        if(Object.prototype.toString.call(value) === '[object Array]'){
          properties[0].values.add(value[0])
          // value.forEach(valueItem => {
          //   properties[0].values.add(valueItem)
          // })
        } else {
          properties[0].values.add(value)
        }
      })
      return true;
    }
    // else find property object in array
    let notfound = true;
    for(let i=0; i<properties.length; i++){
      if (properties[i].propertyName === propName){
        propertyValue.forEach(value =>{
          if(Object.prototype.toString.call(value) === '[object Array]'){
            properties[i].values.add(value[0])
            // value.forEach(valueItem => {
            //   properties[i].values.add(valueItem)
            // })
          } else {
            properties[i].values.add(value)
          }
        })
        notfound = false
        return true
      }
    }
    // if this property is not found add new property
    if(notfound){
      properties.push({
        propertyName: propName,
        values: new Set()
      })
      propertyValue.forEach(value =>{
        if(Object.prototype.toString.call(value) === '[object Array]'){
          properties[properties.length-1].values.add(value[0])
          // value.forEach(valueItem => {
          //   properties[properties.length-1].values.add(valueItem)
          // })
        } else {
          properties[properties.length-1].values.add(value)
        }
      })
      return true
    }
    // if not added return false
    return false
  }

// generate HTML to display 1 product item
function generateItemHTML(productID){
  // below will check if product is found
  let productIndex = getProductsNewIndex(productID);
  // if product not found in list
  if(productIndex === null || productIndex < 0){
    productIndex = 0; // display first item
  } 
  product = productsNew[productIndex];

  // Collect properties from all variants
  if(product.hasOwnProperty('variants')){
    product.variants.forEach(variant => {
      // iterate on array of properties
      variant.forEach(property => {
        addProperty(property.prop,property.value)
      })
    })
  }

  // pass 'image'
  let variantProp = product.variants[0][findProp(productIndex,'image')].prop;
  // pass first image value
  let variantValue = product.variants[0][findProp(productIndex,'image')].value[0][0];

  // Generate HTML for left Images
  const {imageHTML,imgExpanded} = genThumbnailHTML(productIndex, variantProp, variantValue)
  let productProps = [];

  // Generate HTML for item properties
  product.variants[0].forEach(property => {
    if(property.prop === 'size'){
      productProps.push({
        property: 'size',
        displayType: 'list',
        value: genListHTML(productIndex,0)
      })
    } else if (property.prop === 'style'){
      productProps.push({
        property: 'style',
        displayType: 'block',
        value: genBlockHTML(productIndex,1)
      })
    } else if (property.prop === 'color'){
      productProps.push({
        property: 'color',
        displayType: 'block',
        value: genMapHTML(productIndex,findProp(productIndex,'color'),findProp(productIndex,'image'),0)
      })
    }
  })
  // const sizeHTML = genListHTML(productIndex,0)
  // const styleHTML = genBlockHTML(productIndex,1);
  // const mapHTML = genMapHTML(productIndex,2,3,0);
  
  let aboutHTML = '';
  product.about.forEach(about => {
    aboutHTML +=`
    <li>${about}</li>
    `;
  })

  let propertiesHTML = ``;
  for(let i=0; i<productProps.length; i++){
    switch(productProps[i].displayType){
      case 'list': 
        propertiesHTML += `
          <div class="my-3">
            <h6>${productProps[i].property}</h6>
            <select class="w-25 ${productProps[i].property}-menu" onchange="selectedChange(${productIndex},'${productProps[i].property}')">${productProps[i].value}</select>
          </div>
        `;
        break;
      case 'block': 
        propertiesHTML += `
          <div class="my-3">
            <h6>${productProps[i].property}</h6>
            <div class="${productProps[i].property}-cont">${productProps[i].value}</div>
          </div>
        `;
        break;
        default:
          propertiesHTML += ``;
    }
  }

  let productHTML = `
  <div class="container-fluid">
  <div class="row">
    <!-- Product Images -->
    <div class="col-lg-4">
      <div class="row justify-content-center">
        <!-- thumbnails -->
        <div class="col-3 img-thumbs-cont">${imageHTML}</div>
        <!-- Expanded Image -->
        <div class="col">
          <img class="img-expanded" src="${imgExpanded}" alt="">
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <!-- Product Name -->
          <p class="fs-4">${product.name}</p>
          <!-- Manufacturer/ Brand/ Supplier -->
          <p>Visit the ${product.supplier}</p>
          <div class="d-flex align-center">
            <span class="mx-2">${product.rating.stars}</span>
            <span class="rating">${genRatings(product.rating.stars)}</span>
            <!--
            <img class="img-ratings" src='${getRatingsImage(product.rating.stars)}'>
            -->
            <span class="mx-2">${product.rating.count} Ratings</span>
            <span class="mx-2">${product.reviews} Reviews</span>
          </div>
        </div>
        <div class="card-body">
          <div class="price">
            <small class="price-currency">$</small>
            <div class="price-int">${Math.floor(product.priceCents/100)}</div>
            <div class="price cents">${product.priceCents-Math.floor((product.priceCents/100))*100}</div>
          </div>
          <!-- Shipping Availability --> 
          <p>Ships to Kazakhstan</p>

          <h4>Product Options</h4>
          ${propertiesHTML}

          <h5>About this item</h5>
          <ul>${aboutHTML}</ul>
        </div>
      </div>
    </div>

    <!-- Summary & Checkout -->
    <div class="col-lg-2">
      <div class="card p-2">
        <div class="price my-3">
          <small class="price-currency">$</small>
          <div class="price-int">${Math.floor(product.priceCents/100)}</div>
          <div class="price cents">${product.priceCents-Math.floor((product.priceCents/100))*100}</div>
        </div>
        <p>Ships to Kazakhstan</p>
        <p>No Import Fees &</p>
        <p>$${(calcShipping(product.priceCents,product.itemWeight,'USA','KAZAKHSTAN')/100).toFixed(2)} Shipping</p>
        <div class="btn btn-warning my-3" onclick="addToCart('${product.id}')">Add to Cart</div>
        <div class="btn btn-warning my-3"><a href="./cart.html">Checkout</a></div>
      </div>
    </div>
  </div>
</div>
  `;  
  return productHTML;
}

function getRatingsImage(rating){
  switch(rating*10){
    case 0:
      return "../images/ratings/rating-0.png";
    case 5:
      return "../images/ratings/rating-05.png";
    case 10:
      return "../images/ratings/rating-10.png";
    case 15:
      return "../images/ratings/rating-15.png";
    case 20:
      return "../images/ratings/rating-20.png";
    case 25:
      return "../images/ratings/rating-25.png";
    case 30:
      return "../images/ratings/rating-30.png";
    case 35:
      return "../images/ratings/rating-35.png";
    case 40:
      return "../images/ratings/rating-40.png";
    case 45:
      return "../images/ratings/rating-45.png";
    case 50:
      return "../images/ratings/rating-50.png";
    default:
      return "";
  }
}

function displayImage(image){
 document.querySelector('.img-expanded').src = image;
}

// get index of selected variant
function getSelectedIndex(productIndex, selected){
  let len = productsNew[productIndex].variants.length
  for(let i=0; i<len; i++){
    if (productsNew[productIndex].variants[i].size === selected){
      return i;
    }
  };
  return -1;
}

function selectedChange(productIndex, changedProperty){
  // fixbug property
  let propertyValue = document.querySelector(`.${changedProperty}-menu`).value;
  let variant = productsNew[productIndex].variants
  let selectedVariantIndex = -1;
  for(let i=0;i<variant.length;i++){
    if (variant[i][0].value[0] === propertyValue){
      selectedVariantIndex = i;
    }
  }
  try{
    document.querySelector('.style-cont').innerHTML = genBlockHTML(productIndex, findProp(productIndex, 'style'), selectedVariantIndex)
  } catch {
  }
  try{
    document.querySelector('.color-cont').innerHTML = genMapHTML(productIndex,findProp(productIndex, 'color'),findProp(productIndex, 'image'), selectedVariantIndex)
  } catch {
  }
}

function genListHTML(productIndex, propertyIndex, selected=''){
  let listHTML = '';
  properties[propertyIndex].values.forEach((property) => {
    if(property === selected){
      listHTML +=`
        <option value="${property}" selected>${property}</option>
      `;
    } else {
      listHTML +=`
        <option value="${property}">${property}</option>
      `;
    }
  })
  return listHTML;
}

function genBlockHTML(productIndex, propertyIndex, selectedVariantIndex = 0){
  let blockHTML = ''

  let selectedVariant = productsNew[productIndex].variants[selectedVariantIndex]
  // find index of property in selected variant 
  let variantPropIndex = -1;
  selectedVariant.forEach((varianProp, index) => {
    if(varianProp.prop === properties[propertyIndex].propertyName){
      variantPropIndex = index;
    }
  })

  properties[propertyIndex].values.forEach((propertyValue)=>{
    if(selectedVariant[variantPropIndex].value.includes(propertyValue)){
      blockHTML += `
        <div class="item-colors item-colors-available" data-value="${propertyValue}" title="${propertyValue}" onclick="">${propertyValue}</div>
      `;
    } else {
      blockHTML += `
        <div class="item-colors" data-value="${propertyValue}" title="${propertyValue}" onclick="">${propertyValue}</div>
      `;
    }
  })
  return blockHTML;
}

function genMapHTML(productIndex,firstProp,secondProp, selectedVariantIndex = 0){
  let mapHTML = ``;

  let selectedVariant = productsNew[productIndex].variants[selectedVariantIndex]
  // find index of property in selected variant 
  let variantPropIndex = -1;
  selectedVariant.forEach((variantProp, index) => {
    if(variantProp.prop === properties[firstProp].propertyName){
      variantPropIndex = index;
    }
  })

  let propertyValue = [...properties[firstProp].values]
  for(let i=0; i< propertyValue.length; i++){
    let secondPropValue = [...properties[secondProp].values][i];
    let imageHTML = '';
    // in the case of second property is an image, render image block
    if(properties[secondProp].propertyName === 'image'){
      imageHTML = `<img class="variants-thumb" src="../images/products/${secondPropValue}">`
    } else {
      imageHTML = secondPropValue;
    }

    if(selectedVariant[variantPropIndex].value.includes(propertyValue[i])){
      mapHTML += `
        <div class="item-colors item-colors-available" data-value="${propertyValue[i]}" title="${propertyValue[i]}" onclick="changeThumbs(${productIndex},'${secondPropValue}')">${imageHTML}</div>
      `;
    } else {
      mapHTML += `
        <div class="item-colors" data-value="${propertyValue[i]}" title="${propertyValue[i]}" onclick="">${imageHTML}</div>
      `;
    }
  }

  return mapHTML;
}

function findProp(productIndex, propertyName){
  let variant = productsNew[productIndex].variants[0]
  for(let i=0; i<variant.length; i++){
    if (variant[i].prop === propertyName){
      return i;
    }
  }
  return -1;
}

function findVariant(productIndex,propName,propValue){
  let variants = productsNew[productIndex].variants;
  let variantIndex = -1;
  let propIndex = -1;
  let valueIndex = -1;

  // Loop through all variants
  for(let i=0; i<variants.length; i++){
    // Loop through properties of each variant
    for(let j=0; j<variants[i].length; j++){
      if(variants[i][j].prop === propName){
        let temp = -1;
        // check if property values is array
        if(Object.prototype.toString.call(variants[i][j].value) === '[object Array]'){
          // loop in array of values
          for(let k=0; k<variants[i][j].value.length; k++ ){
            temp = variants[i][j].value[k].indexOf(propValue);
            if (temp >= 0){
              variantIndex = i; 
              propIndex = j; 
              valueIndex = k;
              return {variantIndex, propIndex, valueIndex};
            }
          }
        } else {
          temp = variants[i][j].value.indexOf(propValue)
          if (temp >= 0){
            variantIndex = i; 
            propIndex = j; 
            valueIndex = k;
            return {variantIndex, propIndex, valueIndex};
          }
        }
      }
    }
  }
  return {variantIndex, propIndex, valueIndex};
}

function changeThumbs(productIndex,searchImage){
  let {imageHTML,imgExpanded} = genThumbnailHTML(productIndex,'image',searchImage);
  document.querySelector('.img-thumbs-cont').innerHTML = imageHTML;
  document.querySelector('.img-expanded').src = imgExpanded;
}

function genThumbnailHTML(productIndex, propName, propValue){
  // Generate Image HTML
  let imageHTML = '';
  let {variantIndex, propIndex, valueIndex} = findVariant(productIndex, propName, propValue);
  let product = productsNew[productIndex];
  product.variants[variantIndex][propIndex].value[valueIndex].forEach(image => {
    imageHTML += `
    <img class="img-thumbnails" src="../images/products/${image}" onmouseover="displayImage('../images/products/${image}')" alt="">
    `;
  })
  const imgExpanded = `../images/products/${product.variants[variantIndex][propIndex].value[valueIndex][0]}`;
  return {imageHTML,imgExpanded};
}

function addToCart(productid){
  let quantity = 1;
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

// Related Items Carousel
// Track Carousel Offset
let x = 0;
// Calculate Item Width
let width = 0;
// Move Carousel to Right
function carouselRight(){
  let items = document.querySelectorAll('.item');
  itemsCount = items.length;
  const carWidth = document.querySelector('.MultiCarousel-inner').getBoundingClientRect().width;
  if(itemsCount-2 > x){
  items.forEach(item => {
    width = item.getBoundingClientRect().width;
    item.style.transform = `translate(-${(x+1)*width}px,0)`;
  })
    x++
  }
}
// Move Carousel to Left
function carouselLeft(){
  if(x>0){
    document.querySelectorAll('.item').forEach(item => {
      width = item.getBoundingClientRect().width;
      item.style.transform = `translate(-${(x-1)*width}px,0)`;
    })
    x--
  }
}
// Load Carousel Items
const carouselHTML = loadCarouselProducts(1);
document.querySelector('.MultiCarousel-inner').innerHTML = carouselHTML;

loadSession();
loadCart();
setCartQuantity();

// session.item = '83d4ca15-0f35-48f5-b7a3-1ea210004f2e'

// Load clicked item
let itemHTML = generateItemHTML(session.item);
document.querySelector('.item-container').innerHTML = itemHTML;