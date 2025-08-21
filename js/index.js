async function loadData() {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbw6I1F4Rl5j77EwE6r8mzOUyUlZoupvXHrLSy3ro28RZCW1HVUfd_mKUozqtkWA9bfPLg/exec?achievements=true';
    const cacheKey = 'achievementData';
    const cacheExpiryKey = 'achievementDataExpiry';
    const cacheDuration = 3 * 60 * 60 * 1000; // 3 hours

    // Initialize Swiper before data is loaded
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        breakpoints: {
            480: { slidesPerView: 2, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
            1536: { slidesPerView: 5, spaceBetween: 24 },
        },
    });

    // Pause autoplay on hover
    const swiperContainer = document.querySelector('.swiper-container');
    swiperContainer.addEventListener('mouseenter', () => swiper.autoplay.stop());
    swiperContainer.addEventListener('mouseleave', () => swiper.autoplay.start());

    // Check if cached data exists and is still valid
    const cachedData = localStorage.getItem(cacheKey);
    const cacheExpiry = localStorage.getItem(cacheExpiryKey);
    const now = new Date().getTime();

    let data;
    if (cachedData && cacheExpiry && now < cacheExpiry) {
        data = JSON.parse(cachedData);
    } else {
        try {
            const response = await fetch(apiUrl);
            data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheExpiryKey, now + cacheDuration);
        } catch (error) {
            console.error('Error loading data:', error);
            return;
        }
    }

    // Select all hardcoded slides
    const slides = document.querySelectorAll('.swiper-slide');

    // Loop through each slide and corresponding data item
    data.data.forEach((item, index) => {
        if (index < slides.length) {
            const slide = slides[index];
            const img = slide.querySelector('img');
            const skeletons = slide.querySelectorAll('.skeleton');
            const descriptionElement = slide.querySelector('.achievement-desc');

            // Update the slide's content
            img.src = item['Image Link'];
            img.alt = item['Short Desc'];
            slide.title = item['Short Desc'];
            descriptionElement.textContent = item['Short Desc'];

            img.onload = () => {
                // Hide all skeletons and show description when image loads
                skeletons.forEach(skeleton => skeleton.classList.add('hidden'));
                descriptionElement.classList.remove('hidden');
            };
        }
    });
}

// Call loadData to fetch data and update slides
loadData();

// Keep your existing logo-cloud code unchanged
let containers = document.querySelectorAll(".logo-cloud");
let isScrolling;

containers.forEach(container => {
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
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
