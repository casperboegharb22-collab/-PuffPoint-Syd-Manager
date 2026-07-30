/* ==================================================
   PUFFPOINT SYD MANAGER V4
   APP.JS
   DEL 1
================================================== */

// ---------- Storage ----------

const STORAGE_KEY = "puffpoint_data_v4";

// ---------- Standard data ----------

const defaultData = {
    products: [],
    purchases: [],
    revenue: 0,
    profit: 0,
    sold: 0
};

// ---------- Hent data ----------

let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!data) {
    data = structuredClone(defaultData);
    saveData();
}

// ---------- Gem ----------

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ---------- Navigation ----------

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".bottom-nav button");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;

        pages.forEach(p => p.classList.remove("active"));

        document
            .getElementById(page)
            .classList.add("active");

        navButtons.forEach(b => b.classList.remove("active"));

        button.classList.add("active");

    });

});

// Marker dashboard som aktiv

navButtons[0].classList.add("active");

// ---------- Formatter ----------

function money(value) {
    return Number(value).toLocaleString("da-DK") + " kr.";
}

// ---------- Beregn lager ----------

function totalStock() {

    return data.products.reduce((sum, product) => {

        return sum + product.stock;

    }, 0);

}

// ---------- Bestseller ----------

function getBestSeller() {

    if (data.products.length === 0) return "Ingen salg endnu";

    const sorted = [...data.products]
        .sort((a, b) => b.sold - a.sold);

    if (!sorted[0] || sorted[0].sold === 0)
        return "Ingen salg endnu";

    return sorted[0].name;

}

// ---------- Initialisering ----------

updateDashboard();
renderProducts();
renderPurchases();
renderSettings();
updateStatistics();
/* ==================================================
   APP.JS
   DEL 2 - Dashboard & Statistik
================================================== */

function updateDashboard() {

    document.getElementById("revenue").textContent =
        money(data.revenue);

    document.getElementById("profit").textContent =
        money(data.profit);

    document.getElementById("stock").textContent =
        totalStock() + " stk.";

    document.getElementById("statsRevenue").textContent =
        money(data.revenue);

    document.getElementById("statsProfit").textContent =
        money(data.profit);

    document.getElementById("statsSold").textContent =
        data.sold + " stk.";

    document.getElementById("bestSeller").textContent =
        getBestSeller();

    renderTop3();

    renderReorder();
}

function updateStatistics() {

    document.getElementById("statsRevenue").textContent =
        money(data.revenue);

    document.getElementById("statsProfit").textContent =
        money(data.profit);

    document.getElementById("statsSold").textContent =
        data.sold + " stk.";

    document.getElementById("bestSeller").textContent =
        getBestSeller();

}

function renderTop3() {

    const container = document.getElementById("top3");

    container.innerHTML = "";

    const list = [...data.products]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 3);

    if (list.length === 0) {

        container.innerHTML =
            '<div class="empty-state"><h3>Ingen produkter</h3></div>';

        return;
    }

    list.forEach((product, index) => {

        container.innerHTML += `
            <div class="list-item">
                <strong>#${index + 1} ${product.name}</strong>
                <span>${product.sold} solgt</span>
            </div>
        `;

    });

}

function renderReorder() {

    const container = document.getElementById("reorderList");

    container.innerHTML = "";

    const lowStock = data.products.filter(product => product.stock <= 10);

    if (lowStock.length === 0) {

        container.innerHTML =
            '<div class="empty-state"><h3>Alt ser godt ud 👍</h3></div>';

        return;
    }

    lowStock.forEach(product => {

        container.innerHTML += `
            <div class="list-item">
                <strong>${product.name}</strong>
                <span>${product.stock} stk.</span>
            </div>
        `;

    });

}
/* ==================================================
   APP.JS
   DEL 3 - Lager
================================================== */

