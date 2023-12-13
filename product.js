async function fetchData() {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448"
    );
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function populateProductDetails(product) {
  const productImage = document.getElementById("productImage");
  productImage.src = product.images[0].src;

  const thumbnailsContainer = document.getElementById("thumbnails");
  thumbnailsContainer.innerHTML = "";

  product.images.forEach((image, index) => {
    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.classList.add("thumbnail");
    thumbnailContainer.onclick = () => changeMainImage(image.src);

    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = image.src;
    thumbnailImage.alt = `Thumbnail ${index + 1}`;

    thumbnailContainer.appendChild(thumbnailImage);
    thumbnailsContainer.appendChild(thumbnailContainer);
  });

  document.getElementById("productVendor").innerText = product.vendor;
  document.getElementById("productTitle").innerText = product.title;
  document.getElementById("price").innerText = product.price;
  document.getElementById("compare-price").innerText = product.compare_at_price;

  const colorButtonsContainer = document.getElementById("colorButtons");
  colorButtonsContainer.innerHTML = "";
  product.options
    .find((option) => option.name === "Color")
    .values.forEach((color) => {
      const colorButton = document.createElement("div");
      colorButton.classList.add("color-button");
      colorButton.style.backgroundColor = Object.values(color)[0];
      colorButton.onclick = () =>
        selectColor(colorButton, Object.keys(color)[0]);

      colorButtonsContainer.appendChild(colorButton);
    });

  const sizeRadioButtonsContainer = document.getElementById("sizeRadioButtons");
  sizeRadioButtonsContainer.innerHTML = "";
  product.options
    .find((option) => option.name === "Size")
    .values.forEach((size) => {
      const sizeRadioButton = document.createElement("div");
      sizeRadioButton.classList.add("size-radio-button");
      sizeRadioButton.textContent = size;
      sizeRadioButton.onclick = () => selectSize(sizeRadioButton, size);

      sizeRadioButtonsContainer.appendChild(sizeRadioButton);
    });

  document.getElementById("productDescription").innerHTML = product.description;

  calculatePercentageOff();
}

function selectColor(selectedButton, selectedColor) {
  const colorButtons = document.querySelectorAll(".color-button");
  colorButtons.forEach((button) => {
    button.classList.remove("selected-color");
  });

  selectedButton.classList.add("selected-color");

  calculatePercentageOff();
}

function selectSize(selectedButton, selectedSize) {
  const sizeButtons = document.querySelectorAll(".size-radio-button");
  sizeButtons.forEach((button) => {
    button.classList.remove("selected-size");
  });

  selectedButton.classList.add("selected-size");

  calculatePercentageOff();
}

function calculatePercentageOff() {
  const price = parseFloat(document.getElementById("price").innerText.slice(1));
  const comparePrice = parseFloat(
    document.getElementById("compare-price").innerText.slice(1)
  );
  const percentageOff = ((comparePrice - price) / comparePrice) * 100;

  document.getElementById(
    "percentageOff"
  ).innerText = `Save ${percentageOff.toFixed(2)}% off`;
}

async function init() {
  const product = await fetchData();
  populateProductDetails(product);
}

init();

function changeMainImage(newSrc) {
  document.getElementById("productImage").src = newSrc;
}

function incrementQuantity() {
  const quantityInput = document.getElementById("quantity");
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decrementQuantity() {
  const quantityInput = document.getElementById("quantity");
  if (parseInt(quantityInput.value) > 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
}

function addToCart() {
  const selectedColor = document.querySelector(".selected-color");
  const selectedSize = document.querySelector(".selected-size").textContent;
  const quantity = document.getElementById("quantity").value;

  const productName = document.getElementById("productTitle").innerText;

  const message = `Added to cart: ${quantity} x ${
    selectedColor.textContent
  } ${selectedSize} of ${productName} at $${
    document.getElementById("price").innerText
  } each.`;

  document.getElementById("add-to-cart-message").innerText = message;
  document.getElementById("add-to-cart-message").style.display = "block";
}
