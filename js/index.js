// AOS.init({
//     duration: 1000,
// });

async function loadData() {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyrXCMRCX3oAB1vKyy2uOuEw3Za8l374I4x6tYvL3eG2wSTUXT9wpQ22E6uDg_5HCg8/exec';

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Select all hardcoded slides
        const slides = document.querySelectorAll('.swiper-slide');

        // Loop through each slide and corresponding data item
        data.data.forEach((item, index) => {
            if (index < slides.length) { // Ensure we don't exceed available slides
                const slide = slides[index];
                const img = slide.querySelector('img');
                const skeleton = slide.querySelector('.skeleton');

                // Update the slide's image source, alt text, and title with data from API
                img.src = item['Image Link'];
                img.alt = item['Short Desc'];
                slide.title = item['Short Desc'];

                // Once the image loads, remove the skeleton and show the image
                img.onload = () => {
                    skeleton.classList.add('hidden');  // Hide skeleton
                    img.classList.remove('hidden');    // Show image
                };
            }
        });

        // Initialize Swiper after data is loaded
        new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 8,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            breakpoints: {
                480: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 18 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
                1536: { slidesPerView: 5, spaceBetween: 24 },
            },
        });

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Call loadData to fetch data and update slides
loadData();


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
