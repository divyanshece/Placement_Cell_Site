window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    preloader.classList.add("opacity-0");
    setTimeout(() => {
        preloader.style.display = "none";
    }, 500);
});

AOS.init({
    duration: 1000,
});

async function loadComponent(component, filePath) {
    const response = await fetch(filePath);
    const content = await response.text();
    const element = document.getElementById(component);

    if (element) {
        element.innerHTML = content;
    } else {
        console.warn(`Element with ID '${component}' not found. Skipping load for '${filePath}'.`);
    }

    return content; // Return content to ensure the component is loaded
}

// Load header and footer
Promise.all([
    loadComponent('header1', './components/header1.html'),
    loadComponent('header2', './components/header2.html'),
    loadComponent('footer', './components/footer.html'),
    loadComponent('announcements', './components/announcements.html')
]).then(() => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('max-h-[1000px]');
            navLinks.classList.toggle("overflow-hidden");
        });
    } else {
        console.error("Menu toggle or navigation links not found.");
    }

    // Elements for announcements
    const announcementContainer = document.getElementById("announcement-container");
    const announcementBtn = document.getElementById("announcement-btn");
    const rotateIcon = document.getElementById("rotate-icon");
    const announcementList = document.getElementById("announcement-list");
    let sectionOpen = false;

    // Toggle functionality
    announcementBtn.addEventListener("click", () => {
        announcementContainer.classList.toggle("translate-x-full");
        rotateIcon.classList.toggle("rotate-180");
        sectionOpen = !sectionOpen;
        if (sectionOpen) fetchAnnouncements(); // Fetch announcements when section is opened
    });

    // Function to render skeleton placeholders
    function renderAnnouncementSkeletons(count) {
        announcementList.innerHTML = ''; // Clear existing content
        for (let i = 0; i < count; i++) {
            const skeletonItem = document.createElement("li");
            skeletonItem.className = "relative flex justify-start items-start space-x-3 pb-4 border-b-2 border-slate-100 animate-pulse";
            skeletonItem.innerHTML = `
                <i class="fas fa-bullhorn text-gray-300 mr-2"></i>
                <div class="flex flex-col space-y-2">
                    <div class="w-16 h-3 bg-gray-300 rounded"></div>
                    <div class="w-40 h-4 bg-gray-300 rounded"></div>
                </div>
            `;
            announcementList.appendChild(skeletonItem);
        }
    }

    // Fetch announcements with 3-hour caching
    async function fetchAnnouncements() {
        const cacheKey = 'announcementData';
        const cacheExpiryKey = 'announcementDataExpiry';
        const cacheDuration = 3 * 60 * 60 * 1000; // 3 hours

        // Check cache for existing data
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(cacheExpiryKey);
        const now = new Date().getTime();

        let data;
        if (cachedData && cacheExpiry && now < cacheExpiry) {
            // Use cached data if it hasn't expired
            data = JSON.parse(cachedData);
        } else {
            try {
                // Render skeletons while loading
                renderAnnouncementSkeletons(5);

                const response = await fetch("https://script.google.com/macros/s/AKfycbw6I1F4Rl5j77EwE6r8mzOUyUlZoupvXHrLSy3ro28RZCW1HVUfd_mKUozqtkWA9bfPLg/exec?announcements=true");
                data = await response.json();

                // Cache the data and set expiration
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(cacheExpiryKey, now + cacheDuration);
            } catch (error) {
                console.error("Error fetching announcements:", error);
                return;
            }
        }

        // Clear skeletons and populate announcements
        announcementList.innerHTML = "";
        data.data.forEach(item => {
            const date = new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
            const announcementText = item.Announcement;

            // Create announcement item
            const announcementItem = document.createElement("li");
            announcementItem.classList.add("relative", "flex", "justify-start", "items-start", "space-x-3", "pb-4", "border-b-2", "border-slate-100");
            announcementItem.innerHTML = `
                <i class="fas fa-bullhorn text-blue-500 mr-2"></i>
                <div class="flex flex-col">
                    <p class="text-xs text-gray-500 hyphens-auto">${date}</p>
                    <p class="hyphens-auto">${announcementText}</p>
                </div>
                <img src="assets/new.gif" alt="New" class="absolute -top-1 right-1 w-9 h-5">
            `;
            announcementList.appendChild(announcementItem);
        });
    }

}).catch(err => {
    console.error("Failed to load components:", err);
});
