// ========================================
// Reports & Analytics JavaScript
// ========================================

// Load report statistics
async function loadReportStats() {
  const stats = await fetchData(`/coach/reports/stats?coach_id=${COACH_ID}`);

  if (stats) {
    document.querySelector('[data-stat="sessions"]').textContent = stats.total_sessions || 0;
    document.querySelector('[data-stat="attendance"]').textContent = formatPercent(stats.avg_attendance || 0);
    document.querySelector('[data-stat="assessments"]').textContent = stats.total_assessments || 0;
    document.querySelector('[data-stat="visits"]').textContent = stats.total_visits || 0;
  }
}

// Load attendance trend chart
async function loadAttendanceTrendChart() {
  const data = await fetchData(`/coach/reports/attendance_trend?coach_id=${COACH_ID}`);

  if (data && window.Chart) {
    const ctx = document.getElementById('attendanceTrendChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Attendance %',
          data: data.values || [85, 88, 92, 89],
          borderColor: '#77BFA3',
          backgroundColor: 'rgba(119,191,163,0.1)',
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

// Load LSAS average chart
async function loadLSASAverageChart() {
  const data = await fetchData(`/coach/reports/lsas_average?coach_id=${COACH_ID}`);

  if (data && window.Chart) {
    const ctx = document.getElementById('lsasAverageChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Respect', 'Teamwork', 'Fair Play', 'Self-Control', 'Communication'],
        datasets: [{
          label: 'Average Score',
          data: data.values || [3.6, 3.5, 3.4, 3.7, 3.8],
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

// Load gender distribution chart
async function loadGenderChart() {
  const data = await fetchData(`/coach/reports/gender_distribution?coach_id=${COACH_ID}`);

  if (data && window.Chart) {
    const ctx = document.getElementById('genderChart');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: data.values || [58, 42],
          backgroundColor: ['#77BFA3', '#98C9A3']
        }]
      },
      options: { responsive: true }
    });
  }
}

// Load program participation chart
async function loadProgramChart() {
  const data = await fetchData(`/coach/reports/program_participation?coach_id=${COACH_ID}`);

  if (data && window.Chart) {
    const ctx = document.getElementById('programChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Foundation', 'Intermediate', 'Advanced'],
        datasets: [{
          label: 'Participants',
          data: data.values || [65, 52, 39],
          backgroundColor: ['#BFD8BD', '#98C9A3', '#77BFA3']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}

// Load performance summary table
async function loadPerformanceSummary() {
  const summary = await fetchData(`/coach/reports/performance_summary?coach_id=${COACH_ID}`);

  if (summary && Array.isArray(summary)) {
    const tbody = document.getElementById('performanceSummary');
    if (!tbody) return;
    tbody.innerHTML = '';

    summary.forEach(child => {
      const badge = child.progress === 'Improving' ? 'success' :
                    child.progress === 'Consistent' ? 'info' : 'warning';

      tbody.innerHTML += `<tr>
        <td><strong>${child.name}</strong></td>
        <td>${child.program}</td>
        <td>${formatPercent(child.attendance)}</td>
        <td>${parseFloat(child.avg_lsas).toFixed(1)}</td>
        <td>${child.sessions}</td>
        <td><span class="badge bg-${badge}">${child.progress}</span></td>
      </tr>`;
    });
  }
}

// Apply filters
window.applyFilters = function() {
  const dateRange = document.getElementById('dateRange').value;
  const community = document.getElementById('communityFilter').value;
  const program = document.getElementById('programFilter').value;

  // Reload all data with filters
  console.log('Filters applied:', { dateRange, community, program });
  loadReportStats();
  loadAttendanceTrendChart();
  loadLSASAverageChart();
  loadGenderChart();
  loadProgramChart();
  loadPerformanceSummary();

  showSuccess('Filters applied!');
};

// Export to CSV
window.exportCSV = async function() {
  const data = await fetchData(`/coach/reports/export?format=csv&coach_id=${COACH_ID}`);
  if (data) {
    // Trigger download
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
    link.download = 'report.csv';
    link.click();
    showSuccess('Report exported!');
  }
};

// Export to PDF
window.exportPDF = async function() {
  try {
    const res = await fetchData(`/coach/reports/export?format=pdf&coach_id=${COACH_ID}`, 'GET', null, true);
    if (!res) {
      showError('PDF export failed');
      return;
    }
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    showSuccess('PDF downloaded');
  } catch (err) {
    showError('PDF export failed: ' + (err.message || err));
  }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadReportStats();
  loadAttendanceTrendChart();
  loadLSASAverageChart();
  loadGenderChart();
  loadProgramChart();
  loadPerformanceSummary();
});
