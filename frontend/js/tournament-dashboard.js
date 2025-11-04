// Tournament Dashboard JavaScript - FULL FUNCTIONALITY
// Sample tournament data
const tournaments = [
    {
        id: 1,
        name: "Summer Championship 2025",
        startDate: "2025-07-15",
        endDate: "2025-07-20",
        location: "Hyderabad Sports Complex",
        teams: 24,
        maxTeams: 32,
        status: "active"
    },
    {
        id: 2,
        name: "Monsoon League 2025",
        startDate: "2025-07-05",
        endDate: "2025-07-20",
        location: "Pune Stadium",
        teams: 32,
        maxTeams: 32,
        status: "active"
    },
    {
        id: 3,
        name: "State Championship 2025",
        startDate: "2025-08-01",
        endDate: "2025-08-10",
        location: "Pune Stadium",
        teams: 18,
        maxTeams: 24,
        status: "upcoming"
    },
    {
        id: 4,
        name: "Winter Cup 2024",
        startDate: "2024-12-10",
        endDate: "2024-12-20",
        location: "Bangalore Arena",
        teams: 28,
        maxTeams: 28,
        status: "completed"
    }
];

// Sample teams data
const teams = [
    { id: 1, name: "Hawks", players: 12, coach: "John Doe" },
    { id: 2, name: "Eagles", players: 15, coach: "Jane Smith" },
    { id: 3, name: "Phoenix", players: 14, coach: "Mike Johnson" },
    { id: 4, name: "Thunder", players: 13, coach: "Sarah Williams" },
    { id: 5, name: "Warriors", players: 16, coach: "Tom Brown" }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Update stats
    updateStats();
    
    // Initialize tables
    renderTournamentTable();
    
    // Initialize charts
    initializeCharts();
    
    // Setup event listeners
    setupEventListeners();
});

// Load user data
function loadUserData() {
    const userName = localStorage.getItem('userName') || 'Admin';
    const userNameElements = document.querySelectorAll('#userName, #welcomeName');
    userNameElements.forEach(el => {
        if (el) el.textContent = userName;
    });
}

// Update stats
function updateStats() {
    const activeTournaments = tournaments.filter(t => t.status === 'active').length;
    const totalTeams = tournaments.reduce((sum, t) => sum + t.teams, 0);
    
    document.getElementById('activeTournaments').textContent = activeTournaments;
    document.getElementById('totalTeams').textContent = totalTeams;
}

