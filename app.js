/* ===================================================
   PUFFPOINT SYD MANAGER V2
   APP.JS
   DEL 1 - GRUNDSTRUKTUR
=================================================== */

// ---------- LocalStorage ----------

const STORAGE_KEY = "puffpoint_data";

// ---------- Standard data ----------

const defaultData = {

    products: [],

    purchases: [],

    sales: [],

    settings: {

        lowStock: 10

    }

};

// ---------- Hent data ----------

let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

if(!data){

    data = structuredClone(defaultData);

    saveData();

}

// ---------- Gem ----------

function saveData(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

// ---------- Hjælp ----------

function $(id){

    return document.getElementById(id);

}

function money(value){

    return Number(value).toLocaleString("da-DK",{

        minimumFractionDigits:2,

        maximumFractionDigits:2

    }) + " kr.";

}

// ---------- Navigation ----------

const pages = document.querySelectorAll(".page");

const navButtons = document.querySelectorAll(".bottom-nav button");

function showPage(pageId){

    pages.forEach(page=>{

        page.classList.remove("active");

    });

    navButtons.forEach(btn=>{

        btn.classList.remove("active");

    });

    $(pageId).classList.add("active");

    document.querySelector(

        `[data-page="${pageId}"]`

    ).classList.add("active");

    renderDashboard();

    renderProducts();

    renderStatistics();

    renderSettings();

}

// ---------- Event listeners ----------

navButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        showPage(button.dataset.page);

    });

});

// ---------- Start ----------

document.addEventListener("DOMContentLoaded",()=>{

    renderDashboard();

    renderProducts();

    renderStatistics();

    renderSettings();

});
/* ===================================================
   DEL 2 - DASHBOARD
=================================================== */

function renderDashboard(){

    const totalProducts = data.products.length;

    const totalStock = data.products.reduce(

        (sum, product) => sum + Number(product.stock || 0),

        0

    );

    const totalValue = data.products.reduce(

        (sum, product) =>

            sum +

            (Number(product.stock || 0) *

             Number(product.costPrice || 0)),

        0

    );

    const lowStock = data.products.filter(

        product =>

        Number(product.stock || 0) <=

        Number(data.settings.lowStock)

    );

    if($("totalProducts")){

        $("totalProducts").textContent = totalProducts;

    }

    if($("totalStock")){

        $("totalStock").textContent = totalStock;

    }

    if($("stockValue")){

        $("stockValue").textContent = money(totalValue);

    }

    if($("lowStockCount")){

        $("lowStockCount").textContent = lowStock.length;

    }

    renderTopProducts();

    renderReorder();

}

function renderTopProducts(){

    const container = $("top3");

    if(!container) return;

    container.innerHTML = "";

    if(data.products.length === 0){

        container.innerHTML =

        "<div class='list-item'>Ingen produkter endnu</div>";

        return;

    }

    const sorted = [...data.products]

        .sort((a,b)=>

            Number(b.stock)-Number(a.stock)

        )

        .slice(0,3);

    sorted.forEach(product=>{

        container.innerHTML += `

            <div class="list-item">

                <strong>${product.name}</strong>

                <span>${product.stock} stk.</span>

            </div>

        `;

    });

}

function renderReorder(){

    const container = $("reorderList");

    if(!container) return;

    container.innerHTML = "";

    const products = data.products.filter(

        product=>

        Number(product.stock)<=

        Number(data.settings.lowStock)

    );

    if(products.length===0){

        container.innerHTML=

        "<div class='list-item'>Ingen produkter skal bestilles.</div>";

        return;

    }

    products.forEach(product=>{

        container.innerHTML+=`

            <div class="list-item">

                <strong>${product.name}</strong>

                <span>${product.stock} stk.</span>

            </div>

        `;

    });

}
/* ===================================================
   DEL 3 - LAGER
=================================================== */

let searchText = "";
let sortType = "name";

function renderProducts(){

    const container = $("productList");

    if(!container) return;

    let products = [...data.products];

    if(searchText){

        products = products.filter(product =>

            product.name
            .toLowerCase()
            .includes(searchText.toLowerCase())

        );

    }

    switch(sortType){

        case "stockLow":

            products.sort((a,b)=>a.stock-b.stock);

            break;

        case "stockHigh":

            products.sort((a,b)=>b.stock-a.stock);

            break;

        default:

            products.sort((a,b)=>

                a.name.localeCompare(b.name)

            );

    }

    container.innerHTML = "";

    if(products.length === 0){

        container.innerHTML = `
            <div class="card">
                <h3>Ingen produkter</h3>
                <p>Tilføj dit første produkt.</p>
            </div>
        `;

        return;

    }

    products.forEach((product,index)=>{

        let status = "stock-good";

        if(product.stock <= data.settings.lowStock){

            status = "stock-low";

        }else if(product.stock <= data.settings.lowStock * 2){

            status = "stock-medium";

        }

        container.innerHTML += `

        <div class="product-card">

            <div class="product-header">

                <div>

                    <div class="product-name">

                        ${product.name}

                    </div>

                    <div class="product-stock ${status}">

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

function changeStock(index,amount){

    if(!data.products[index]) return;

    data.products[index].stock += amount;

    if(data.products[index].stock < 0){

        data.products[index].stock = 0;

    }

    saveData();

    renderProducts();

    renderDashboard();

    renderStatistics();

}

function addProduct(product){

    data.products.push({

        name:product.name,

        stock:Number(product.stock),

        costPrice:Number(product.costPrice),

        salePrice:Number(product.salePrice)

    });

    saveData();

    renderProducts();

    renderDashboard();

    renderStatistics();

}
