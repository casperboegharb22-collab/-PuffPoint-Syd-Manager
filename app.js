const SALE_PRICE = 150;
const COST_PRICE = 72;

let revenue = 0;
let profit = 0;

const products = [
  {
    name: "Blue Razz Ice / Strawberry Watermelon Bubble Gum",
    stock: 0,
    sold: 0
  },
  {
    name: "Blueberry Ice / Love 66",
    stock: 0,
    sold: 0
  },
  {
    name: "Strawberry Watermelon / Grape Ice",
    stock: 0,
    sold: 0
  },
  {
    name: "Lemon Lime / Lush Ice",
    stock: 0,
    sold: 0
  },
  {
    name: "Love 66 / Sour Apple",
    stock: 0,
    sold: 0
  },
  {
    name: "Mixed Berries / Watermelon Ice",
    stock: 0,
    sold: 0
  },
  {
    name: "Peach Ice / Blueberry Ice",
    stock: 0,
    sold: 0
  },
  {
    name: "Strawberry Kiwi / Blueberry Sour Raspberry",
    stock: 0,
    sold: 0
  },
  {
    name: "Summer Dream / Strawberry Banana",
    stock: 0,
    sold: 0
  }
];

const stockElement = document.getElementById("stock");
const bestSellerElement = document.getElementById("bestSeller");
const restockElement = document.getElementById("restock");
const profitElement = document.getElementById("profit");
const revenueElement = document.getElementById("revenue");
const inventorySection = document.getElementById("inventory");
function updateDashboard() {
  let totalStock = 0;
  let bestSeller = "-";
  let bestSold = 0;
  let restock = [];

  products.forEach(product => {
    totalStock += product.stock;

    if (product.sold > bestSold) {
      bestSold = product.sold;
      bestSeller = product.name;
    }

    if (product.stock <= 3) {
      restock.push(product.name);
    }
  });

  stockElement.textContent = totalStock;
  revenueElement.textContent = revenue + " kr.";
  profitElement.textContent = profit + " kr.";
  bestSellerElement.textContent = bestSeller;
  restockElement.textContent =
    restock.length ? restock.join(", ") : "Ingen";
}

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
  saveData();
  renderInventory();
  updateDashboard();
}

function removeStock(index) {
  if (products[index].stock > 0) {
    products[index].stock--;
  }

  saveData();
  renderInventory();
  updateDashboard();
}
function sellProduct(index) {
  if (products[index].stock <= 0) {
    alert("Ingen varer på lager!");
    return;
  }

  products[index].stock--;
  products[index].sold++;

  revenue += SALE_PRICE;
  profit += (SALE_PRICE - COST_PRICE);

  saveData();
  renderInventory();
  updateDashboard();
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

  if (savedProducts !== null) {
    const loaded = JSON.parse(savedProducts);

    loaded.forEach((item, index) => {
      products[index].stock = item.stock;
      products[index].sold = item.sold || 0;
    });
  }

  if (savedRevenue !== null) {
    revenue = Number(savedRevenue);
  }

  if (savedProfit !== null) {
    profit = Number(savedProfit);
  }

  renderInventory();
  updateDashboard();
}

loadData();
// Start appen
renderInventory();
updateDashboard();
