const hotelsPerPage = document.getElementById("entries-per-page");
const searchInput = document.getElementById("search");
const paginationNumbers = document.getElementById("pagination-numbers");
let currentPage = 1;
let hotelsPerPageCount = 5;
let hotelsData = [];
let filteredData = [];

// Pagination Function
function paginate(data, page, entriesPerPage) {
  const start = (page - 1) * entriesPerPage;
  const end = start + entriesPerPage;
  return data.slice(start, end);
}

// Update Pagination Info
function updatePaginationInfo(currentPage, totalHotels, entriesPerPage) {
  const start = (currentPage - 1) * entriesPerPage + 1;
  const end = Math.min(currentPage * entriesPerPage, totalHotels);
  document.getElementById("pagination-info").textContent =
    `Showing ${start} to ${end} of ${totalHotels} entries`;
}

// Render Hotel Cards
function renderCards(data) {
  const tableBody = document.getElementById("hotel-table-body");
  tableBody.innerHTML = "";
  data.forEach((hotel) => {
    const card = `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body p-4">
                        <a href="${hotel.details}" target="_blank" class="link-primary text-decoration-none cpc-hover-underline">
                            <h3 class="h5 fw-semibold mb-1">${hotel.name} <i class="fas fa-external-link"></i></h3>
                        </a>
                        <p class="text-sm text-body-secondary mb-1">${hotel.rating ? hotel.rating : "Rating: Not available"}</p>
                        <p class="text-sm mb-2">${hotel.address}</p>
                        <a href="tel:${hotel.phone}" class="link-primary text-decoration-none"><i class="fas fa-phone"></i> ${hotel.phone}</a>
                    </div>
                </div>
            </div>
        `;
    tableBody.innerHTML += card;
  });
}

// Filter Data by Search
function filterData() {
  const searchText = searchInput.value.toLowerCase();
  filteredData = hotelsData.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchText) ||
      hotel.rating.toLowerCase().includes(searchText) ||
      hotel.address.toLowerCase().includes(searchText),
  );
  currentPage = 1; // Reset to first page
  renderPaginatedData();
}

// Render Paginated Data
function renderPaginatedData() {
  const paginatedData = paginate(filteredData, currentPage, hotelsPerPageCount);
  renderCards(paginatedData);
  updatePaginationNumbers();
  updatePaginationInfo(currentPage, filteredData.length, hotelsPerPageCount);
}

// Update Pagination Numbers
function updatePaginationNumbers() {
  paginationNumbers.innerHTML = "";
  const totalPages = Math.ceil(filteredData.length / hotelsPerPageCount);
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"} me-1 mb-1`;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderPaginatedData();
    });
    paginationNumbers.appendChild(pageButton);
  }
}

// Fetch Hotels Data
fetch("data/hotels.json")
  .then((response) => response.json())
  .then((data) => {
    hotelsData = data.hotels; // Adjusted to match the JSON structure
    filteredData = hotelsData;
    renderPaginatedData();
  });

// Event Listeners for Pagination and Search
hotelsPerPage.addEventListener("change", (e) => {
  hotelsPerPageCount = parseInt(e.target.value);
  currentPage = 1;
  renderPaginatedData();
});

searchInput.addEventListener("input", filterData);

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedData();
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage * hotelsPerPageCount < filteredData.length) {
    currentPage++;
    renderPaginatedData();
  }
});

let currentlyOpen = null; // Track the currently open answer

function toggleAnswer(index) {
  const answerContainer = document.getElementById(`answer-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  if (currentlyOpen !== null) {
    // Collapse the currently open answer if it's not the same as the one being clicked
    if (currentlyOpen !== index) {
      document.getElementById(`answer-${currentlyOpen}`).style.maxHeight = null;
      document
        .getElementById(`icon-${currentlyOpen}`)
        .classList.remove("rotate-180");
    }
  }

  // Toggle the clicked answer
  if (answerContainer.style.maxHeight) {
    // Collapsing
    answerContainer.style.maxHeight = null;
    icon.classList.remove("rotate-180");
    currentlyOpen = null; // Reset currently open
  } else {
    // Expanding
    answerContainer.style.maxHeight = answerContainer.scrollHeight + "px";
    icon.classList.add("rotate-180");
    currentlyOpen = index; // Update the currently open answer
  }
}
