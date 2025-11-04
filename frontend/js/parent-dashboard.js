// ========================================
// Parent Dashboard JavaScript
// ========================================

const PARENT_ID = localStorage.getItem('parentId') || '1';
let currentChildId = null;

// Load parent's children
async function loadChildren() {
  const children = await fetchData(`/parent/${PARENT_ID}/children`);

  if (children && Array.isArray(children)) {
    const select = document.getElementById('childSelect');
    select.innerHTML = '<option value="">-- Select a child --</option>';

    children.forEach(child => {
      const option = document.createElement('option');
      option.value = child.id;
      option.textContent = child.name;
      select.appendChild(option);
    });

    // Auto-select first child if available
    if (children.length > 0) {
      select.value = children[0].id;
      loadChildData();
    }
  }
}

// Load child data
window.loadChildData = async function() {
  const childId = document.getElementById('childSelect').value;

  if (!childId) return;

  currentChildId = childId;

  // Load all child data
  await Promise.all([
    loadChildInfo(),
    loadChildStats(),
    loadAttendanceChart(),
    loadLSASChart(),
    loadCoachRemarks(),
    loadRecentAttendance()
  ]);
};

// Load child info
async function loadChildInfo() {
  const child = await fetchData(`/child/${currentChildId}`);

  if (child) {
    document.getElementById('childName').textContent = child.name;
    document.getElementById('childDetails').innerHTML = `
      <span><i class="bi bi-person-fill me-1"></i> ${child.gender}</span>
      <span><i class="bi bi-calendar-event me-1"></i> Age: ${child.age}</span>
      <span><i class="bi bi-building me-1"></i> ${child.school}</span>
      <span><i class="bi bi-trophy me-1"></i> ${child.program} Program</span>
    `;
    document.getElementById('overallAttendance').textContent = child.attendance + '%';
  }
}

// Load child statistics
async function loadChildStats() {
  const stats = await fetchData(`/child/${currentChildId}/stats`);

  if (stats) {
    document.getElementById('sessionsAttended').textContent = stats.sessions_attended || 0;
    document.getElementById('lsasAverage').textContent = stats.lsas_average || '--';
    document.getElementById('coachVisits').textContent = stats.coach_visits || 0;
    document.getElementById('achievements').textContent = stats.achievements || 0;
  }
}

// Load attendance chart
async function loadAttendanceChart() {
  const data = await fetchData(`/child/${currentChildId}/attendance_trend`);

  if (data && window.Chart) {
    const ctx = document.getElementById('attendanceChart');

    // Destroy existing chart if any
    if (ctx.chart) ctx.chart.destroy();

    ctx.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [{
          label: 'Attendance Rate',
          data: data.values || [85, 90, 88, 95, 92, 90, 93, 95],
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

// Load LSAS chart
async function loadLSASChart() {
  const data = await fetchData(`/child/${currentChildId}/lsas_latest`);

  if (data && window.Chart) {
    const ctx = document.getElementById('lsasChart');

    // Destroy existing chart if any
    if (ctx.chart) ctx.chart.destroy();

    ctx.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Respect', 'Teamwork', 'Fair Play', 'Self-Control', 'Communication'],
        datasets: [{
          label: 'Current Score',
          data: data.values || [3.5, 3.8, 3.2, 3.6, 4.0],
          backgroundColor: 'rgba(119,191,163,0.2)',
          borderColor: '#77BFA3',
          pointBackgroundColor: '#77BFA3',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#77BFA3'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 4,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
}

// Load coach remarks
async function loadCoachRemarks() {
  const remarks = await fetchData(`/child/${currentChildId}/coach_remarks?limit=5`);

  if (remarks && Array.isArray(remarks)) {
    const container = document.getElementById('coachRemarks');
    container.innerHTML = '';

    if (remarks.length === 0) {
      container.innerHTML = '<p class="text-muted">No coach remarks yet.</p>';
      return;
    }

    remarks.forEach(remark => {
      container.innerHTML += `
        <div class="border-start border-4 border-success ps-3 mb-3">
          <div class="d-flex justify-content-between">
            <strong>${remark.coach_name}</strong>
            <small class="text-muted">${formatDate(remark.date)}</small>
          </div>
          <p class="mb-1">${remark.comment}</p>
          ${remark.lsas_score ? `<small class="text-muted">LSAS Average: ${remark.lsas_score}/4</small>` : ''}
        </div>
      `;
    });
  }
}

// Load recent attendance
async function loadRecentAttendance() {
  const attendance = await fetchData(`/child/${currentChildId}/attendance?limit=10`);

  if (attendance && Array.isArray(attendance)) {
    const tbody = document.getElementById('recentAttendance');
    tbody.innerHTML = '';

    attendance.forEach(record => {
      const badge = record.status === 'Present' ? 'success' : 'danger';
      tbody.innerHTML += `<tr>
        <td>${formatDate(record.date)}</td>
        <td>${record.session_type}</td>
        <td><span class="badge bg-${badge}">${record.status}</span></td>
        <td>${record.coach_name}</td>
      </tr>`;
    });
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Show logged-in parent name if available from login
  const parentNameEl = document.getElementById('parentName');
  const storedParent = localStorage.getItem('parentName') || localStorage.getItem('displayName');
  if (parentNameEl && storedParent) parentNameEl.textContent = storedParent;

  loadChildren();
});