function renderProducts() {

    const container = document.getElementById("productList");

    container.innerHTML = "";

    if (data.products.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Ingen produkter endnu</h3>
                <p>Tryk på knappen nedenfor for at oprette det første produkt.</p>
            </div>
        `;

    } else {

        data.products.forEach((product, index) => {

            let stockClass = "stock-good";

            if (product.stock <= 10) {
                stockClass = "stock-low";
            } else if (product.stock <= 25) {
                stockClass = "stock-medium";
            }

            container.innerHTML += `
                <div class="product-card fade-in">

                    <div class="product-header">

                        <div>
                            <div class="product-name">${product.name}</div>

                            <div class="product-stock ${stockClass}">
                                Lager: ${product.stock} stk.
                            </div>

                        </div>

                    </div>

                    <div class="product-actions">

                        <button class="btn-add"
                            onclick="changeStock(${index},1)">
                            +1
                        </button>

                        <button class="btn-remove"
                            onclick="changeStock(${index},-1)">
                            -1
                        </button>

                    </div>

                </div>
            `;

        });

    }

    container.innerHTML += `
        <button class="add-product" onclick="addProduct()">
            + Opret nyt produkt
        </button>
    `;

}

function addProduct() {

    const name = prompt("Produktnavn");

    if (!name) return;

    const purchasePrice = Number(prompt("Indkøbspris pr. stk."));

    if (isNaN(purchasePrice)) return;

    const salePrice = Number(prompt("Salgspris pr. stk."));

    if (isNaN(salePrice)) return;

    const stock = Number(prompt("Startlager"));

    if (isNaN(stock)) return;

    data.products.push({

        name,

        purchasePrice,

        salePrice,

        stock,

        sold: 0

    });

    saveData();

    renderProducts();

    updateDashboard();

}

function changeStock(index, amount) {

    data.products[index].stock += amount;

    if (data.products[index].stock < 0) {
        data.products[index].stock = 0;
    }

    saveData();

    renderProducts();

    updateDashboard();

}
/* ==================================================
   APP.JS
   DEL 4 - Indkøb & Historik
================================================== */

function renderPurchases() {

    const purchaseList = document.getElementById("purchaseList");
    const history = document.getElementById("purchaseHistory");

    purchaseList.innerHTML = "";
    history.innerHTML = "";

    if (data.products.length === 0) {

        purchaseList.innerHTML = `
            <div class="empty-state">
                <h3>Ingen produkter</h3>
                <p>Opret et produkt først.</p>
            </div>
        `;

    } else {

        purchaseList.innerHTML = `
            <div class="purchase-card">

                <h3>Registrer indkøb</h3>

                <select id="purchaseProduct">
                    ${data.products.map((p, i) =>
                        `<option value="${i}">${p.name}</option>`
                    ).join("")}
                </select>

                <input
                    type="number"
                    id="purchaseAmount"
                    placeholder="Antal"
                    min="1"
                >

                <button class="purchase-btn"
                    onclick="registerPurchase()">
                    Registrer indkøb
                </button>

            </div>
        `;

    }

    if (data.purchases.length === 0) {

        history.innerHTML = `
            <div class="empty-state">
                <h3>Ingen historik</h3>
            </div>
        `;

        return;
    }

    [...data.purchases]
        .reverse()
        .forEach(item => {

            history.innerHTML += `
                <div class="history-item">

                    <div class="history-left">
                        <div class="history-product">
                            ${item.name}
                        </div>

                        <div class="history-date">
                            ${item.date}
                        </div>
                    </div>

                    <div class="history-right">

                        <div class="history-amount">
                            +${item.amount} stk.
                        </div>

                        <div class="history-price">
                            ${money(item.total)}
                        </div>

                    </div>

                </div>
            `;

        });

}

function registerPurchase() {

    const productIndex =
        Number(document.getElementById("purchaseProduct").value);

    const amount =
        Number(document.getElementById("purchaseAmount").value);

    if (!amount || amount <= 0) return;

    const product = data.products[productIndex];

    product.stock += amount;

    data.purchases.push({

        name: product.name,

        amount,

        total: amount * product.purchasePrice,

        date: new Date().toLocaleDateString("da-DK")

    });

    saveData();

    renderPurchases();

    renderProducts();

    updateDashboard();

}
/* ==================================================
   APP.JS
   DEL 5 - Indstillinger
================================================== */

function renderSettings() {

    const container = document.getElementById("settingsContent");

    container.innerHTML = `
        <div class="settings-container">

            <div class="settings-card">
                <h3>📦 Antal produkter</h3>
                <p>${data.products.length} produkter oprettet</p>
            </div>

            <div class="settings-card">
                <h3>📜 Indkøbshistorik</h3>
                <p>${data.purchases.length} registreringer</p>
            </div>

            <div class="settings-card">
                <h3>💾 Gemte data</h3>

                <button class="settings-btn secondary"
                    onclick="exportData()">
                    Eksporter data
                </button>

                <button class="settings-btn danger"
                    onclick="resetData()">
                    Nulstil alle data
                </button>

            </div>

            <div class="version-box">
                PuffPoint Syd Manager V4
            </div>

        </div>
    `;

}

function exportData() {

    const file = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(file);

    const a = document.createElement("a");

    a.href = url;
    a.download = "puffpoint-backup.json";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

}

function resetData() {

    const ok = confirm(
        "Er du sikker på, at du vil slette alle data?"
    );

    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    data = structuredClone(defaultData);

    saveData();

    renderProducts();
    renderPurchases();
    renderSettings();
    updateDashboard();
    updateStatistics();

}
/* ==================================================
   APP.JS
   DEL 6 - Afslutning
================================================== */

// ---------- Opdater alt ----------

function refreshApp() {
    saveData();
    renderProducts();
    renderPurchases();
    renderSettings();
    updateDashboard();
    updateStatistics();
}

// ---------- Genopbyg visninger ----------

refreshApp();

// ---------- Gør funktioner globale ----------

window.addProduct = addProduct;
window.changeStock = changeStock;
window.registerPurchase = registerPurchase;
window.exportData = exportData;
window.resetData = resetData;

// ---------- Service Worker ----------

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .catch(err => console.log("Service Worker:", err));
    });
}

console.log("✅ PuffPoint Syd Manager V4 startet");
