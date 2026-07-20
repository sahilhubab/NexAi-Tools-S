

// Scroll Reveal

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    reveals.forEach(function(item){

        const windowHeight = window.innerHeight;

        const revealTop = item.getBoundingClientRect().top;

        const revealPoint = 100;

        if(revealTop < windowHeight - revealPoint){

            item.classList.add("active");

        }

    });

}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
window.addEventListener("resize", revealOnScroll);

revealOnScroll();