// Render tournament table
function renderTournamentTable(filter = 'all') {
    const tbody = document.getElementById('tournamentTableBody');
    tbody.innerHTML = '';
    
    let filteredTournaments = tournaments;
    if (filter !== 'all') {
        filteredTournaments = tournaments.filter(t => t.status === filter);
    }
    
    filteredTournaments.forEach(tournament => {
        const row = document.createElement('tr');
        
        const statusClass = tournament.status === 'active' ? 'status-active' : 
                          tournament.status === 'upcoming' ? 'status-upcoming' : 
                          'status-completed';
        
        row.innerHTML = `
            <td><strong>${tournament.name}</strong></td>
            <td>${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}</td>
            <td>${tournament.location}</td>
            <td>${tournament.teams}/${tournament.maxTeams}</td>
            <td><span class="status-badge ${statusClass}">${capitalizeFirst(tournament.status)}</span></td>
            <td>
                <button class="btn-action btn-view" onclick="viewTournament(${tournament.id})">👁️ View</button>
                <button class="btn-action btn-edit" onclick="editTournament(${tournament.id})">✏️ Edit</button>
                <button class="btn-action btn-delete" onclick="deleteTournament(${tournament.id})">🗑️ Delete</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize charts
function initializeCharts() {
    // Tournament Status Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Upcoming', 'Completed'],
            datasets: [{
                data: [
                    tournaments.filter(t => t.status === 'active').length,
                    tournaments.filter(t => t.status === 'upcoming').length,
                    tournaments.filter(t => t.status === 'completed').length
                ],
                backgroundColor: ['#77BFA3', '#e8b86d', '#98C9A3']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Teams Chart
    const teamsCtx = document.getElementById('teamsChart').getContext('2d');
    new Chart(teamsCtx, {
        type: 'bar',
        data: {
            labels: tournaments.map(t => t.name.split(' ')[0]),
            datasets: [{
                label: 'Teams',
                data: tournaments.map(t => t.teams),
                backgroundColor: '#77BFA3'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Activity Chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Tournaments',
                data: [2, 3, 2, 4, 3, 5, 4],
                borderColor: '#77BFA3',
                backgroundColor: 'rgba(119, 191, 163, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Teams',
                data: [45, 62, 48, 88, 72, 102, 96],
                borderColor: '#4a7c59',
                backgroundColor: 'rgba(74, 124, 89, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (profileDropdown) {
            profileDropdown.classList.remove('show');
        }
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userType');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            }
        });
    }
    
    // Create Tournament Modal
    const createBtn = document.getElementById('createTournamentBtn');
    const modal = document.getElementById('createTournamentModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Tournament form submission
    const tournamentForm = document.getElementById('tournamentForm');
    if (tournamentForm) {
        tournamentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const tournament = {
                id: tournaments.length + 1,
                name: formData.get('name'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                location: formData.get('location'),
                teams: 0,
                maxTeams: parseInt(formData.get('maxTeams')),
                status: 'upcoming'
            };
            
            tournaments.push(tournament);
            renderTournamentTable();
            updateStats();
            modal.classList.remove('show');
            this.reset();
            alert('✅ Tournament created successfully!');
        });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTournamentTable(this.dataset.filter);
        });
    });
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#tournamentTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortTournaments(this.value);
        });
    }
    
    // Export CSV
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Quick action buttons
    const addTeamBtn = document.getElementById('addTeamBtn');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', showAddTeamModal);
    }
    
    const scheduleMatchBtn = document.getElementById('scheduleMatchBtn');
    if (scheduleMatchBtn) {
        scheduleMatchBtn.addEventListener('click', () => {
            window.location.href = 'match-schedule.html';
        });
    }
    
    const viewReportsBtn = document.getElementById('viewReportsBtn');
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', showReportsModal);
    }
}

// Sort tournaments
function sortTournaments(criteria) {
    switch(criteria) {
        case 'name':
            tournaments.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'date':
            tournaments.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            break;
        case 'teams':
            tournaments.sort((a, b) => b.teams - a.teams);
            break;
    }
    renderTournamentTable();
}

// Export to CSV
function exportToCSV() {
    const csvContent = [
        ['Tournament Name', 'Start Date', 'End Date', 'Location', 'Teams', 'Max Teams', 'Status'],
        ...tournaments.map(t => [
            t.name,
            t.startDate,
            t.endDate,
            t.location,
            t.teams,
            t.maxTeams,
            t.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournaments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('✅ CSV exported successfully!');
}

// Show Add Team Modal
function showAddTeamModal() {
    const teamName = prompt('Enter team name:');
    if (!teamName) return;
    
    const players = prompt('Number of players:', '12');
    if (!players) return;
    
    const coach = prompt('Coach name:');
    if (!coach) return;
    
    const newTeam = {
        id: teams.length + 1,
        name: teamName,
        players: parseInt(players),
        coach: coach
    };
    
    teams.push(newTeam);
    alert(`✅ Team "${teamName}" added successfully!`);
    updateStats();
}

// Show Reports Modal
function showReportsModal() {
    const reportType = prompt('Select report type:\n1. Tournament Summary\n2. Team Statistics\n3. Player Performance\n4. Financial Report\n\nEnter number (1-4):');
    
    if (!reportType) return;
    
    switch(reportType) {
        case '1':
            showTournamentReport();
            break;
        case '2':
            showTeamStatistics();
            break;
        case '3':
            alert('📊 Player Performance Report\n\nGenerating detailed player statistics...\n\nReport will be available in Reports section.');
            break;
        case '4':
            alert('💰 Financial Report\n\nGenerating revenue and expense analysis...\n\nReport will be available in Reports section.');
            break;
        default:
            alert('Invalid selection');
    }
}

// Show Tournament Report
function showTournamentReport() {
    const report = `
📊 TOURNAMENT SUMMARY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tournaments: ${tournaments.length}
Active: ${tournaments.filter(t => t.status === 'active').length}
Upcoming: ${tournaments.filter(t => t.status === 'upcoming').length}
Completed: ${tournaments.filter(t => t.status === 'completed').length}

Total Teams Registered: ${tournaments.reduce((sum, t) => sum + t.teams, 0)}
Average Teams per Tournament: ${Math.round(tournaments.reduce((sum, t) => sum + t.teams, 0) / tournaments.length)}

Recent Tournaments:
${tournaments.slice(0, 3).map(t => `• ${t.name} (${t.teams} teams)`).join('\n')}
    `;
    
    alert(report);
}

// Show Team Statistics
function showTeamStatistics() {
    const stats = `
📊 TEAM STATISTICS
━━━━━━━━━━━━━━━━━━━━━

Total Registered Teams: ${teams.length}
Total Players: ${teams.reduce((sum, t) => sum + t.players, 0)}
Average Players per Team: ${Math.round(teams.reduce((sum, t) => sum + t.players, 0) / teams.length)}

Top Teams:
${teams.slice(0, 5).map((t, i) => `${i+1}. ${t.name} (${t.players} players, Coach: ${t.coach})`).join('\n')}
    `;
    
    alert(stats);
}

// Tournament actions
function viewTournament(id) {
    const tournament = tournaments.find(t => t.id === id);
    if (tournament) {
        localStorage.setItem('currentTournament', JSON.stringify(tournament));
        window.location.href = 'tournament-leaderboard.html';
    }
}

function editTournament(id) {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return;
    
    const name = prompt('Tournament Name:', tournament.name);
    if (name) tournament.name = name;
    
    const location = prompt('Location:', tournament.location);
    if (location) tournament.location = location;
    
    const maxTeams = prompt('Max Teams:', tournament.maxTeams);
    if (maxTeams) tournament.maxTeams = parseInt(maxTeams);
    
    renderTournamentTable();
    alert('✅ Tournament updated successfully!');
}

function deleteTournament(id) {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return;
    
    if (confirm(`Are you sure you want to delete "${tournament.name}"?`)) {
        const index = tournaments.findIndex(t => t.id === id);
        if (index > -1) {
            tournaments.splice(index, 1);
            renderTournamentTable();
            updateStats();
            alert('✅ Tournament deleted successfully!');
        }
    }
}
// Request Management Functions
function approveRequest(type, id) {
    if (confirm(`Approve this ${type} request?`)) {
        alert(`✅ ${type === 'team' ? 'Team' : 'Player'} request approved!`);
        // Remove the request card
        event.target.closest('.request-card').remove();
        updateRequestCounts();
    }
}

function denyRequest(type, id) {
    const reason = prompt('Reason for denial (optional):');
    alert(`❌ ${type === 'team' ? 'Team' : 'Player'} request denied.`);
    // Remove the request card
    event.target.closest('.request-card').remove();
    updateRequestCounts();
}

function approveSpirit(id) {
    if (confirm('Accept this spirit score as submitted?')) {
        alert('✅ Spirit score accepted and recorded!');
        event.target.closest('.request-card').remove();
        updateRequestCounts();
    }
}

function editSpirit(id) {
    const newScore = prompt('Enter adjusted total score (0-20):', '14');
    if (newScore !== null) {
        alert(`✅ Spirit score adjusted to ${newScore}/20`);
        event.target.closest('.request-card').remove();
        updateRequestCounts();
    }
}

function denySpirit(id) {
    const reason = prompt('Reason for rejection:');
    if (reason) {
        alert('❌ Spirit score rejected. Team will be notified.');
        event.target.closest('.request-card').remove();
        updateRequestCounts();
    }
}

function updateRequestCounts() {
    const teamCount = document.querySelectorAll('#teamsTab .request-card').length;
    const playerCount = document.querySelectorAll('#playersTab .request-card').length;
    const spiritCount = document.querySelectorAll('#spiritTab .request-card').length;
    
    document.querySelector('[data-tab="teams"]').textContent = `Team Requests (${teamCount})`;
    document.querySelector('[data-tab="players"]').textContent = `Player Requests (${playerCount})`;
    document.querySelector('[data-tab="spirit"]').textContent = `Spirit Score Reviews (${spiritCount})`;
}

// Tab switching for requests
document.querySelectorAll('.request-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs and content
        document.querySelectorAll('.request-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.request-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const tabName = this.dataset.tab;
        document.getElementById(`${tabName}Tab`).classList.add('active');
    });
});
