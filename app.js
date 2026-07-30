// =====================================
// PUFFPOINT SYD MANAGER V3
// Version 3.0
// =====================================

// ---------- Standard produkter ----------

let products = [

{
    id:1,
    name:"Blue Razz Ice",
    stock:0,
    sold:0,
    buyPrice:70,
    sellPrice:150
},

{
    id:2,
    name:"Strawberry Kiwi",
    stock:0,
    sold:0,
    buyPrice:70,
    sellPrice:150
},

{
    id:3,
    name:"Watermelon Ice",
    stock:0,
    sold:0,
    buyPrice:70,
    sellPrice:150
},

{
    id:4,
    name:"Cherry Ice",
    stock:0,
    sold:0,
    buyPrice:70,
    sellPrice:150
},

{
    id:5,
    name:"Blueberry Sour Raspberry",
    stock:0,
    sold:0,
    buyPrice:70,
    sellPrice:150
},

{
    id:6,
    name:"Fresh Mint",
    stock:0,
    sold:0,
    buyPrice:70,
    sellPrice:150
}

];


// ---------- Statistik ----------

let revenue = 0;
let profit = 0;
let soldTotal = 0;

let purchaseHistory = [];


// ---------- LocalStorage ----------

function saveData(){

localStorage.setItem("pps_products",JSON.stringify(products));
localStorage.setItem("pps_revenue",revenue);
localStorage.setItem("pps_profit",profit);
localStorage.setItem("pps_sold",soldTotal);
localStorage.setItem("pps_history",JSON.stringify(purchaseHistory));

}

function loadData(){

const savedProducts=localStorage.getItem("pps_products");
const savedRevenue=localStorage.getItem("pps_revenue");
const savedProfit=localStorage.getItem("pps_profit");
const savedSold=localStorage.getItem("pps_sold");
const savedHistory=localStorage.getItem("pps_history");

if(savedProducts){

products=JSON.parse(savedProducts);

}

if(savedRevenue){

revenue=Number(savedRevenue);

}

if(savedProfit){

profit=Number(savedProfit);

}

if(savedSold){

soldTotal=Number(savedSold);

}

if(savedHistory){

purchaseHistory=JSON.parse(savedHistory);

}

}



// ---------- Navigation ----------

const pages=document.querySelectorAll(".page");
const navButtons=document.querySelectorAll(".bottom-nav button");

function showPage(page){

pages.forEach(p=>p.classList.remove("active"));

document.getElementById(page).classList.add("active");

navButtons.forEach(btn=>{

btn.classList.remove("active");

if(btn.dataset.page===page){

btn.classList.add("active");

}

});
if(page==="dashboard"){
    updateDashboard();
}

if(page==="lager"){
    renderProducts();
}

if(page==="indkob"){
    renderPurchaseList();
}

if(page==="statistik"){
    updateStatistics();
}

if(page==="settings"){
    renderSettings();
}
}

navButtons.forEach(button=>{

button.addEventListener("click",()=>{

showPage(button.dataset.page);

});

});

loadData();
// =====================================
// LAGER
// =====================================

function getStockColor(stock){

    if(stock <= 4){
        return "#ff4d4f";
    }

    if(stock <= 9){
        return "#faad14";
    }

    return "#18c964";

}

