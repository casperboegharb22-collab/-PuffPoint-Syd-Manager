/* =====================================================
   PUFFPOINT SYD MANAGER V3
   DEL 1 - GRUNDLAG
===================================================== */

const STORAGE_KEY = "puffpoint-manager";

/* ---------- Data ---------- */

let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!data) {

    data = {

        products: [],
        purchases: [],
        sales: [],

        settings: {

            lowStock: 10

        }

    };

    saveData();

}

/* ---------- Gem ---------- */

function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

/* ---------- Hjælpefunktion ---------- */

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

    document.getElementById(pageId).classList.add("active");

    document.querySelector(

        `[data-page="${pageId}"]`

    ).classList.add("active");

    refreshPage(pageId);

}

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});

/* ---------- Opdater sider ---------- */

function refreshPage(page) {

    switch(page){

        case "dashboard":

            renderDashboard();

            break;

        case "lager":

            renderProducts();

            break;

        case "indkob":

            renderPurchases();

            break;

        case "statistik":

            renderStatistics();

            break;

        case "settings":

            renderSettings();

            break;

    }

}

/* ---------- Start ---------- */

document.addEventListener("DOMContentLoaded", () => {

    showPage("dashboard");

});
/* =====================================================
   DEL 2 - DASHBOARD
===================================================== */

function renderDashboard() {

    let revenue = 0;
    let profit = 0;
    let totalStock = 0;

    data.sales.forEach(sale => {

        revenue += sale.total;
        profit += sale.profit;

    });

    data.products.forEach(product => {

        totalStock += product.stock;

    });

    $("revenue").textContent = money(revenue);
    $("profit").textContent = money(profit);
    $("stock").textContent = totalStock + " stk.";

    renderTop3();
    renderReorder();

}

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

    const sold = {};

    data.sales.forEach(sale => {

        sold[sale.product] =
            (sold[sale.product] || 0) + sale.quantity;

    });

    const topProducts = Object.entries(sold)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 3);

    topProducts.forEach(([name, amount], index) => {

        const medal = ["🥇", "🥈", "🥉"][index];

        container.innerHTML += `

            <div class="list-item">

                <strong>${medal} ${name}</strong>

                <span>${amount} stk.</span>

            </div>

        `;

    });

}

function renderReorder() {

    const container = $("reorderList");

    if (!container) return;

    container.innerHTML = "";

    const lowProducts = data.products.filter(product =>

        product.stock <= data.settings.lowStock

    );

    if (lowProducts.length === 0) {

        container.innerHTML = `

            <div class="list-item">

                ✅ Lageret ser godt ud.

            </div>

        `;

        return;

    }

    lowProducts.forEach(product => {

        container.innerHTML += `

            <div class="list-item">

                <strong>${product.name}</strong>

                <span>${product.stock} stk.</span>

            </div>

        `;

    });

}
/* =====================================================
   DEL 3 - LAGER
===================================================== */

let searchFilter = "";
let sortBy = "name";

function renderProducts() {

    const container = $("productList");

    if (!container) return;

    let products = [...data.products];

    if (searchFilter !== "") {

        products = products.filter(product =>
            product.name.toLowerCase().includes(searchFilter.toLowerCase())
        );

    }

    switch (sortBy) {

        case "stockLow":
            products.sort((a, b) => a.stock - b.stock);
            break;

        case "stockHigh":
            products.sort((a, b) => b.stock - a.stock);
            break;

        default:
            products.sort((a, b) => a.name.localeCompare(b.name));

    }

    container.innerHTML = "";

    container.innerHTML += `

        <div class="card">

            <input
                id="searchProduct"
                placeholder="🔍 Søg produkt..."
                oninput="searchProducts(this.value)">

            <select onchange="changeSort(this.value)">

                <option value="name">A-Å</option>
                <option value="stockHigh">Mest lager</option>
                <option value="stockLow">Mindst lager</option>

            </select>

            <button class="add-product"
                onclick="showAddProduct()">

                ➕ Tilføj produkt

            </button>

        </div>

    `;

    if (products.length === 0) {

        container.innerHTML += `

            <div class="card">

                <h3>Ingen produkter endnu</h3>

                <p>Tryk på "Tilføj produkt".</p>

            </div>

        `;

        return;

    }

    products.forEach(product => {

        let status = "🟢";

        if (product.stock <= data.settings.lowStock) {

            status = "🔴";

        } else if (product.stock <= data.settings.lowStock * 2) {

            status = "🟡";

        }

        container.innerHTML += `

            <div class="product-card">

                <div class="product-header">

                    <div>

                        <div class="product-name">

                            ${product.name}

                        </div>

                        <div class="product-stock">

                            ${status} ${product.stock} stk.

                        </div>

                    </div>

                </div>

                <div class="product-actions">

                    <button
                        class="btn-add"
                        onclick="addStock('${product.name}')">

                        + Lager

                    </button>

                    <button
                        class="btn-remove"
                        onclick="removeStock('${product.name}')">

                        - Lager

                    </button>

                </div>

            </div>

        `;

    });

}

function searchProducts(value) {

    searchFilter = value;

    renderProducts();

}

function changeSort(value) {

    sortBy = value;

    renderProducts();

}

function addStock(name) {

    const product = data.products.find(p => p.name === name);

    if (!product) return;

    product.stock++;

    saveData();

    renderProducts();
    renderDashboard();
    renderStatistics();

}

function removeStock(name) {

    const product = data.products.find(p => p.name === name);

    if (!product) return;

    if (product.stock > 0) {

        product.stock--;

    }

    saveData();

    renderProducts();
    renderDashboard();
    renderStatistics();

}

function showAddProduct() {

    const name = prompt("Produktnavn:");

    if (!name) return;

    const stock = Number(prompt("Antal på lager:") || 0);

    const costPrice = Number(prompt("Indkøbspris:") || 0);

    const salePrice = Number(prompt("Salgspris:") || 0);

    data.products.push({

        name,
        stock,
        costPrice,
        salePrice

    });

    saveData();

    renderProducts();
    renderDashboard();
    renderStatistics();

}
