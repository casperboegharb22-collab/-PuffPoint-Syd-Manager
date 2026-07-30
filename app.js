/* ==========================================================
   PUFFPOINT SYD MANAGER V3
   DEL 1 - GRUNDLAG
========================================================== */

const STORAGE_KEY = "puffpoint_manager_v3";

/* ---------- Standard data ---------- */

const defaultData = {

    products: [],

    purchases: [],

    sales: [],

    settings: {

        lowStock: 10

    }

};

/* ---------- Hent data ---------- */

let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!data) {

    data = structuredClone(defaultData);

    saveData();

}

/* ---------- Gem ---------- */

function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

/* ---------- Hjælpefunktioner ---------- */

function $(id) {

    return document.getElementById(id);

}

function money(value) {

    return Number(value).toLocaleString("da-DK", {

        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    }) + " kr.";

}

/* ---------- Navigation ---------- */

const pages = document.querySelectorAll(".page");

const navButtons = document.querySelectorAll(".bottom-nav button");

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });

    navButtons.forEach(button => {

        button.classList.remove("active");

    });

    $(pageId).classList.add("active");

    document
        .querySelector(`[data-page="${pageId}"]`)
        .classList.add("active");

    refreshAll();

}

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});

/* ---------- Opdater hele app ---------- */

function refreshAll() {

    renderDashboard();

    renderProducts();

    renderPurchases();

    renderStatistics();

    renderSettings();

}

/* ---------- Start ---------- */

document.addEventListener("DOMContentLoaded", () => {

    showPage("dashboard");

});
/* ==========================================================
   DEL 2 - DASHBOARD
========================================================== */

function renderDashboard() {

    let revenue = 0;
    let profit = 0;
    let stock = 0;

    data.sales.forEach(sale => {

        revenue += sale.total;
        profit += sale.profit;

    });

    data.products.forEach(product => {

        stock += Number(product.stock);

    });

    if ($("revenue")) {

        $("revenue").textContent = money(revenue);

    }

    if ($("profit")) {

        $("profit").textContent = money(profit);

    }

    if ($("stock")) {

        $("stock").textContent = stock + " stk.";

    }

    renderTop3();

    renderReorder();

}

/* ---------- Top 3 ---------- */

function renderTop3() {

    const container = $("top3");

    if (!container) return;

    container.innerHTML = "";

    if (data.sales.length === 0) {

        container.innerHTML = `
            <div class="list-item">
                Ingen salg endnu.
            </div>
        `;

        return;

    }

    const salesMap = {};

    data.sales.forEach(sale => {

        if (!salesMap[sale.product]) {

            salesMap[sale.product] = 0;

        }

        salesMap[sale.product] += sale.quantity;

    });

    const topProducts = Object.entries(salesMap)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,3);

    const medals = ["🥇","🥈","🥉"];

    topProducts.forEach((item,index)=>{

        container.innerHTML += `

            <div class="list-item">

                <strong>${medals[index]} ${item[0]}</strong>

                <span>${item[1]} stk.</span>

            </div>

        `;

    });

}

/* ---------- Genbestilling ---------- */

function renderReorder() {

    const container = $("reorderList");

    if (!container) return;

    container.innerHTML = "";

    const lowProducts = data.products.filter(product =>

        Number(product.stock) <= data.settings.lowStock

    );

    if (lowProducts.length === 0) {

        container.innerHTML = `
            <div class="list-item">
                ✅ Alt ser fint ud.
            </div>
        `;

        return;

    }

    lowProducts.forEach(product=>{

        container.innerHTML += `

            <div class="list-item">

                <strong>${product.name}</strong>

                <span>${product.stock} stk.</span>

            </div>

        `;

    });

}
/* ==========================================================
   DEL 3 - LAGER
========================================================== */

function renderProducts() {

    const container = $("productList");

    if (!container) return;

    container.innerHTML = "";

    if (data.products.length === 0) {

        container.innerHTML = `
            <div class="card">
                Ingen produkter endnu.
            </div>
        `;

        return;

    }

    data.products.forEach((product, index) => {

        const status =
            Number(product.stock) <= data.settings.lowStock
                ? "🔴 Lav lager"
                : "🟢 På lager";

        container.innerHTML += `
            <div class="product-card">

                <h3>${product.name}</h3>

                <p><strong>Lager:</strong> ${product.stock} stk.</p>

                <p><strong>Indkøb:</strong> ${money(product.purchasePrice)}</p>

                <p><strong>Salgspris:</strong> ${money(product.salePrice)}</p>

                <p>${status}</p>

                <div class="product-buttons">

                    <button onclick="editProduct(${index})">
                        Rediger
                    </button>

                    <button onclick="deleteProduct(${index})">
                        Slet
                    </button>

                </div>

            </div>
        `;

    });

}

/* ---------- Tilføj produkt ---------- */

function addProduct() {

    const name = prompt("Produktnavn");

    if (!name) return;

    const purchasePrice = Number(prompt("Indkøbspris"));

    if (isNaN(purchasePrice)) return;

    const salePrice = Number(prompt("Salgspris"));

    if (isNaN(salePrice)) return;

    const stock = Number(prompt("Start lager"));

    if (isNaN(stock)) return;

    data.products.push({

        name,

        purchasePrice,

        salePrice,

        stock

    });

    saveData();

    refreshAll();

}

/* ---------- Rediger ---------- */

