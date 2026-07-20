const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("active");
        console.log("Menu Clicked");
    });
}
// Theme Button

const themeBtn = document.querySelector(".theme-btn");

if (themeBtn) {

    // Page Load hote hi saved theme check karo
    if (localStorage.getItem("theme") === "light") {

        document.body.classList.add("light-mode");
        themeBtn.textContent = "☀️";

    }

    // Button Click
    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {

            localStorage.setItem("theme", "light");
            themeBtn.textContent = "☀️";

        } else {

            localStorage.setItem("theme", "dark");
            themeBtn.textContent = "🌙";

        }

    });

}