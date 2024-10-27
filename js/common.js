async function loadComponent(component, filePath) {
    const response = await fetch(filePath);
    const content = await response.text();
    document.getElementById(component).innerHTML = content;
    return content; // Return content to ensure the component is loaded
}

// Load header and footer
Promise.all([
    loadComponent('header1', './components/header1.html'),
    loadComponent('header2', './components/header2.html'),
    loadComponent('footer', './components/footer.html')
]).then(() => {
    // Now that the components are loaded, we can safely set up the event listener
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    // Check if menuToggle and navLinks exist to avoid null errors
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('max-h-[1000px]');
            console.log("Menu toggled");
        });
    } else {
        console.error("Menu toggle or navigation links not found.");
    }
}).catch(err => {
    console.error("Failed to load components:", err);
});

AOS.init({
    duration: 1000,
});



