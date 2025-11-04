// ========================================
// Volunteer Dashboard JavaScript
// ========================================

const VOLUNTEER_ID = localStorage.getItem('volunteerId') || '1';

// Load live matches
async function loadLiveMatches() {
  const matches = await fetchData('/matches/live');

  if (matches && Array.isArray(matches)) {
    const container = document.getElementById('liveMatchesList');
    container.innerHTML = '';

    if (matches.length === 0) {
      container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No live matches at the moment</p></div>';
      return;
    }

    matches.forEach(match => {
      const liveCard = `
        <div class="col-md-6">
          <div class="card shadow-sm border-danger border-2">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-danger">
                  <i class="bi bi-broadcast me-1"></i>LIVE
                </span>
                <small class="text-muted">${match.venue}</small>
              </div>

              <div class="row text-center mb-3">
                <div class="col-5">
                  <h5 class="mb-1">${match.team1}</h5>
                  <h2 class="fw-bold text-primary" id="team1Score_${match.id}">${match.team1_score || 0}</h2>
                </div>
                <div class="col-2 d-flex align-items-center justify-content-center">
                  <h4 class="mb-0">VS</h4>
                </div>
                <div class="col-5">
                  <h5 class="mb-1">${match.team2}</h5>
                  <h2 class="fw-bold text-primary" id="team2Score_${match.id}">${match.team2_score || 0}</h2>
                </div>
              </div>

              <div class="text-center">
                <button class="btn btn-primary btn-sm" onclick="openScoreModal(${match.id})">
                  <i class="bi bi-pencil-square me-1"></i>Update Score
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += liveCard;
    });
  }
}

// Load volunteer display name and avatar
async function loadVolunteerProfile() {
  const nameEl = document.getElementById('volunteerName');
  const avatarEl = document.getElementById('volunteerAvatar');

  if (!nameEl) return;

  // Prefer localStorage value (set at login), otherwise fetch profile
  let name = localStorage.getItem('volunteerName');
  let avatar = localStorage.getItem('volunteerAvatar');

  if (!name) {
    const profile = await fetchData(`/volunteer/${VOLUNTEER_ID}`);
    if (profile) {
      name = profile.name || name;
      avatar = profile.avatar_url || avatar;
    }
  }

  // fallback to coach-profile icon when avatar not provided
  if (!avatar) avatar = '../css/icons/coach-profile.png';

  if (name) nameEl.textContent = name;
  if (avatar && avatarEl) avatarEl.src = avatar;
}

// Load upcoming matches
async function loadUpcomingMatches() {
  const matches = await fetchData('/matches/upcoming/today');

  if (matches && Array.isArray(matches)) {
    const tbody = document.getElementById('upcomingMatchesTable');
    tbody.innerHTML = '';

    matches.forEach(match => {
      const statusBadge = match.status === 'live' ? 'danger' :
                          match.status === 'completed' ? 'success' : 'secondary';

      tbody.innerHTML += `<tr>
        <td>${match.time}</td>
        <td><strong>${match.team1}</strong> vs <strong>${match.team2}</strong></td>
        <td>${match.venue}</td>
        <td><span class="badge bg-${statusBadge}">${match.status}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="openScoreModal(${match.id})">
            <i class="bi bi-pencil"></i>
          </button>
        </td>
      </tr>`;
    });
  }
}

// Load recent activities
async function loadRecentActivities() {
  const activities = await fetchData(`/volunteer/${VOLUNTEER_ID}/activities?limit=10`);

  if (activities && Array.isArray(activities)) {
    const tbody = document.getElementById('recentActivities');
    tbody.innerHTML = '';

    activities.forEach(activity => {
      tbody.innerHTML += `<tr>
        <td>${activity.time}</td>
        <td><i class="bi bi-${activity.icon} me-2"></i>${activity.type}</td>
        <td>${activity.match_name}</td>
        <td>${activity.details}</td>
      </tr>`;
    });
  }
}

// Open score modal
window.openScoreModal = async function(matchId) {
  const match = await fetchData(`/matches/${matchId}`);

  if (match) {
    document.getElementById('matchId').value = match.id;
    document.getElementById('team1Name').textContent = match.team1;
    document.getElementById('team2Name').textContent = match.team2;
    document.getElementById('team1Score').value = match.team1_score || 0;
    document.getElementById('team2Score').value = match.team2_score || 0;
    document.getElementById('matchStatus').value = match.status || 'scheduled';
    document.getElementById('matchNotes').value = match.notes || '';

    document.getElementById('scoreModalTitle').textContent = 
      `Update Score: ${match.team1} vs ${match.team2}`;

    const modal = new bootstrap.Modal(document.getElementById('scoreModal'));
    modal.show();
  }
};

// Submit score
window.submitScore = async function() {
  const matchId = document.getElementById('matchId').value;
  const team1Score = parseInt(document.getElementById('team1Score').value) || 0;
  const team2Score = parseInt(document.getElementById('team2Score').value) || 0;
  const status = document.getElementById('matchStatus').value;
  const notes = document.getElementById('matchNotes').value;

  const payload = {
    volunteer_id: VOLUNTEER_ID,
    match_id: matchId,
    team1_score: team1Score,
    team2_score: team2Score,
    status: status,
    notes: notes
  };

  const result = await fetchData('/matches/update_score', 'POST', payload);

  if (result) {
    showSuccess('Score updated successfully!');
    bootstrap.Modal.getInstance(document.getElementById('scoreModal')).hide();

    // Refresh live matches
    // Optimistically update scores in the current page for the updated match
    const mId = String(matchId);
    try {
      const t1El = document.getElementById(`team1Score_${mId}`);
      const t2El = document.getElementById(`team2Score_${mId}`);
      if (t1El) t1El.textContent = String(team1Score);
      if (t2El) t2El.textContent = String(team2Score);
    } catch (e) {
      // ignore DOM update errors
    }

    // Refresh lists to reflect any status changes
    loadLiveMatches();
    loadUpcomingMatches();
    loadRecentActivities();

    // Notify other open pages (live scores public page) to refresh if loaded
    if (window.updateLiveScoresDisplay) window.updateLiveScoresDisplay();
  }
};

// Open attendance modal
window.openAttendanceModal = async function() {
  const matches = await fetchData('/matches/upcoming');

  if (matches && Array.isArray(matches)) {
    const select = document.getElementById('attendanceMatch');
    select.innerHTML = '<option value="">-- Select Match --</option>';

    matches.forEach(match => {
      const option = document.createElement('option');
      option.value = match.id;
      option.textContent = `${match.team1} vs ${match.team2} - ${match.time}`;
      select.appendChild(option);
    });
  }

  const modal = new bootstrap.Modal(document.getElementById('attendanceModal'));
  modal.show();
};

// Load players for attendance
window.loadPlayersForAttendance = async function() {
  const matchId = document.getElementById('attendanceMatch').value;

  if (!matchId) {
    document.getElementById('attendancePlayersTable').innerHTML = '';
    return;
  }

  const players = await fetchData(`/matches/${matchId}/players`);

  if (players && Array.isArray(players)) {
    const tbody = document.getElementById('attendancePlayersTable');
    tbody.innerHTML = '';

    players.forEach((player, index) => {
      tbody.innerHTML += `<tr>
        <td>${index + 1}</td>
        <td>${player.name}</td>
        <td>${player.team}</td>
        <td>
          <input type="radio" name="attendance_${player.id}" value="present" 
                 class="form-check-input attendance-radio" />
        </td>
        <td>
          <input type="radio" name="attendance_${player.id}" value="absent" 
                 class="form-check-input attendance-radio" />
        </td>
      </tr>`;
    });
  }
};

// Mark all present
window.markAllPresent = function() {
  document.querySelectorAll('input[value="present"].attendance-radio').forEach(input => {
    input.checked = true;
  });
  showSuccess('All players marked as present!');
};

// Clear all attendance
window.clearAllAttendance = function() {
  document.querySelectorAll('.attendance-radio').forEach(input => {
    input.checked = false;
  });
};

// Submit attendance
window.submitAttendance = async function() {
  const matchId = document.getElementById('attendanceMatch').value;

  if (!matchId) {
    showError('Please select a match first!');
    return;
  }

  const attendanceData = [];
  const players = document.querySelectorAll('#attendancePlayersTable tr');

  players.forEach(row => {
    const radios = row.querySelectorAll('.attendance-radio');
    const checkedRadio = Array.from(radios).find(r => r.checked);

    if (checkedRadio) {
      const playerId = checkedRadio.name.replace('attendance_', '');
      attendanceData.push({
        player_id: playerId,
        status: checkedRadio.value
      });
    }
  });

  if (attendanceData.length === 0) {
    showError('Please mark attendance for at least one player!');
    return;
  }

  const payload = {
    volunteer_id: VOLUNTEER_ID,
    match_id: matchId,
    attendance: attendanceData
  };

  const result = await fetchData('/tournament/attendance', 'POST', payload);

  if (result) {
    showSuccess('Attendance submitted successfully!');
    bootstrap.Modal.getInstance(document.getElementById('attendanceModal')).hide();
    loadRecentActivities();
  }
};

// Auto-refresh live matches every 30 seconds
let refreshInterval;

function startAutoRefresh() {
  refreshInterval = setInterval(() => {
    loadLiveMatches();
  }, 30000); // 30 seconds
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadLiveMatches();
  loadUpcomingMatches();
  loadRecentActivities();
  loadVolunteerProfile();
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