function editProduct(index) {

    const product = data.products[index];

    const name = prompt("Produktnavn", product.name);

    if (!name) return;

    const purchasePrice = Number(
        prompt("Indkøbspris", product.purchasePrice)
    );

    const salePrice = Number(
        prompt("Salgspris", product.salePrice)
    );

    const stock = Number(
        prompt("Lager", product.stock)
    );

    product.name = name;
    product.purchasePrice = purchasePrice;
    product.salePrice = salePrice;
    product.stock = stock;

    saveData();

    refreshAll();

}

/* ---------- Slet ---------- */

function deleteProduct(index) {

    if (!confirm("Slet produkt?")) return;

    data.products.splice(index, 1);

    saveData();

    refreshAll();

}
/* ==========================================================
   DEL 4 - INDKØB & SALG
========================================================== */

function renderPurchases() {

    const container = $("purchaseList");
    const history = $("purchaseHistory");

    if (!container || !history) return;

    container.innerHTML = "";
    history.innerHTML = "";

    if (data.products.length === 0) {

        container.innerHTML = `
            <div class="card">
                Ingen produkter oprettet.
            </div>
        `;

        return;

    }

    data.products.forEach((product, index) => {

        container.innerHTML += `
            <div class="product-card">

                <h3>${product.name}</h3>

                <p>Lager: ${product.stock} stk.</p>

                <button onclick="buyStock(${index})">
                    Køb lager
                </button>

                <button onclick="sellProduct(${index})">
                    Registrer salg
                </button>

            </div>
        `;

    });

    if (data.purchases.length === 0) {

        history.innerHTML = `
            <div class="card">
                Ingen historik endnu.
            </div>
        `;

        return;

    }

    [...data.purchases].reverse().forEach(item => {

        history.innerHTML += `
            <div class="card">
                <strong>${item.type}</strong><br>
                ${item.product}<br>
                ${item.quantity} stk.
            </div>
        `;

    });

}

/* ---------- Køb lager ---------- */

function buyStock(index) {

    const quantity = Number(prompt("Antal købt"));

    if (!quantity || quantity <= 0) return;

    data.products[index].stock += quantity;

    data.purchases.push({

        type: "Indkøb",
        product: data.products[index].name,
        quantity

    });

    saveData();

    refreshAll();

}

/* ---------- Registrer salg ---------- */

function sellProduct(index) {

    const quantity = Number(prompt("Antal solgt"));

    if (!quantity || quantity <= 0) return;

    if (quantity > data.products[index].stock) {

        alert("Ikke nok på lager.");

        return;

    }

    data.products[index].stock -= quantity;

    const revenue = quantity * data.products[index].salePrice;

    const cost = quantity * data.products[index].purchasePrice;

    data.sales.push({

        product: data.products[index].name,
        quantity,
        total: revenue,
        profit: revenue - cost

    });

    data.purchases.push({

        type: "Salg",
        product: data.products[index].name,
        quantity

    });

    saveData();

    refreshAll();

}
/* ==========================================================
   DEL 5 - STATISTIK
========================================================== */

function renderStatistics() {

    if (!$("statsRevenue")) return;

    let revenue = 0;
    let profit = 0;
    let sold = 0;

    data.sales.forEach(sale => {

        revenue += sale.total;
        profit += sale.profit;
        sold += sale.quantity;

    });

    $("statsRevenue").textContent = money(revenue);
    $("statsProfit").textContent = money(profit);
    $("statsSold").textContent = sold + " stk.";

    renderBestSeller();

}

/* ---------- Bestseller ---------- */

function renderBestSeller() {

    const container = $("bestSeller");

    if (!container) return;

    container.innerHTML = "";

    if (data.sales.length === 0) {

        container.innerHTML = `
            <div class="card">
                Ingen salg endnu.
            </div>
        `;

        return;

    }

    const counter = {};

    data.sales.forEach(sale => {

        if (!counter[sale.product]) {

            counter[sale.product] = 0;

        }

        counter[sale.product] += sale.quantity;

    });

    const sorted = Object.entries(counter)

        .sort((a, b) => b[1] - a[1]);

    sorted.forEach((item, index) => {

        container.innerHTML += `

            <div class="card">

                <strong>#${index + 1}</strong><br>

                ${item[0]}<br>

                Solgt: ${item[1]} stk.

            </div>

        `;

    });

}
/* ==========================================================
   DEL 6 - INDSTILLINGER
========================================================== */

function renderSettings() {

    const container = $("settingsContent");

    if (!container) return;

    container.innerHTML = `

        <div class="card">

            <h3>Lav lager grænse</h3>

            <p>Nuværende: <strong>${data.settings.lowStock}</strong> stk.</p>

            <button onclick="changeLowStock()">
                Rediger
            </button>

        </div>

        <div class="card">

            <h3>Sikkerhed</h3>

            <button onclick="resetAllData()">
                Nulstil alle data
            </button>

        </div>

    `;

}

/* ---------- Lav lager ---------- */

function changeLowStock() {

    const value = Number(

        prompt(

            "Ny grænse",

            data.settings.lowStock

        )

    );

    if (isNaN(value) || value < 0) return;

    data.settings.lowStock = value;

    saveData();

    refreshAll();

}

/* ---------- Nulstil ---------- */

function resetAllData() {

    if (!confirm("Er du sikker? Alle data slettes.")) return;

    localStorage.removeItem(STORAGE_KEY);

    data = structuredClone(defaultData);

    saveData();

    refreshAll();

}
