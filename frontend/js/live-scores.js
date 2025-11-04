// ========================================
// Live Scores JavaScript (Public Page)
// ========================================

let autoRefreshInterval;

// Load live matches
async function loadLiveMatches() {
  const matches = await fetchData('/matches/live');

  const container = document.getElementById('liveMatchesContainer');
  const countBadge = document.getElementById('liveCount');

  if (!matches || matches.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-broadcast-pin display-1 text-muted mb-3"></i>
            <h5>No Live Matches</h5>
            <p class="text-muted">Check back soon for live updates!</p>
          </div>
        </div>
      </div>
    `;
    countBadge.textContent = '0 matches';
    return;
  }

  countBadge.textContent = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`;
  container.innerHTML = '';

  matches.forEach(match => {
    const matchCard = createLiveMatchCard(match);
    container.innerHTML += matchCard;
  });
}

// Create live match card
function createLiveMatchCard(match) {
  const team1Winning = (match.team1_score || 0) > (match.team2_score || 0);
  const team2Winning = (match.team2_score || 0) > (match.team1_score || 0);

  return `
    <div class="col-md-6">
      <div class="card shadow-sm score-card live" onclick="viewMatchDetail(${match.id})">
        <div class="card-body">
          <!-- Live Badge & Venue -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-danger live-indicator">
              <i class="bi bi-broadcast me-1"></i>LIVE
            </span>
            <small class="text-muted">
              <i class="bi bi-geo-alt me-1"></i>${match.venue}
            </small>
          </div>

          <!-- Teams & Scores -->
          <div class="row text-center">
            <div class="col-5">
              <h5 class="mb-2 ${team1Winning ? 'text-success' : ''}">${match.team1}</h5>
              <div class="score-display ${team1Winning ? 'text-success' : ''}">${match.team1_score || 0}</div>
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center">
              <div class="text-muted">
                <i class="bi bi-shield-shaded fs-3"></i>
              </div>
            </div>
            <div class="col-5">
              <h5 class="mb-2 ${team2Winning ? 'text-success' : ''}">${match.team2}</h5>
              <div class="score-display ${team2Winning ? 'text-success' : ''}">${match.team2_score || 0}</div>
            </div>
          </div>

          <!-- Match Info -->
          <div class="text-center mt-3">
            <small class="text-muted">
              ${match.tournament || 'Tournament'} | ${match.status_text || 'In Progress'}
            </small>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Load recent results
async function loadRecentResults() {
  const results = await fetchData('/matches/recent_results?limit=10');

  if (results && Array.isArray(results)) {
    const tbody = document.getElementById('recentResultsTable');
    tbody.innerHTML = '';

    results.forEach(match => {
      const winner = match.team1_score > match.team2_score ? match.team1 : match.team2;

      tbody.innerHTML += `<tr onclick="viewMatchDetail(${match.id})" style="cursor: pointer;">
        <td>${formatDate(match.date)}</td>
        <td>
          <strong>${match.team1}</strong> vs <strong>${match.team2}</strong>
          ${winner ? `<br><small class="text-success"><i class="bi bi-trophy-fill me-1"></i>Winner: ${winner}</small>` : ''}
        </td>
        <td>
          <span class="badge bg-primary">${match.team1_score}</span>
          -
          <span class="badge bg-primary">${match.team2_score}</span>
        </td>
        <td>${match.venue}</td>
        <td>${match.tournament}</td>
      </tr>`;
    });
  }
}

// Load upcoming matches today
async function loadUpcomingToday() {
  const matches = await fetchData('/matches/upcoming/today');

  const container = document.getElementById('upcomingTodayContainer');

  if (!matches || matches.length === 0) {
    container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No more matches scheduled for today</p></div>';
    return;
  }

  container.innerHTML = '';

  matches.forEach(match => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm score-card" onclick="viewMatchDetail(${match.id})">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span class="badge bg-secondary">${match.time}</span>
              <small class="text-muted">${match.venue}</small>
            </div>
            <h6 class="text-center">
              <strong>${match.team1}</strong>
              <br>
              <small class="text-muted">vs</small>
              <br>
              <strong>${match.team2}</strong>
            </h6>
            <div class="text-center mt-2">
              <small class="text-muted">${match.tournament}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// View match details
window.viewMatchDetail = async function(matchId) {
  const match = await fetchData(`/matches/${matchId}`);

  if (match) {
    const modal = new bootstrap.Modal(document.getElementById('matchDetailModal'));
    document.getElementById('matchDetailTitle').textContent = 
      `${match.team1} vs ${match.team2}`;

    const isLive = match.status === 'live';
    const isCompleted = match.status === 'completed';
    const winner = isCompleted && match.team1_score > match.team2_score ? match.team1 :
                   isCompleted && match.team2_score > match.team1_score ? match.team2 : null;

    document.getElementById('matchDetailBody').innerHTML = `
      ${isLive ? '<div class="alert alert-danger"><i class="bi bi-broadcast me-2"></i>Match is currently live!</div>' : ''}
      ${winner ? `<div class="alert alert-success"><i class="bi bi-trophy-fill me-2"></i>Winner: <strong>${winner}</strong></div>` : ''}

      <div class="row text-center mb-4">
        <div class="col-5">
          <h4>${match.team1}</h4>
          <h1 class="display-3 text-primary">${match.team1_score || 0}</h1>
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
          <h3 class="text-muted">VS</h3>
        </div>
        <div class="col-5">
          <h4>${match.team2}</h4>
          <h1 class="display-3 text-primary">${match.team2_score || 0}</h1>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="col-md-6">
          <p><i class="bi bi-calendar3 me-2"></i><strong>Date:</strong> ${formatDate(match.date)}</p>
          <p><i class="bi bi-clock me-2"></i><strong>Time:</strong> ${match.time}</p>
        </div>
        <div class="col-md-6">
          <p><i class="bi bi-geo-alt me-2"></i><strong>Venue:</strong> ${match.venue}</p>
          <p><i class="bi bi-trophy me-2"></i><strong>Tournament:</strong> ${match.tournament}</p>
        </div>
      </div>

      ${match.notes ? `<hr><p><strong>Notes:</strong><br>${match.notes}</p>` : ''}
    `;

    modal.show();
  }
};

// Update live scores display (called from volunteer dashboard)
window.updateLiveScoresDisplay = function() {
  loadLiveMatches();
  loadRecentResults();
};

// Auto-refresh functionality
function startAutoRefresh() {
  autoRefreshInterval = setInterval(() => {
    loadLiveMatches();
    loadRecentResults();
    loadUpcomingToday();
  }, 30000); // 30 seconds
}

function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadLiveMatches();
  loadRecentResults();
  loadUpcomingToday();
  startAutoRefresh();
});

// Stop refresh when page is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAutoRefresh();
  } else {
    startAutoRefresh();
  }
});

// Stop refresh when leaving page
window.addEventListener('beforeunload', () => {
  stopAutoRefresh();
});
