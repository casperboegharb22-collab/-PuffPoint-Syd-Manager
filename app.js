const products = [
  {
    name: "Blue Razz Ice / Strawberry Watermelon Bubble Gum",
    stock: 0
  },
  {
    name: "Blueberry Ice / Love 66",
    stock: 0
  },
  {
    name: "Strawberry Watermelon / Grape Ice",
    stock: 0
  },
  {
    name: "Lemon Lime / Lush Ice",
    stock: 0
  }
,
{
  name: "Love 66 / Sour Apple",
  stock: 0
},
{
  name: "Mixed Berries / Watermelon Ice",
  stock: 0
},
{
  name: "Peach Ice / Blueberry Ice",
  stock: 0
},
{
  name: "Strawberry Kiwi / Blueberry Sour Raspberry",
  stock: 0
},
{

  name: "Summer Dream / Strawberry Banana",
  stock: 0
}
  ];
const stockElement = document.getElementById("stock");
const bestSellerElement = document.getElementById("bestSeller");
const restockElement = document.getElementById("restock");
const profitElement = document.getElementById("profit");

function updateDashboard() {
  let totalStock = 0;

  products.forEach(product => {
    totalStock += product.stock;
  });

  stockElement.textContent = totalStock;
  bestSellerElement.textContent = "-";
  restockElement.textContent = "Ingen";
  profitElement.textContent = profit + " kr.";
}

updateDashboard();
const inventorySection = document.getElementById("inventory");

function renderInventory() {
  inventorySection.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${product.name}</h2>
      <p>Lager: ${product.stock}</p>
      <button onclick="addStock(${index})">+1</button>
      <button onclick="removeStock(${index})">-1</button>
      <button onclick="sellProduct(${index})">Sælg</button>
    `;

    inventorySection.appendChild(card);
  });
}
function addStock(index) {
  products[index].stock++;
  renderInventory();
  updateDashboard();
  saveData();
}

function removeStock(index) {
  if (products[index].stock > 0) {
    products[index].stock--;
    saveData();
  }

  renderInventory();
  updateDashboard();
  saveData();
}

renderInventory();
let revenue = 0;
let profit = 0;

function sellProduct(index) {
  if (products[index].stock <= 0) {
    alert("Ingen varer på lager!");
    return;
  }

  products[index].stock--;

  revenue += 150;
  profit += (150 - 72);

  document.getElementById("revenue").textContent = revenue + " kr.";
  document.getElementById("profit").textContent = profit + " kr.";

  renderInventory();
  updateDashboard();
  saveData();
}
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("revenue", revenue);
  localStorage.setItem("profit", profit);
}

function loadData() {
  const savedProducts = localStorage.getItem("products");
  const savedRevenue = localStorage.getItem("revenue");
  const savedProfit = localStorage.getItem("profit");

  if (savedProducts) {
    const loadedProducts = JSON.parse(savedProducts);

    loadedProducts.forEach((item, index) => {
      products[index].stock = item.stock;
    });
  }

  if (savedRevenue) revenue = Number(savedRevenue);
  if (savedProfit) profit = Number(savedProfit);

  renderInventory();
  updateDashboard();
}
loadData();
