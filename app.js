const STORAGE_KEY = "puffpoint_syd_manager";

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    revenue: 0,
    profit: 0,
    products: [],
    flavors: []
};

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatPrice(value) {
    return value.toLocaleString("da-DK") + " kr.";
}
function showPage(pageId){

    document.querySelectorAll(".page").forEach(page=>{
        page.style.display="none";
        page.classList.remove("active");
    });

    const currentPage = document.getElementById(pageId);

    if(currentPage){
        currentPage.style.display="block";
        currentPage.classList.add("active");
    }

    document.querySelectorAll(".nav-btn").forEach(btn=>{
        btn.classList.remove("active");
    });

    const currentButton = document.querySelector(`[data-page="${pageId}"]`);

    if(currentButton){
        currentButton.classList.add("active");
    }

}

document.querySelectorAll(".nav-btn").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});

function updateDashboard(){

    document.getElementById("revenue").textContent =
        formatPrice(data.revenue);

    document.getElementById("profit").textContent =
        formatPrice(data.profit);

    let stock = 0;
    let totalSold = 0;

    data.products.forEach(product => {

        stock += product.stock;
        totalSold += product.sold;
});
    document.getElementById("stock").textContent =
        stock + " stk.";

    document.getElementById("totalSold").textContent =
        totalSold + " stk.";
}

updateDashboard();
saveData();
/* ==========================
   DEL 4 - PRODUKTER
========================== */

function renderProducts() {

    const list = document.getElementById("productList");

    list.innerHTML = "";

    if (data.products.length === 0) {

        list.innerHTML = "<p>Ingen produkter endnu.</p>";

        return;

    }

    data.products.forEach((product, index) => {

        let status = "";

        if(product.stock <= product.minStock){

            status = "critical";

        }else if(product.stock <= product.minStock + 5){

            status = "low";

        }

        list.innerHTML += `

        <div class="product-card ${status}">

            <div class="product-top">

                <div>

                    <div class="product-name">${product.name}</div>

                    <div class="product-flavor">${product.flavor}</div>

                </div>

                <strong>${product.stock} stk.</strong>

            </div>

            <div class="product-info">

                <div class="info-box">
                    Salg<br>${product.salePrice} kr.
                </div>

                <div class="info-box">
                    Køb<br>${product.purchasePrice} kr.
                </div>

                <div class="info-box">
                    Solgt<br>${product.sold}
                </div>

            </div>

            <div class="product-actions">

                <button class="sell-btn" onclick="sellProduct(${index})">
                    Sælg
                </button>

                <button class="edit-btn" onclick="editProduct(${index})">
                    Rediger
                </button>

                <button class="delete-btn" onclick="deleteProduct(${index})">
                    Slet
                </button>

            </div>

        </div>

        `;

    });

}

document.getElementById("addProductBtn").onclick = function(){

    const name = prompt("Produktnavn");

    if(!name) return;

    let flavor = "";

if (data.flavors.length === 0) {
    alert("Du skal først oprette en smag under Indstillinger.");
    return;
}

    const purchasePrice = Number(prompt("Indkøbspris"));

    const salePrice = Number(prompt("Salgspris"));

    const stock = Number(prompt("Lager"));

    const minStock = Number(prompt("Advarsel ved antal"));
let options = "";

data.flavors.forEach((item, index) => {
    options += `${index + 1}. ${item}\n`;
});

const choice = Number(prompt("Vælg en smag:\n\n" + options));

if (
    isNaN(choice) ||
    choice < 1 ||
    choice > data.flavors.length
) {
    return;
}

flavor = data.flavors[choice - 1];
    data.products.push({

        name,

        flavor,

        purchasePrice,

        salePrice,

        stock,

        minStock,

        sold:0

    });

    saveData();

    updateDashboard();

    renderProducts();

};

renderProducts();
/* ==========================
   DEL 5 - SALG & DASHBOARD
========================== */