function renderProducts(){

    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    products.forEach(product=>{

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <h3>${product.name}</h3>

        <p>
        Lager:
        <strong style="color:${getStockColor(product.stock)}">
        ${product.stock} stk.
        </strong>
        </p>

        <button onclick="addStock(${product.id})">
        ➕ Tilføj varer
        </button>

        <button onclick="sellProduct(${product.id})">
        ➖ Sælg
        </button>

        `;

        productList.appendChild(card);

    });

}

function addStock(id){

    const product = products.find(p=>p.id===id);

    let amount = prompt("Hvor mange varer vil du tilføje?");

    if(amount===null) return;

    amount = Number(amount);

    if(isNaN(amount) || amount<=0) return;

    product.stock += amount;

    purchaseHistory.unshift({

        product:product.name,
        amount:amount,
        date:new Date().toLocaleString("da-DK")

    });

    saveData();

    renderProducts();

    renderPurchaseList();

    updateDashboard();

    updateStatistics();

}

function sellProduct(id){

    const product = products.find(p=>p.id===id);

    let amount = prompt("Hvor mange er solgt?");

    if(amount===null) return;

    amount = Number(amount);

    if(isNaN(amount) || amount<=0) return;

    if(amount>product.stock){

        alert("Der er ikke nok på lager.");

        return;

    }

    product.stock -= amount;

    product.sold += amount;

    soldTotal += amount;

    revenue += amount * product.sellPrice;

    profit += amount * (product.sellPrice-product.buyPrice);

    saveData();

    renderProducts();

    renderPurchaseList();

    updateDashboard();

    updateStatistics();

}
// =====================================
// DASHBOARD
// =====================================

function updateDashboard(){

    // Omsætning
    document.getElementById("revenue").textContent =
        revenue.toLocaleString("da-DK") + " kr.";

    // Profit
    document.getElementById("profit").textContent =
        profit.toLocaleString("da-DK") + " kr.";

    // Samlet lager
    let totalStock = 0;

    products.forEach(product => {

        totalStock += product.stock;

    });

    document.getElementById("stock").textContent =
        totalStock + " stk.";

    // Top 3 Bestseller

    const top3 = document.getElementById("top3");

    top3.innerHTML = "";

    const best = [...products]
        .sort((a,b)=>b.sold-a.sold)
        .slice(0,3);

    best.forEach((product,index)=>{

        const div=document.createElement("div");

        div.className="card";

        div.innerHTML=`
            <strong>${index+1}. ${product.name}</strong><br>
            Solgt: ${product.sold} stk.
        `;

        top3.appendChild(div);

    });

    // Genbestil

    const reorder=document.getElementById("reorderList");

    reorder.innerHTML="";

    const lowStock=products.filter(p=>p.stock<=5);

    if(lowStock.length===0){

        reorder.innerHTML="<p>✅ Ingen varer skal genbestilles.</p>";

    }else{

        lowStock.forEach(product=>{

            const div=document.createElement("div");

            div.className="card";

            div.style.cursor="pointer";

            div.innerHTML=`
                <strong>${product.name}</strong><br>
                Kun ${product.stock} stk. tilbage
            `;

            div.onclick=()=>{

                showPage("indkob");

            };

            reorder.appendChild(div);

        });

    }

}
// =====================================
// INDKØB
// =====================================

function renderPurchaseList(){

    const purchaseList = document.getElementById("purchaseList");
    const purchaseHistoryDiv = document.getElementById("purchaseHistory");

    purchaseList.innerHTML = "";
    purchaseHistoryDiv.innerHTML = "";

    products.forEach(product=>{

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>På lager: <strong>${product.stock} stk.</strong></p>
            <button onclick="addStock(${product.id})">
                📦 Tilføj varer
            </button>
        `;

        purchaseList.appendChild(card);

    });

    if(purchaseHistory.length===0){

        purchaseHistoryDiv.innerHTML =
        "<p>Ingen indkøb registreret endnu.</p>";

        return;

    }

    purchaseHistory.forEach(item=>{

        const row=document.createElement("div");

        row.className="card";

        row.innerHTML=`
            <strong>${item.product}</strong><br>
            +${item.amount} stk.<br>
            <small>${item.date}</small>
        `;

        purchaseHistoryDiv.appendChild(row);

    });

}
// =====================================
// STATISTIK
// =====================================

function updateStatistics(){

    document.getElementById("statsRevenue").textContent =
        revenue.toLocaleString("da-DK") + " kr.";

    document.getElementById("statsProfit").textContent =
        profit.toLocaleString("da-DK") + " kr.";

    document.getElementById("statsSold").textContent =
        soldTotal + " stk.";

    const bestSeller=document.getElementById("bestSeller");

    const best=[...products].sort((a,b)=>b.sold-a.sold)[0];

    if(best && best.sold>0){

        bestSeller.textContent =
        best.name + " (" + best.sold + " stk.)";

    }else{

        bestSeller.textContent =
        "Ingen salg endnu";

    }

}
// =====================================
// INDSTILLINGER
// =====================================

