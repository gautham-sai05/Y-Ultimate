// ========================================
// Coach Dashboard JavaScript
// ========================================

// Load dashboard stats
async function loadDashboardStats() {
  const stats = await fetchData(`/coach/stats?coach_id=${COACH_ID}`);

  if (stats) {
    // Map backend stats to dashboard elements
    document.getElementById('upcomingSessions').textContent = stats.upcoming_sessions || 0;
    document.getElementById('avgAttendance').textContent = formatPercent(stats.avg_attendance || 0);
    document.getElementById('childrenTracked').textContent = stats.total_children || 0;
    document.getElementById('homeVisits').textContent = stats.home_visits || 0;
  }
}

// Load recent activities
async function loadRecentActivities() {
  const activities = await fetchData(`/coach/activities?coach_id=${COACH_ID}&limit=5`);

  if (activities && Array.isArray(activities)) {
    const tbody = document.getElementById('recentActivities') || document.querySelector('table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    activities.forEach(act => {
      const badge = act.status === 'Completed' ? 'success' : 
                    act.status === 'Recorded' ? 'info' :
                    act.status === 'Pending' ? 'warning' : 'secondary';

      tbody.innerHTML += `<tr>
        <td>${formatDate(act.date)}</td>
        <td>${act.type}</td>
        <td>${act.child}</td>
        <td><span class="badge bg-${badge}">${act.status}</span></td>
      </tr>`;
    });
  }
}

// Load attendance trend chart
async function loadAttendanceChart() {
  const data = await fetchData(`/coach/reports/attendance_trend?coach_id=${COACH_ID}`);

  if (data && window.Chart) {
    const ctx = document.getElementById('attendanceChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Attendance %',
          data: data.values || [85, 90, 80, 95, 92],
          borderColor: '#77BFA3',
          backgroundColor: 'rgba(119,191,163,0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}

// Load LSAS chart
async function loadLSASChart() {
  const data = await fetchData(`/coach/reports/lsas_trend?coach_id=${COACH_ID}`);

  if (data && window.Chart) {
    const ctx = document.getElementById('lsasChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels || ['Respect', 'Teamwork', 'Fair Play', 'Self-Control', 'Communication'],
        datasets: [{
          label: 'Average Score',
          data: data.values || [3.6, 3.9, 3.2, 3.8, 4.0],
          backgroundColor: '#98C9A3'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 4 } }
      }
    });
  }
}

// Notifications are handled centrally by `main.js` via refreshNotifications().
// Dashboard can call the shared refresher if needed; see `js/main.js`.

// Load upcoming games
async function loadUpcomingGames() {
  const games = await fetchData(`/coach/upcoming_games?coach_id=${COACH_ID}&limit=5`);

  if (games && Array.isArray(games)) {
    const tbody = document.getElementById('upcomingGames');
    if (!tbody) return;
    tbody.innerHTML = '';

    games.forEach(g => {
      tbody.innerHTML += `<tr>
        <td>${formatDate(g.date)}</td>
        <td>${g.opponent}</td>
        <td>${g.location}</td>
        <td>${g.time}</td>
        <td><span class="badge bg-${g.status === 'Scheduled' ? 'success' : g.status === 'Pending' ? 'warning' : 'secondary'}">${g.status}</span></td>
      </tr>`;
    });
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
  loadRecentActivities();
  loadAttendanceChart();
  loadLSASChart();
  // Notification preview and badge are handled centrally in `js/main.js` via refreshNotifications().
  loadUpcomingGames();

  // Refresh stats every 30 seconds
  setInterval(loadDashboardStats, 30000);
  setInterval(loadUpcomingGames, 60000);
});