function sellProduct(index){

    const product = data.products[index];

    if(product.stock <= 0){
        alert("Ikke flere på lager.");
        return;
    }

    const amount = Number(prompt("Antal solgt", 1));

    if(!amount || amount <= 0) return;

    if(amount > product.stock){
        alert("Der er ikke så mange på lager.");
        return;
    }

    product.stock -= amount;
    product.sold += amount;

    data.revenue += amount * product.salePrice;
    data.profit += amount * (product.salePrice - product.purchasePrice);

    saveData();
    updateDashboard();
    renderProducts();
    renderTopProducts();
    renderLowStock();

}

function deleteProduct(index){

    if(!confirm("Vil du slette produktet?")) return;

    data.products.splice(index,1);

    saveData();
    updateDashboard();
    renderProducts();
    renderTopProducts();
    renderLowStock();

}

function editProduct(index){

    const product = data.products[index];

    const stock = Number(prompt("Lager", product.stock));

    if(!isNaN(stock))
        product.stock = stock;

    const sale = Number(prompt("Salgspris", product.salePrice));

    if(!isNaN(sale))
        product.salePrice = sale;

    const buy = Number(prompt("Indkøbspris", product.purchasePrice));

    if(!isNaN(buy))
        product.purchasePrice = buy;

    saveData();
    updateDashboard();
    renderProducts();
    renderTopProducts();
    renderLowStock();

}

function renderTopProducts(){

    const box = document.getElementById("topProducts");

    box.innerHTML = "";

    const top = [...data.products]
        .sort((a,b)=>b.sold-a.sold)
        .slice(0,3);

    if(top.length===0){

        box.innerHTML="<p>Ingen salg endnu.</p>";

        return;

    }

    top.forEach(product=>{

        box.innerHTML += `
        <div class="list-item">
            <strong>${product.name}</strong><br>
            ${product.flavor}<br>
            Solgt: ${product.sold}
        </div>
        `;

    });

}

function renderLowStock(){

    const box = document.getElementById("lowStock");

    box.innerHTML="";

    const low = data.products.filter(
        product => product.stock <= product.minStock
    );

    if(low.length===0){

        box.innerHTML="<p>Alt lager ser fint ud 👍</p>";

        return;

    }

    low.forEach(product=>{

        box.innerHTML += `
        <div class="list-item">
            ⚠️ ${product.name} (${product.flavor})<br>
            ${product.stock} stk. tilbage
        </div>
        `;

    });

}

renderTopProducts();
renderLowStock();
/* ==========================
   DEL 6 - INDSTILLINGER
========================== */

function renderFlavors(){

    const list = document.getElementById("flavorList");

    list.innerHTML = "";

    if(data.flavors.length === 0){

        list.innerHTML = "<p>Ingen smage endnu.</p>";

        return;

    }

    data.flavors.forEach((flavor,index)=>{

        list.innerHTML += `
            <div class="list-item">
                <strong>${flavor}</strong>
                <button class="delete-btn"
                        onclick="deleteFlavor(${index})">
                    Slet
                </button>
            </div>
        `;

    });

}

document.getElementById("addFlavorBtn").onclick = function(){

    const flavor = prompt("Navn på smag");

    if(!flavor) return;

    if(data.flavors.includes(flavor)){

        alert("Smagen findes allerede.");

        return;

    }

    data.flavors.push(flavor);

    saveData();

    renderFlavors();

};

function deleteFlavor(index){

    const flavor = data.flavors[index];

    const used = data.products.some(
        p => p.flavor === flavor
    );

    if(used){

        alert("Smagen bruges af et produkt.");

        return;

    }

    if(!confirm("Slet smagen?")) return;

    data.flavors.splice(index,1);

    saveData();

    renderFlavors();

}

document.getElementById("resetDataBtn").onclick = function(){

    if(!confirm("Vil du nulstille alle data?")) return;

    data = {

        revenue:0,

        profit:0,

        products:[],

        flavors:[]

    };

    saveData();

    updateDashboard();

    renderProducts();

    renderTopProducts();

    renderLowStock();

    renderFlavors();

};

renderFlavors();
