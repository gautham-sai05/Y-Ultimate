// ========================================
// LEADERBOARD PAGE JAVASCRIPT
// ======================================== 

document.addEventListener('DOMContentLoaded', function() {
    console.log('Leaderboard page loaded!');
    
   // Sample data - 20 teams for testing scroll
const teamsData = [
    {
        rank: 4,
        name: 'Team Phoenix',
        username: '@teamphoenix',
        avatar: 'Team+Phoenix',
        points: 138,
        wins: 10,
        losses: 5,
        games: 15,
        trend: 0,
        category: 'Mixed',
        spirit: 9.8
    },
    {
        rank: 5,
        name: 'Disc Defenders',
        username: '@discdefenders',
        avatar: 'Disc+Defenders',
        points: 135,
        wins: 9,
        losses: 6,
        games: 15,
        trend: 3,
        category: 'Open',
        spirit: 8.5
    },
    {
        rank: 6,
        name: 'Sky Strikers',
        username: '@skystrikers',
        avatar: 'Sky+Strikers',
        points: 130,
        wins: 9,
        losses: 6,
        games: 15,
        trend: -2,
        category: 'Women\'s',
        spirit: 9.2
    },
    {
        rank: 7,
        name: 'Frisbee Flyers',
        username: '@frisbeeflyers',
        avatar: 'Frisbee+Flyers',
        points: 125,
        wins: 8,
        losses: 7,
        games: 15,
        trend: 1,
        category: 'Mixed',
        spirit: 8.0
    },
    {
        rank: 8,
        name: 'Wind Warriors',
        username: '@windwarriors',
        avatar: 'Wind+Warriors',
        points: 120,
        wins: 7,
        losses: 8,
        games: 15,
        trend: -1,
        category: 'Open',
        spirit: 7.5
    },
    {
        rank: 9,
        name: 'Spin Doctors',
        username: '@spindoctors',
        avatar: 'Spin+Doctors',
        points: 118,
        wins: 7,
        losses: 8,
        games: 15,
        trend: 0,
        category: 'Mixed',
        spirit: 8.8
    },
    {
        rank: 10,
        name: 'Airborne Aces',
        username: '@airborneaces',
        avatar: 'Airborne+Aces',
        points: 115,
        wins: 6,
        losses: 9,
        games: 15,
        trend: -3,
        category: 'Women\'s',
        spirit: 9.0
    },
    {
        rank: 11,
        name: 'Velocity Vipers',
        username: '@velocityvipers',
        avatar: 'Velocity+Vipers',
        points: 112,
        wins: 6,
        losses: 9,
        games: 15,
        trend: 2,
        category: 'Open',
        spirit: 7.8
    },
    {
        rank: 12,
        name: 'Gravity Defiers',
        username: '@gravitydefiers',
        avatar: 'Gravity+Defiers',
        points: 108,
        wins: 5,
        losses: 10,
        games: 15,
        trend: -1,
        category: 'Mixed',
        spirit: 8.3
    },
    {
        rank: 13,
        name: 'Storm Chasers',
        username: '@stormchasers',
        avatar: 'Storm+Chasers',
        points: 105,
        wins: 5,
        losses: 10,
        games: 15,
        trend: 1,
        category: 'Women\'s',
        spirit: 9.1
    },
    {
        rank: 14,
        name: 'Flash Flickers',
        username: '@flashflickers',
        avatar: 'Flash+Flickers',
        points: 102,
        wins: 4,
        losses: 11,
        games: 15,
        trend: -2,
        category: 'Open',
        spirit: 7.2
    },
    {
        rank: 15,
        name: 'Horizon Hawks',
        username: '@horizonhawks',
        avatar: 'Horizon+Hawks',
        points: 98,
        wins: 4,
        losses: 11,
        games: 15,
        trend: 0,
        category: 'Mixed',
        spirit: 8.6
    },
    {
        rank: 16,
        name: 'Breeze Blasters',
        username: '@breezeblasters',
        avatar: 'Breeze+Blasters',
        points: 95,
        wins: 3,
        losses: 12,
        games: 15,
        trend: -4,
        category: 'Women\'s',
        spirit: 8.9
    },
    {
        rank: 17,
        name: 'Cyclone Squad',
        username: '@cyclonesquad',
        avatar: 'Cyclone+Squad',
        points: 92,
        wins: 3,
        losses: 12,
        games: 15,
        trend: 1,
        category: 'Open',
        spirit: 7.4
    },
    {
        rank: 18,
        name: 'Thunder Throwers',
        username: '@thunderthrowers',
        avatar: 'Thunder+Throwers',
        points: 88,
        wins: 2,
        losses: 13,
        games: 15,
        trend: -1,
        category: 'Mixed',
        spirit: 8.1
    },
    {
        rank: 19,
        name: 'Soar Eagles',
        username: '@soareagles',
        avatar: 'Soar+Eagles',
        points: 85,
        wins: 2,
        losses: 13,
        games: 15,
        trend: -2,
        category: 'Women\'s',
        spirit: 8.7
    },
    {
        rank: 20,
        name: 'Zephyr Zappers',
        username: '@zephyrzappers',
        avatar: 'Zephyr+Zappers',
        points: 82,
        wins: 1,
        losses: 14,
        games: 15,
        trend: -3,
        category: 'Open',
        spirit: 7.0
    }
];

    // Get elements
    const rankingsList = document.getElementById('rankingsList');
    const searchInput = document.getElementById('teamSearch');
    const sortSelect = document.getElementById('sortBy');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'All Teams';
    let currentSort = 'points';
    
    // ========================================
    // RENDER RANKINGS FUNCTION
    // ========================================
    function renderRankings(teams) {
        rankingsList.innerHTML = '';
        
        teams.forEach(team => {
            const card = createRankingCard(team);
            rankingsList.appendChild(card);
        });
        
        // Add fade-in animation
        setTimeout(() => {
            document.querySelectorAll('.ranking-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(-20px)';
                    card.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0)';
                    }, 50);
                }, index * 50);
            });
        }, 100);
    }
    
    // ========================================
    // CREATE RANKING CARD HTML
    // ========================================
    function createRankingCard(team) {
        const card = document.createElement('div');
        card.className = 'ranking-card';
        
        // Trend indicator
        let trendHTML = '';
        if (team.trend > 0) {
            trendHTML = `<span class="trend trend-up">↑ +${team.trend}</span>`;
        } else if (team.trend < 0) {
            trendHTML = `<span class="trend trend-down">↓ ${team.trend}</span>`;
        } else {
            trendHTML = `<span class="trend">→ 0</span>`;
        }
        
        // Avatar color based on rank
        const colors = ['98C9A3', 'BFD8BD', 'DDE7C7', 'EDEEC9'];
        const colorIndex = (team.rank - 4) % colors.length;
        const avatarColor = colors[colorIndex];
        
        card.innerHTML = `
            <span class="rank">${team.rank}</span>
            <img src="https://ui-avatars.com/api/?name=${team.avatar}&background=${avatarColor}&color=2d5940&size=60" 
                 alt="Avatar" class="ranking-avatar">
            <div class="ranking-info">
                <h4 class="ranking-name">${team.name}</h4>
                <span class="ranking-username">${team.username}</span>
            </div>
            <div class="ranking-stats">
                <span class="stat-item"><strong>${team.points}</strong> pts</span>
                <span class="stat-item"><strong>${team.wins}-${team.losses}</strong> W-L</span>
                <span class="stat-item"><strong>${team.games}</strong> games</span>
                ${trendHTML}
            </div>
        `;
        
        return card;
    }
    
    // ========================================
    // FILTER FUNCTIONALITY
    // ========================================
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.textContent;
            console.log('Filter changed to:', currentFilter);
            
            applyFiltersAndSort();
        });
    });
    
    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('Searching for:', this.value);
            applyFiltersAndSort();
        });
    }
    
    // ========================================
    // SORT FUNCTIONALITY
    // ========================================
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            console.log('Sort changed to:', currentSort);
            applyFiltersAndSort();
        });
    }
    
    // ========================================
    // APPLY FILTERS AND SORTING
    // ========================================
    function applyFiltersAndSort() {
        let filteredTeams = [...teamsData];
        
        // Apply category filter
        if (currentFilter !== 'All Teams') {
            filteredTeams = filteredTeams.filter(team => team.category === currentFilter);
        }
        
        // Apply search filter
        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filteredTeams = filteredTeams.filter(team => 
                team.name.toLowerCase().includes(searchTerm) ||
                team.username.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply sorting
        filteredTeams.sort((a, b) => {
            if (currentSort === 'points') {
                return b.points - a.points;
            } else if (currentSort === 'wins') {
                return b.wins - a.wins;
            } else if (currentSort === 'spirit') {
                return b.spirit - a.spirit;
            }
            return 0;
        });
        
        // Update rank numbers after sorting
        filteredTeams.forEach((team, index) => {
            team.rank = index + 4; // Start from 4 since top 3 are in podium
        });
        
        renderRankings(filteredTeams);
    }
    
    // ========================================
    // INITIAL RENDER
    // ========================================
    renderRankings(teamsData);
    
    // ========================================
    // SMOOTH SCROLL FOR BACK BUTTON
    // ========================================
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            // If on same page, smooth scroll to top
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
});

// ========================================
// HELPER FUNCTION: FETCH FROM BACKEND (Future)
// ========================================
async function fetchLeaderboardData(tournamentId) {
    try {
        const response = await fetch(`YOUR_BACKEND_URL/api/leaderboard/${tournamentId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.teams;
        } else {
            console.error('Error fetching leaderboard:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Network error:', error);
        return [];
    }
}
// Toggle rankings expansion
const toggleBtn = document.getElementById('toggleRankings');
if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
        const rankingsList = document.getElementById('rankingsList');
        
        if (rankingsList.style.maxHeight === 'none') {
            rankingsList.style.maxHeight = '600px';
            this.textContent = 'Show All Rankings';
        } else {
            rankingsList.style.maxHeight = 'none';
            this.textContent = 'Show Less';
        }
    });
}
