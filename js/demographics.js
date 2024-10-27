// Fetch and parse the JSON data
fetch('data/demographics.json')
    .then(response => response.json())
    .then(data => {
        initializeCharts(data); // Pass the data to initialize charts
        initializeEmployers(data); // Pass the data to initialize employers
    })
    .catch(error => console.error('Error fetching demographics data:', error));



    
var branchChart;
var branchLabels;
var branchDistributionData;

// Initialize charts with fetched JSON data
function initializeCharts(data) {
    // Year-Wise Admissions Chart (Yearly Placement)
    const yearlyLabels = Object.keys(data.yearlyPlacements);
    const yearlyData = Object.values(data.yearlyPlacements);

    var admissionCtx = document.getElementById('admissionChart').getContext('2d');
    var admissionChart = new Chart(admissionCtx, {
        type: 'line',
        data: {
            labels: yearlyLabels,
            datasets: [{
                data: yearlyData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students',
                        color: '#666',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        color: '#666',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: false
                }
            }
        }
    });



    // Placement Stats Chart
    branchLabels = Object.keys(data.placedPerBranch);
    const placementData = Object.values(data.placedPerBranch);

    var placementCtx = document.getElementById('placementChart').getContext('2d');
    var placementChart = new Chart(placementCtx, {
        type: 'bar',
        data: {
            labels: branchLabels,
            datasets: [{
                data: placementData,
                backgroundColor: '#1abc9c',
                borderColor: '#16a085',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 200,
                    title: {
                        display: true,
                        text: 'Placement Percentage',
                        color: '#666',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Departments',
                        color: '#666',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: false
                }
            }
        }
    });



    // Initialize the Branch Distribution Chart
    branchDistributionData = Object.values(data.branches);

    var branchCtx = document.getElementById('branchChart').getContext('2d');
    branchChart = new Chart(branchCtx, {
        type: 'pie',
        data: {
            labels: branchLabels,
            datasets: [{
                data: branchDistributionData,
                backgroundColor: ['#2ecc71', '#e67e22', '#9b59b6', '#f1c40f', '#3498db', '#34495e', '#e74c3c', '#95a5a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    bottom: 20
                }
            },
            plugins: {
                legend: {
                    display: window.innerWidth <= 768, // Display legend only on mobile screens (<= 768px)
                    position: 'bottom'
                }
            },
            onClick: (evt, item) => {
                if (isBranchDistribution && item.length > 0) {
                    const branchIndex = item[0].index;
                    const branchName = branchChart.data.labels[branchIndex];
                    selectedBranchName = branchName;
                    selectedBranchIndex = branchIndex;
                    updateGenderDistribution(branchName, data);
                }
            },
            onResize: function (chart, size) {
                chart.canvas.parentNode.style.height = '400px';
            }
        }
    });

    // Listen for window resize events to adjust legend display based on screen width
    window.addEventListener('resize', () => {
        branchChart.options.plugins.legend.display = window.innerWidth <= 768;
        branchChart.update();
    });
}





// Function to update the Branch Distribution chart
var isBranchDistribution = true;
var selectedBranchName = '';
var selectedBranchIndex = -1;

// Custom Plugin to draw lines and labels for Branch and Gender Distribution
const labelPlugin = {
    id: 'labelPlugin',
    afterDraw: (chart) => {
        if (window.innerWidth <= 768) {
            return; // Do not draw custom labels on mobile
        }

        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        const chartCenterX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const chartCenterY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        // Loop through each slice
        meta.data.forEach((element, index) => {
            const data = chart.data.datasets[0].data[index];
            const label = chart.data.labels[index];
            const angle = (element.startAngle + element.endAngle) / 2;
            const outerRadius = element.outerRadius;

            // Calculate the starting point of the line (on the slice boundary)
            const xStart = chartCenterX + outerRadius * Math.cos(angle);
            const yStart = chartCenterY + outerRadius * Math.sin(angle);

            // Calculate the horizontal endpoint for the line
            const labelRadius = outerRadius + 50; // Distance of label from the chart
            const xEnd = chartCenterX + labelRadius * (Math.cos(angle) > 0 ? 1 : -1); // Ensure the endpoint is horizontal (left or right)
            const yEnd = yStart; // Keep y consistent for a horizontal line

            // Uniform gap between the line and the label
            const labelGap = 15;

            // Draw the line from the pie slice boundary to label
            ctx.beginPath();
            ctx.moveTo(xStart, yStart); // Start at the boundary of the slice
            ctx.lineTo(xEnd, yEnd); // Horizontal endpoint for the line
            ctx.strokeStyle = '#333'; // Line color
            ctx.stroke();

            // Set text alignment and calculate xLabel position based on side (left or right)
            ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
            const xLabel = xEnd + (Math.cos(angle) > 0 ? labelGap : -labelGap); // Uniform gap on both sides
            const yLabel = yEnd;

            // Draw the label text
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#333';
            ctx.fillText(label, xLabel, yLabel);
        });
    }
};

// Register the custom plugin
Chart.register(labelPlugin);

// Function to update Gender Distribution based on the selected branch
function updateGenderDistribution(branchName, data) {
    const selectedGenderData = data.genderData[branchName];
    console.log(selectedGenderData);

    // Update the chart with gender data
    branchChart.data.labels = ['Male', 'Female'];
    branchChart.data.datasets[0].data = selectedGenderData;
    branchChart.data.datasets[0].backgroundColor = ['#3498db', '#e74c3c'];

    // Update the title
    document.getElementById('chart-title').textContent = `Gender Distribution for ${branchName}`;

    // Show the "Back to Branch" button
    document.getElementById('backToBranchBtn').classList.remove('hidden');

    // Update state to indicate gender distribution
    isBranchDistribution = false;

    // Update the chart
    branchChart.update();
}

// Function to restore the Branch Distribution chart
function resetBranchChart() {
    // Restore the original branch data
    branchChart.data.labels = branchLabels;
    branchChart.data.datasets[0].data = branchDistributionData;
    branchChart.data.datasets[0].backgroundColor = ['#2ecc71', '#e67e22', '#9b59b6', '#f1c40f', '#3498db', '#34495e', '#e74c3c', '#95a5a6'];

    // Update the title
    document.getElementById('chart-title').textContent = 'Branch Distribution';

    // Hide the "Back to Branch" button
    document.getElementById('backToBranchBtn').classList.add('hidden');

    // Reset the selected branch and index
    selectedBranchName = '';
    selectedBranchIndex = -1;

    // Mark the chart as branch distribution
    isBranchDistribution = true;

    // Update the chart
    branchChart.update();
}





// Function to initialize the Employers list
function initializeEmployers(data) {
    const employers = data.employers;
    const alphabetButtonsContainer = document.getElementById('alphabetButtonsContainer');
    const employerLetterTitle = document.getElementById('employerLetterTitle');
    const employersList = document.getElementById('employersList');
    let activeButton = null;

    function displayEmployersByLetter(letter, clickedButton) {
        employerLetterTitle.textContent = `Employers Starting With "${letter}"`;
        employersList.innerHTML = '';
        employers[letter].forEach(employer => {
            const li = document.createElement('li');
            li.textContent = employer;
            employersList.appendChild(li);
        });

        if (activeButton) {
            activeButton.classList.remove('scale-110', 'bg-teal-700');
        }

        clickedButton.classList.add('scale-110', 'bg-teal-700');
        activeButton = clickedButton;
    }

    function createAlphabetButtons() {
        const letters = Object.keys(employers);

        letters.forEach((letter, index) => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'bg-teal-600 hover:bg-teal-700 hover:underline text-white font-bold py-2 px-4 rounded w-12 h-12 flex items-center justify-center transition-transform transform';

            button.addEventListener('click', () => displayEmployersByLetter(letter, button));

            alphabetButtonsContainer.appendChild(button);

            if (index === 0) {
                button.classList.add('scale-110', 'bg-teal-700');
                activeButton = button;
            }
        });
    }

    createAlphabetButtons();
    displayEmployersByLetter('A', activeButton);
}






var swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    // navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    // },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});