// ========================================
// Sponsor Dashboard JavaScript
// ========================================

const SPONSOR_ID = localStorage.getItem('sponsorId') || '1';
let allChildren = [];

// Load sponsor statistics
async function loadSponsorStats() {
  const stats = await fetchData(`/sponsor/${SPONSOR_ID}/stats`);

  if (stats) {
    document.getElementById('totalSponsored').textContent = stats.total_sponsored || 0;
    document.getElementById('avgAttendance').textContent = formatPercent(stats.avg_attendance || 0);
    document.getElementById('avgLSAS').textContent = stats.avg_lsas ? stats.avg_lsas.toFixed(1) : '--';
    document.getElementById('totalImpact').textContent = stats.total_sessions || 0;
  }
}

// Load sponsored children
async function loadSponsoredChildren() {
  const children = await fetchData(`/sponsor/${SPONSOR_ID}/children`);

  if (children && Array.isArray(children)) {
    allChildren = children;
    renderChildrenTable(children);
  }
}

// Render children table
function renderChildrenTable(children) {
  const tbody = document.getElementById('sponsoredChildren');
  tbody.innerHTML = '';

  children.forEach(child => {
    const progressBadge = child.progress === 'Excellent' ? 'success' :
                          child.progress === 'Good' ? 'info' :
                          child.progress === 'Needs Improvement' ? 'warning' : 'secondary';

    const programBadge = child.program === 'Foundation' ? 'success' :
                         child.program === 'Intermediate' ? 'info' : 'warning';

    tbody.innerHTML += `<tr>
      <td><strong>${child.name}</strong></td>
      <td>${child.age}</td>
      <td><span class="badge bg-${programBadge}">${child.program}</span></td>
      <td>${child.school}</td>
      <td>${child.attendance}%</td>
      <td>${child.lsas_avg || '--'}</td>
      <td><span class="badge bg-${progressBadge}">${child.progress || 'N/A'}</span></td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="viewChildDetails(${child.id})">
          <i class="bi bi-eye"></i> View
        </button>
      </td>
    </tr>`;
  });
}

// Load attendance trend chart
async function loadAttendanceChart() {
  const data = await fetchData(`/sponsor/${SPONSOR_ID}/attendance_trend`);

  if (data && window.Chart) {
    const ctx = document.getElementById('attendanceChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Average Attendance %',
          data: data.values || [85, 88, 90, 87, 92, 89],
          borderColor: '#77BFA3',
          backgroundColor: 'rgba(119,191,163,0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }
}

// Load program distribution chart
async function loadProgramChart() {
  const data = await fetchData(`/sponsor/${SPONSOR_ID}/program_distribution`);

  if (data && window.Chart) {
    const ctx = document.getElementById('programChart');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels || ['Foundation', 'Intermediate', 'Advanced'],
        datasets: [{
          data: data.values || [45, 35, 20],
          backgroundColor: ['#BFD8BD', '#98C9A3', '#77BFA3']
        }]
      },
      options: { responsive: true }
    });
  }
}

// View child details in modal
window.viewChildDetails = async function(childId) {
  const child = await fetchData(`/child/${childId}/detailed`);

  if (child) {
    const modal = new bootstrap.Modal(document.getElementById('childDetailModal'));
    document.getElementById('childDetailTitle').textContent = `${child.name} - Progress Report`;

    const modalBody = document.getElementById('childDetailBody');
    modalBody.innerHTML = `
      <!-- Child Info -->
      <div class="row mb-4">
        <div class="col-md-6">
          <h6>Personal Information</h6>
          <p><strong>Name:</strong> ${child.name}</p>
          <p><strong>Age:</strong> ${child.age}</p>
          <p><strong>Gender:</strong> ${child.gender}</p>
          <p><strong>School:</strong> ${child.school}</p>
          <p><strong>Program:</strong> ${child.program}</p>
        </div>
        <div class="col-md-6">
          <h6>Performance Metrics</h6>
          <p><strong>Overall Attendance:</strong> ${child.attendance}%</p>
          <p><strong>Sessions Attended:</strong> ${child.sessions_attended}</p>
          <p><strong>LSAS Average:</strong> ${child.lsas_avg}/4</p>
          <p><strong>Coach:</strong> ${child.coach_name}</p>
        </div>
      </div>

      <!-- LSAS Breakdown -->
      <div class="mb-4">
        <h6>Life Skills Assessment Breakdown</h6>
        <div class="row">
          <div class="col-md-6">
            <canvas id="childLSASChart"></canvas>
          </div>
          <div class="col-md-6">
            <canvas id="childAttendanceChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Coach Remarks -->
      <div class="mb-4">
        <h6>Recent Coach Remarks</h6>
        <div id="childRemarks">
          ${child.remarks && child.remarks.length > 0 ? 
            child.remarks.map(r => `
              <div class="border-start border-4 border-success ps-3 mb-2">
                <small class="text-muted">${formatDate(r.date)}</small>
                <p class="mb-0">${r.comment}</p>
              </div>
            `).join('') : 
            '<p class="text-muted">No remarks yet.</p>'
          }
        </div>
      </div>
    `;

    modal.show();

    // Render charts in modal
    setTimeout(() => {
      renderChildCharts(child);
    }, 300);
  }
};

// Render charts in child detail modal
function renderChildCharts(child) {
  // LSAS Radar Chart
  const lsasCtx = document.getElementById('childLSASChart');
  if (lsasCtx && child.lsas) {
    new Chart(lsasCtx, {
      type: 'radar',
      data: {
        labels: ['Respect', 'Teamwork', 'Fair Play', 'Self-Control', 'Communication'],
        datasets: [{
          label: 'LSAS Scores',
          data: [child.lsas.respect, child.lsas.teamwork, child.lsas.fair_play, 
                 child.lsas.self_control, child.lsas.communication],
          backgroundColor: 'rgba(119,191,163,0.2)',
          borderColor: '#77BFA3'
        }]
      },
      options: {
        scales: { r: { beginAtZero: true, max: 4 } }
      }
    });
  }

  // Attendance Trend Chart
  const attCtx = document.getElementById('childAttendanceChart');
  if (attCtx && child.attendance_history) {
    new Chart(attCtx, {
      type: 'line',
      data: {
        labels: child.attendance_history.labels,
        datasets: [{
          label: 'Attendance %',
          data: child.attendance_history.values,
          borderColor: '#77BFA3',
          backgroundColor: 'rgba(119,191,163,0.2)',
          fill: true
        }]
      },
      options: {
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }
}

// Search functionality
document.getElementById('searchChild')?.addEventListener('keyup', (e) => {
  const search = e.target.value.toLowerCase();
  const filtered = allChildren.filter(child => 
    child.name.toLowerCase().includes(search) ||
    child.school.toLowerCase().includes(search)
  );
  renderChildrenTable(filtered);
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Show logged-in sponsor name if available from login
  const sponsorNameEl = document.getElementById('sponsorName');
  const storedSponsor = localStorage.getItem('sponsorName') || localStorage.getItem('displayName');
  if (sponsorNameEl && storedSponsor) sponsorNameEl.textContent = storedSponsor;

  loadSponsorStats();
  loadSponsoredChildren();
  loadAttendanceChart();
  loadProgramChart();
});
