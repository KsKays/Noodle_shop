const cart = {};

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay();
  });
});

function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;

  // Create a table
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Product", "Quantity", "Price", "Total", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");

    const productNameCell = document.createElement("td");
    productNameCell.textContent = `${productId}`;
    tr.appendChild(productNameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    tr.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price}`;
    tr.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `$${itemTotalPrice}`;
    tr.appendChild(totalCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("btn", "btn-danger", "delete-product");
    deleteButton.setAttribute("data-product-id", productId);
    deleteButton.addEventListener("click", () => {
      delete cart[productId];
      updateCartDisplay();
    });
    actionsCell.appendChild(deleteButton);
    tr.appendChild(actionsCell);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
    cartElement.appendChild(totalPriceElement);
  }
}

document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Thank you!", generateCartReceipt());
});

// document
//   .getElementById("printProductReceipts")
//   .addEventListener("click", () => {
//     printReceipt("Product Receipts", generateProductReceipts());
//   });

function printReceipt(title, content) {
  const printWindow = window.open("1", "_blank");
  printWindow.document.write(
    `<html><head><title>${title}</title></head><body>${content}</body></html>`
  );
  printWindow.document.close();
  printWindow.print();
}

function generateCartReceipt() {
  let receiptContent = "<h2>Cart Receipt</h2>";

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `<p>Product ${productId}: ${item.quantity} x $${item.price} = $${itemTotalPrice}</p>`;
  }

  const totalPrice = Object.keys(cart).length > 0 ? calculateTotalPrice() : 0;
  receiptContent += `<p>Total Price: $${totalPrice}</p>`;

  return receiptContent;
}

function generateProductReceipts() {
  let receiptContent = "<h2>Product Receipts</h2>";

  document.querySelectorAll(".product").forEach((product, index) => {
    const productName = product.querySelector("h3").textContent;
    const productPrice = parseFloat(
      product.querySelector(".add-to-cart").getAttribute("data-price")
    );

    receiptContent += `<p>${productName} - $${productPrice}</p>`;
  });

  return receiptContent;
}

function calculateTotalPrice() {
  return Object.values(cart).reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
}

function generateCartReceipt() {
  let receiptContent = `
      <style>
        @page {
          size: 80mm 80mm;
        }
        body {
          width: 80mm;
          height: 80mm;
          margin: 0;
          padding: 10px;
          font-family: Arial, sans-serif;
        }
        h2 {
          text-align: center;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
      <h2>Cart Receipt</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;

  let totalPrice = 0;

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `
        <tr>
          <td>${productId}</td>
          <td>${item.quantity}</td>
          <td>$${item.price}</td>
          <td>$${itemTotalPrice}</td>
        </tr>`;

    totalPrice += itemTotalPrice;
  }

  receiptContent += `
        </tbody>
      </table>
      <p>Total Price: $${totalPrice}</p>`;

  return receiptContent;
}
