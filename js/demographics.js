//demographics.js
// Chart configurations remain unchanged as before
var genderCtx = document.getElementById('genderChart').getContext('2d');
var genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data: {
        labels: ['Male', 'Female'],
        datasets: [{
            data: [60, 40],
            backgroundColor: ['#3498db', '#e74c3c']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

var placementCtx = document.getElementById('placementChart').getContext('2d');
var placementChart = new Chart(placementCtx, {
    type: 'bar',
    data: {
        labels: ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT'],
        datasets: [{
            label: 'Placements',
            data: [75, 65, 80, 70, 60],
            backgroundColor: '#1abc9c'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

var branchCtx = document.getElementById('branchChart').getContext('2d');
var branchChart = new Chart(branchCtx, {
    type: 'pie',
    data: {
        labels: ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT'],
        datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: ['#2ecc71', '#e67e22', '#9b59b6', '#f1c40f', '#3498db']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

var admissionCtx = document.getElementById('admissionChart').getContext('2d');
var admissionChart = new Chart(admissionCtx, {
    type: 'line',
    data: {
        labels: ['2018', '2019', '2020', '2021', '2022'],
        datasets: [{
            label: 'Admissions',
            data: [150, 160, 170, 180, 190],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});