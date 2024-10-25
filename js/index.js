// // Function to handle the hover effect
// function handleHover(hoveredDiv) {
//     document.querySelectorAll('.transition-width').forEach(div => {
//         if (div === hoveredDiv) {
//             div.classList.add('w-1/2');
//             div.classList.remove('flex-1');
//         } else {
//             div.classList.add('w-1/4');
//             div.classList.remove('flex-1');
//         }
//     });
// }

// // Function to reset the divs to equal width
// function resetDivs() {
//     document.querySelectorAll('.transition-width').forEach(div => {
//         div.classList.remove('w-1/2', 'w-1/4');
//         div.classList.add('flex-1');
//     });
// }

// // Add event listeners for each div
// document.querySelectorAll('.transition-width').forEach(div => {
//     div.addEventListener('mouseenter', () => handleHover(div));
//     div.addEventListener('mouseleave', resetDivs);
// });










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
