loadCart();
setCartQuantity();

// departments array for offcanvas
let departments = [
  {
    type: "disabled",
    value: "Electronics",
    text: "Electronics",
  },
  {
    type: "active",
    value: "computers",
    text: "Computers",
  },
  {
    type: "disabled",
    value: "Smart Home",
    text: "Smart Home",
  },
  {
    type: "disabled",
    value: "Arts & Crafts",
    text: "Arts & Crafts",
  },
  {
    type: "disabled",
    value: "Beauty & Perrsonal Care",
    text: "Beauty & Perrsonal Care",
  },
  {
    type: "active",
    value: "fashion",
    text: "Fashion",
  },
  {
    type: "active",
    value: "Health & Household",
    text: "Health & Household",
  },
  {
    type: "active",
    value: "Home & Kitchen",
    text: "Home & Kitchen",
  },
  {
    type: "disabled",
    value: "Industrial & Scientific",
    text: "Industrial & Scientific",
  },
  {
    type: "active",
    value: "Sports & Outdoors",
    text: "Sports & Outdoors",
  },
];

function openCat(cat) {
  session.searchCat = cat;
  saveSession();
  window.location.replace("./views/store.html");
}

function genOffCanvas() {
  let offcanvasHTMl = "";
  departments.forEach((dep) => {
    if (dep.type === "active") {
      offcanvasHTMl += `
      <h6 class="offcanvas-link px-3 py-1 m-0" onclick="redirect('store','index','${dep.value}')">${dep.text}</h6>
    `;
    } else if (dep.type === "disabled") {
      offcanvasHTMl += `
      <h6 class="px-3 py-1 m-0 text-secondary">${dep.text}</h6>
    `;
    }
  });
  return offcanvasHTMl;

  // <div class="offcanvas-link d-flex justify-content-between p-1">
  //   <h6>Electronics</h6>
  //   <h6>&gt</h6>
  // </div>
}

document.querySelector(".departments").innerHTML = genOffCanvas();
