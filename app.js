// PuffPoint Syd Manager V2

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

    document
        .querySelector(`[data-page="${pageId}"]`)
        .classList.add("active");
}

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;

        showPage(page);

    });

});

// Dashboard vises ved opstart
showPage("dashboard");
// Produkter

let products = [
{
name:"Blue Razz Ice / Strawberry Watermelon Bubble Gum",
stock:0,
sold:0
},
{
name:"Blueberry Ice / Love 66",
stock:0,
sold:0
},
{
name:"Strawberry Watermelon / Grape Ice",
stock:0,
sold:0
},
{
name:"Lemon Lime / Lush Ice",
stock:0,
sold:0
},
{
name:"Love 66 / Sour Apple",
stock:0,
sold:0
},
{
name:"Mixed Berries / Watermelon Ice",
stock:0,
sold:0
},
{
name:"Peach Ice / Blueberry Ice",
stock:0,
sold:0
},
{
name:"Strawberry Kiwi / Blueberry Sour Raspberry",
stock:0,
sold:0
},
{
name:"Summer Dream / Strawberry Banana",
stock:0,
sold:0
}
];

const productList=document.getElementById("productList");

function renderProducts(){

productList.innerHTML="";

products.forEach((product,index)=>{

let color="green";

if(product.stock<=5){
color="red";
}else if(product.stock<=10){
color="yellow";
}

productList.innerHTML+=`

<div class="product-card">

<h3>${product.name}</h3>

<div class="stock ${color}">
På lager: ${product.stock} stk.
</div>

<div class="product-actions">

<button class="add-btn" onclick="addStock(${index})">

➕

</button>

<button class="sell-btn" onclick="sellStock(${index})">

➖

</button>

</div>

</div>

`;

});

}

renderProducts();
