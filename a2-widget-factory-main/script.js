//IDs for all the address fields
let address_details = ['address', 'city', 'state', 'zip'];

//bottombar hide and reveal
function updateBottomBar() {
  const bottomBar = document.querySelector('.bottom-bar');
  const totalQuantity = Object.keys(widgets).reduce((sum, widget) => {
    return sum + Number(sessionStorage.getItem(widgets[widget].quantity_id) || 0);
  }, 0);

  displayValueInElement('total_quantity', totalQuantity + ' Widgets');

  if (totalQuantity > 0) {
    bottomBar.classList.add('visible');
  } else {
    bottomBar.classList.remove('visible');
  }
}

//populate cart tray
function populateTray() {
  const trayContent = document.querySelector('.cart-tray-content');
  trayContent.innerHTML = '';

  Object.keys(widgets).forEach((widget) => {
    const quantity = Number(sessionStorage.getItem(widgets[widget].quantity_id) || 0);

    if (quantity > 0) {
      const color = sessionStorage.getItem(widgets[widget].color_id) || '';
      const subtotal = (quantity * widgets[widget].price).toFixed(2);

      const item = document.createElement('div');
      item.classList.add('summary-item');
      item.innerHTML = `
        <div class="item-details">
          <div class="item-quantity"><h2>${quantity}x</h2></div>
          <div class="item-specs">
            <p class="item-name">${widgets[widget].name}</p>
            <p class="item-color">Color: #${color}</p>
          </div>
        </div>
        <div class="item-price">$${subtotal}</div>
      `;
      trayContent.appendChild(item);
    }
  });
}

function saveWidgetOrder() {
    //Loop over all of the widgets
    Object.keys(widgets).forEach((widget) => {
        //Get the element which contains the quantity to purchase
        let quantity_id = widgets[widget].quantity_id;
        let el = document.getElementById(quantity_id);
        if(el) {
            //Store the value of the quantity
            sessionStorage.setItem(quantity_id, el.value);
        }
        //Get the element which contains the color of the widget
        let color_id = widgets[widget].color_id;
        el = document.getElementById(color_id);
        if(el) {
            //Depending on the type of input used, color may have a "color" or a "value" field
            if(el.color) {
                sessionStorage.setItem(color_id, el.color);
            } else if(el.value) {
                sessionStorage.setItem(color_id, el.value);
            }
        }
    });
    updateBottomBar();
}

document.addEventListener('DOMContentLoaded', () => {
  updateBottomBar();
});

function saveShippingOptions() {
    // Depending on the type of input used, shipping speed may have a "value" or a "selected" field to indicate which speed to use
    let el = document.getElementById('shipping_speed');
    let shippingSpeed = undefined;
    if(el && el.value) {
        shippingSpeed = el.value;
    } else if(el && el.selected) {
        shippingSpeed = el.selected;
    }
    if(shippingSpeed) {
        sessionStorage.setItem('shipping_speed', shippingSpeed);
    }
    //Loop over the rest of the address details to get the ids, and store those values
    address_details.forEach((id) => {
        el = document.getElementById(id);
        if(el) {
            //Store the value of the quantity
            sessionStorage.setItem(id, el.value);
        }
    });
}

function displayValueInElement(elementId, value) {
    let el = document.getElementById(elementId);
    if(el) {
        el.innerText = value;
    }
}

function loadOrderInfo() {
    let totalCost = 0;
    let totalQuantity = 0;
    //Load the values back into their respective ids
    Object.keys(sessionStorage).forEach((key) => {
        displayValueInElement(key, sessionStorage.getItem(key));
    });
    Object.keys(widgets).forEach((widget) => {
        let el = document.getElementById(widgets[widget].color_id);
        if(el) {
            el.setAttribute('color', '#' + sessionStorage.getItem(widgets[widget].color_id));
        }
    });
    let shipmentType = sessionStorage.getItem('shipping_speed');
    if(shipmentType) {
        //Calculate how long it will take for the package to arrive
        let shipmentDate = new Date();
        shipmentDate.setDate(shipmentDate.getDate() + shipping[shipmentType]['duration']);
        displayValueInElement("arrival_date", shipmentDate.toLocaleDateString());
        let shippingCost = shipping[shipmentType]['price'];
        displayValueInElement("shipping_subtotal", '$' + shippingCost.toFixed(2));
        //Add to total cost
        totalCost += shippingCost;
    }
    //Calculate subtotals and total cost
    Object.keys(widgets).forEach((widget) => {
        //Get the quantity and convert it to a number
        let quantity = Number(sessionStorage.getItem(widgets[widget]["quantity_id"]));
        totalQuantity += quantity;
        let subtotal = quantity * widgets[widget]['price'];
        //Quantity already got set in the prior forEach, so this loop can just set the subtotal
        displayValueInElement(widgets[widget]["subtotal_id"], '$' + subtotal.toFixed(2));
        totalCost += subtotal;
    });
    displayValueInElement('total_quantity', totalQuantity);
    displayValueInElement('total_cost', '$' + totalCost.toFixed(2));
}

function navigateTo(destination, timeout=0) {
    if(timeout <= 0) {
        //Go to the desired page
        window.location.href=destination;
    }
    else {
        //Generate a spinner
        if(document.getElementById('loading_progress')) {
            document.getElementById('loading_progress').removeAttribute('hidden');
            //Open the spinner
            document.getElementById('loading_progress').setAttribute('open', '');
        }
        setTimeout(() => {
            window.location.href=destination;    
        }, timeout);
    }
}

function loadOrderPage() {
    //No need to do anything, but the function exists in case it's need to be extended
}

function loadShippingPage() {
    //No need to do anything, but the function exists in case it's need to be extended
}

function loadSummaryPage() {
    loadOrderInfo();
}

function gotoShippingPage() {
    saveWidgetOrder();
    navigateTo('shipping.html');
}

function gotoSummaryPage() {
    saveShippingOptions();
    navigateTo('summary.html', 2000);
}

function gotoOrderPage() {
  navigateTo('index.html');
}