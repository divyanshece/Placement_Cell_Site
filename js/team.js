const studentsPerPage = document.getElementById('entries-per-page');
const searchInput = document.getElementById('search');
const paginationNumbers = document.getElementById('pagination-numbers');
let currentPage = 1;
let studentsPerPageCount = 10;
let studentsData = [];
let filteredData = [];

// Function to render dynamic skeleton placeholders
function renderSkeletons(count) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = ''; // Clear existing content

    // Create and append skeleton cards based on the count
    for (let i = 0; i < count; i++) {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';

        const skeletonCard = document.createElement('div');
        skeletonCard.className = "skeleton-card bg-body-tertiary rounded p-4 cpc-announcement-skeleton d-flex flex-column gap-3";
        skeletonCard.innerHTML = `
            <div class="bg-secondary-subtle rounded" style="height: 1.5rem; width: 75%;"></div>
            <div class="bg-secondary-subtle rounded" style="height: 1rem; width: 50%;"></div>
            <div class="bg-secondary-subtle rounded" style="height: 1rem; width: 66%;"></div>
            <div class="bg-secondary-subtle rounded" style="height: 1rem; width: 25%;"></div>
        `;

        col.appendChild(skeletonCard);
        tableBody.appendChild(col);
    }
}

// Helper function to save data to Local Storage with a timestamp
function saveDataToLocalStorage(data) {
    const timestampedData = {
        data,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('studentsData', JSON.stringify(timestampedData));
}

// Helper function to check if data is recent
function isDataExpired(storedData) {
    const now = new Date().getTime();
    const expirationTime = 3 * 60 * 60 * 1000; // 3 hours
    return now - storedData.timestamp > expirationTime;
}

// Function to load students data (from cache or API)
function loadStudentsData() {
    const storedData = JSON.parse(localStorage.getItem('studentsData'));

    if (storedData && !isDataExpired(storedData)) {
        // Use cached data
        studentsData = storedData.data;
        filteredData = studentsData;
        renderPaginatedData();
    } else {
        // Show skeletons while loading data
        renderSkeletons(studentsPerPageCount);

        fetch('https://script.google.com/macros/s/AKfycbw6I1F4Rl5j77EwE6r8mzOUyUlZoupvXHrLSy3ro28RZCW1HVUfd_mKUozqtkWA9bfPLg/exec?team=true')
            .then(response => response.json())
            .then(data => {
                // Map and format data
                studentsData = data.data.map(student => ({
                    name: student.Name,
                    designation: student.Designation,
                    course: student.Course,
                    branch: student.Branch,
                    year: student.Year,
                    contact: student.Contact.toString(),
                    email: student.Email
                }));

                filteredData = studentsData;

                // Cache the fetched data
                saveDataToLocalStorage(studentsData);

                // Clear skeletons and render data
                document.getElementById('student-table-body').innerHTML = '';
                renderPaginatedData();
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

// Pagination Function
function paginate(data, page, entriesPerPage) {
    const start = (page - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    return data.slice(start, end);
}

// Update Pagination Info
function updatePaginationInfo(currentPage, totalStudents, entriesPerPage) {
    const start = (currentPage - 1) * entriesPerPage + 1;
    const end = Math.min(currentPage * entriesPerPage, totalStudents);
    document.getElementById('pagination-info').textContent = `Showing ${start} to ${end} of ${totalStudents} entries`;
}

// Render Student Cards
function renderCards(data) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = '';
    data.forEach(student => {
        const card = `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body p-4">
                        <h3 class="h5 fw-semibold mb-1">${student.name}</h3>
                        <p class="text-sm text-body-secondary mb-1">${student.designation}</p>
                        <p class="text-sm mb-1">${student.branch}</p>
                        <p class="text-sm mb-2">${student.course}, ${student.year} Year</p>
                        <a href="tel:${student.contact}" class="link-primary text-decoration-none"><i class="fas fa-phone"></i> ${student.contact}</a>
                        <br>
                        <a href="mailto:${student.email}" class="link-primary text-decoration-none"><i class="fas fa-envelope"></i> ${student.email}</a>
                    </div>
                </div>
            </div>
        `;
        tableBody.insertAdjacentHTML('beforeend', card);
    });
}

// Filter Data by Search
function filterData() {
    const searchText = searchInput.value.toLowerCase();
    filteredData = studentsData.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.designation.toLowerCase().includes(searchText) ||
        student.branch.toLowerCase().includes(searchText)
    );
    currentPage = 1; // Reset to first page
    renderPaginatedData();
}

// Render Paginated Data
function renderPaginatedData() {
    const paginatedData = paginate(filteredData, currentPage, studentsPerPageCount);
    renderCards(paginatedData);
    updatePaginationNumbers();
    updatePaginationInfo(currentPage, filteredData.length, studentsPerPageCount);
}

// Update Pagination Numbers
function updatePaginationNumbers() {
    paginationNumbers.innerHTML = '';
    const totalPages = Math.ceil(filteredData.length / studentsPerPageCount);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} me-1 mb-1`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPaginatedData();
        });
        paginationNumbers.appendChild(pageButton);
    }
}

// Event Listeners for Pagination and Search
studentsPerPage.addEventListener('change', (e) => {
    studentsPerPageCount = parseInt(e.target.value);
    currentPage = 1;

    // Render skeletons based on the new entries per page count
    renderSkeletons(studentsPerPageCount);

    // Load data (will show skeletons first if data is being fetched)
    loadStudentsData();
});

searchInput.addEventListener('input', filterData);

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPaginatedData();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage * studentsPerPageCount < filteredData.length) {
        currentPage++;
        renderPaginatedData();
    }
});

// Initial load
loadStudentsData();
