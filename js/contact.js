const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('max-h-[1000px]');
    console.log("clicked");
});

AOS.init({
    duration: 1000,
});

