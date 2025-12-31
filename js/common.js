let preloaderHidden = false;

function hidePreloader() {
    if (preloaderHidden) return;
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    preloaderHidden = true;
    preloader.style.pointerEvents = "none";
    preloader.classList.add("opacity-0");
    setTimeout(() => {
        preloader.style.display = "none";
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(hidePreloader, 1500);
});

window.addEventListener("load", hidePreloader);

if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
    });
}

async function loadComponent(component, filePath) {
    const response = await fetch(filePath);
    const content = await response.text();
    const element = document.getElementById(component);

    if (element) {
        element.innerHTML = content;
    } else {
        console.warn(`Element with ID '${component}' not found. Skipping load for '${filePath}'.`);
    }

    return content;
}

// Load header and footer
Promise.all([
    loadComponent('header1', './components/header1.html'),
    loadComponent('header2', './components/header2.html'),
    loadComponent('footer', './components/footer.html'),
    loadComponent('announcements', './components/announcements.html')
]).then(() => {
    // Ensure Bootstrap dropdowns work
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((toggle) => {
        if (window.bootstrap?.Dropdown) {
            bootstrap.Dropdown.getOrCreateInstance(toggle);
        }

        toggle.addEventListener('click', (e) => {
            const href = toggle.getAttribute('href');
            if (href && href !== '#' && href !== '') e.preventDefault();
        });
    });

    // Header2: open dropdowns on hover (desktop only)
    const header2 = document.getElementById('header2');
    const isDesktop = () => window.matchMedia && window.matchMedia('(min-width: 992px)').matches;

    if (header2 && window.bootstrap?.Dropdown) {
        header2.querySelectorAll('.dropdown').forEach((dropdown) => {
            const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!toggle || !menu) return;

            const instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
            let hideTimer;

            const clearHideTimer = () => {
                if (hideTimer) {
                    clearTimeout(hideTimer);
                    hideTimer = undefined;
                }
            };

            const scheduleHide = () => {
                clearHideTimer();
                hideTimer = setTimeout(() => {
                    if (isDesktop()) instance.hide();
                }, 120);
            };

            dropdown.addEventListener('mouseenter', () => {
                if (!isDesktop()) return;
                clearHideTimer();
                instance.show();
            });

            dropdown.addEventListener('mouseleave', () => {
                if (!isDesktop()) return;
                scheduleHide();
            });

            menu.addEventListener('mouseenter', () => {
                if (!isDesktop()) return;
                clearHideTimer();
            });

            menu.addEventListener('mouseleave', () => {
                if (!isDesktop()) return;
                scheduleHide();
            });
        });
    }

    // Elements for announcements
    const rotateIcon = document.getElementById("rotate-icon");
    const announcementList = document.getElementById("announcement-list");
    const announcementSidebar = document.getElementById("announcement-sidebar");
    const announcementBtn = document.getElementById("announcement-btn");

    let announcementsLoaded = false;

    // Function to render skeleton placeholders
    function renderAnnouncementSkeletons(count) {
        if (!announcementList) return;

        announcementList.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeletonItem = document.createElement("li");
            skeletonItem.className = "cpc-announcement-item cpc-announcement-skeleton";
            skeletonItem.innerHTML = `
                <i class="fas fa-bullhorn cpc-skeleton-icon"></i>
                <div class="cpc-announcement-item-text">
                    <div class="cpc-skeleton-line cpc-skeleton-line-sm"></div>
                    <div class="cpc-skeleton-line cpc-skeleton-line-md"></div>
                </div>
            `;
            announcementList.appendChild(skeletonItem);
        }
    }

    // Fetch announcements with 3-hour caching
    async function fetchAnnouncements() {
        if (announcementsLoaded) return;

        const cacheKey = 'announcementData';
        const cacheExpiryKey = 'announcementDataExpiry';
        const cacheDuration = 3 * 60 * 60 * 1000; // 3 hours

        // Check cache for existing data
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(cacheExpiryKey);
        const now = new Date().getTime();

        let data;
        if (cachedData && cacheExpiry && now < cacheExpiry) {
            data = JSON.parse(cachedData);
        } else {
            try {
                renderAnnouncementSkeletons(5);

                const response = await fetch("https://script.google.com/macros/s/AKfycbw6I1F4Rl5j77EwE6r8mzOUyUlZoupvXHrLSy3ro28RZCW1HVUfd_mKUozqtkWA9bfPLg/exec?announcements=true");
                data = await response.json();

                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(cacheExpiryKey, now + cacheDuration);
            } catch (error) {
                console.error("Error fetching announcements:", error);
                return;
            }
        }

        if (!announcementList) return;

        announcementList.innerHTML = "";
        data.data.forEach(item => {
            const date = new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
            const announcementText = item.Announcement;

            const announcementItem = document.createElement("li");
            announcementItem.classList.add("cpc-announcement-item");
            announcementItem.innerHTML = `
                <i class="fas fa-bullhorn text-primary me-2"></i>
                <div class="cpc-announcement-item-text">
                    <p class="cpc-announcement-date">${date}</p>
                    <p class="mb-0">${announcementText}</p>
                </div>
                <img src="assets/new.gif" alt="New" class="cpc-announcement-new" />
            `;
            announcementList.appendChild(announcementItem);
        });

        announcementsLoaded = true;
    }

    // Handle offcanvas events
    if (announcementSidebar) {
        announcementSidebar.addEventListener('show.bs.offcanvas', () => {
            if (rotateIcon) rotateIcon.classList.add('rotate-180');
            if (announcementList) fetchAnnouncements();
        });

        announcementSidebar.addEventListener('hidden.bs.offcanvas', () => {
            if (rotateIcon) rotateIcon.classList.remove('rotate-180');
        });
    }

}).catch(err => {
    console.error("Failed to load components:", err);
});