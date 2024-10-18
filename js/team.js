const studentsPerPage = document.getElementById('entries-per-page');
const searchInput = document.getElementById('search');
const paginationNumbers = document.getElementById('pagination-numbers');
let currentPage = 1;
let studentsPerPageCount = 10;
let studentsData = [];
let filteredData = [];

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
            <div class="bg-white shadow-md rounded-lg p-4">
                <h3 class="text-lg font-semibold">${student.name}</h3>
                <p class="text-sm text-gray-600">${student.designation}</p>
                <p class="text-sm">${student.branch}</p>
                <p class="text-sm">${student.course}, Year ${student.year}</p>
                <a href="tel:${student.contact}" class="text-blue-600"><i class="fas fa-phone"></i> ${student.contact}</a>
                <br>
                <a href="mailto:${student.email}" class="text-blue-600"><i class="fas fa-envelope"></i> ${student.email}</a>
            </div>
        `;
        tableBody.innerHTML += card;
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
        pageButton.className = `px-3 py-1 rounded border border-blue-600 ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPaginatedData();
        });
        paginationNumbers.appendChild(pageButton);
    }
}

// Fetch Students Data
fetch('data/students.json')
    .then(response => response.json())
    .then(data => {
        studentsData = data.students; // Adjusted to match the JSON structure
        filteredData = studentsData;
        renderPaginatedData();
    });

// Event Listeners for Pagination and Search
studentsPerPage.addEventListener('change', (e) => {
    studentsPerPageCount = parseInt(e.target.value);
    currentPage = 1;
    renderPaginatedData();
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


const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('max-h-[1000px]');
    console.log("clicked");
});