function renderSettings(){

    const settings=document.getElementById("settingsContent");

    settings.innerHTML=`

    <div class="card">
        <button onclick="createProduct()">
            ➕ Tilføj ny smag
        </button>
    </div>

    <div id="productSettings"></div>

    <div class="card">
        <button onclick="resetStock()">
            ♻️ Nulstil lager
        </button>
    </div>

    <div class="card">
        <button onclick="resetStatistics()">
            📊 Nulstil statistik
        </button>
    </div>

    <div class="card">
        <button onclick="resetEverything()">
            ❌ Nulstil hele appen
        </button>
    </div>

    `;

    const productSettings=document.getElementById("productSettings");

    products.forEach(product=>{

        productSettings.innerHTML+=`

        <div class="card">

        <h3>${product.name}</h3>

        <button onclick="renameProduct(${product.id})">
        ✏️ Rediger navn
        </button>

        <button onclick="changeSellPrice(${product.id})">
        💰 Salgspris (${product.sellPrice} kr.)
        </button>

        <button onclick="changeBuyPrice(${product.id})">
        💵 Kostpris (${product.buyPrice} kr.)
        </button>

        <button onclick="deleteProduct(${product.id})">
        🗑️ Slet
        </button>

        </div>

        `;

    });

}
function createProduct(){

    const name=prompt("Navn på ny smag");

    if(!name) return;

    const sell=Number(prompt("Salgspris"));

    const buy=Number(prompt("Kostpris"));

    products.push({

        id:Date.now(),
        name:name,
        stock:0,
        sold:0,
        sellPrice:sell,
        buyPrice:buy

    });

    saveData();

    renderProducts();
    renderPurchaseList();
    renderSettings();
    updateDashboard();
    updateStatistics();

}
function renameProduct(id){

    const product=products.find(p=>p.id===id);

    const name=prompt("Nyt navn",product.name);

    if(!name) return;

    product.name=name;

    saveData();

    renderProducts();
    renderPurchaseList();
    renderSettings();
    updateDashboard();

}

function changeSellPrice(id){

    const product=products.find(p=>p.id===id);

    const price=Number(prompt("Ny salgspris",product.sellPrice));

    if(isNaN(price)) return;

    product.sellPrice=price;

    saveData();

    renderSettings();

}

function changeBuyPrice(id){

    const product=products.find(p=>p.id===id);

    const price=Number(prompt("Ny kostpris",product.buyPrice));

    if(isNaN(price)) return;

    product.buyPrice=price;

    saveData();

    renderSettings();

}
function deleteProduct(id){

    if(!confirm("Slet denne smag?")) return;

    products=products.filter(p=>p.id!==id);

    saveData();

    renderProducts();
    renderPurchaseList();
    renderSettings();
    updateDashboard();
    updateStatistics();

}

function resetStock(){

    if(!confirm("Nulstil lager?")) return;

    products.forEach(product=>{

        product.stock=0;

    });

    saveData();

    renderProducts();
    renderPurchaseList();
    updateDashboard();

}

function resetStatistics(){

    if(!confirm("Nulstil statistik?")) return;

    revenue=0;
    profit=0;
    soldTotal=0;

    products.forEach(product=>{

        product.sold=0;

    });

    saveData();

    updateDashboard();
    updateStatistics();

}

function resetEverything(){

    if(!confirm("Slet ALT?")) return;

    localStorage.clear();

    location.reload();

}
// =====================================
// INITIALISERING
// =====================================

// Start på dashboard
showPage("dashboard");

// Første indlæsning
renderProducts();
renderPurchaseList();
renderSettings();
updateDashboard();
updateStatistics();

// Gem automatisk når siden lukkes
window.addEventListener("beforeunload", () => {
    saveData();
});
