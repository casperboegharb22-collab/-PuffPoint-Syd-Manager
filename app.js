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
