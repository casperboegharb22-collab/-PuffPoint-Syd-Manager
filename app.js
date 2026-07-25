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
  profitElement.textContent = "0 kr.";
}

updateDashboard();
