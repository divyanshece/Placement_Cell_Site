let containers = document.querySelectorAll(".logo-cloud");
let isScrolling;

containers.forEach(container => {
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2; // Center the scroll for each container
    container.addEventListener('scrollend', snapBackToCenter);
    container.addEventListener('touchend', snapBackToCenter);
});

function snapBackToCenter(event) {
    let container = event.currentTarget;
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        container.scrollTo({
            left: (container.scrollWidth - container.clientWidth) / 2,
            behavior: 'smooth'
        });
    }, 100);
}

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('max-h-[1000px]');
    console.log("clicked");
});
