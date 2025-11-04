// ========================================
// Child Profile JavaScript
// ========================================

const childId = getURLParam('id');

// Load child profile
async function loadProfile() {
  if (!childId) {
    showError('No child ID provided');
    return;
  }

  // Load profile header
  const profile = await fetchData(`/child/${childId}`);
  if (profile) {
    document.getElementById('childName').textContent = profile.name;
    document.querySelector('.profile-header p').innerHTML = `
      <span><i class="bi bi-person-fill me-1"></i> ${profile.gender}</span>
      <span><i class="bi bi-calendar-event me-1"></i> Age: ${profile.age}</span>
      <span><i class="bi bi-building me-1"></i> ${profile.school}</span>
      <span><i class="bi bi-trophy me-1"></i> ${profile.program} Program</span>
    `;
    document.querySelector('.profile-header .bg-white').innerHTML = `
      <h5 class="mb-1" style="color: var(--color-deep-green);">${profile.attendance}%</h5>
      <small>Overall Attendance</small>
    `;
  }

  // Load attendance tab
  loadAttendanceTab();

  // Load LSAS tab
  loadLSASTab();

  // Load visits tab
  loadVisitsTab();

  // Load transfers tab
  loadTransfersTab();
}

// Load attendance history
async function loadAttendanceTab() {
  const attendance = await fetchData(`/child/${childId}/attendance`);

  if (attendance && Array.isArray(attendance)) {
    const tbody = document.querySelector('#attendanceTab table tbody');
    tbody.innerHTML = '';

    attendance.forEach(record => {
      const badge = record.status === 'Present' ? 'success' : 'danger';
      tbody.innerHTML += `<tr>
        <td>${formatDate(record.date)}</td>
        <td>${record.session_type}</td>
        <td><span class="badge bg-${badge}">${record.status}</span></td>
      </tr>`;
    });
  }
}

// Load LSAS assessments
async function loadLSASTab() {
  const assessments = await fetchData(`/child/${childId}/lsas`);

  if (assessments && Array.isArray(assessments)) {
    const tbody = document.querySelector('#lsasTab table tbody');
    tbody.innerHTML = '';

    assessments.forEach(record => {
      tbody.innerHTML += `<tr>
        <td>${formatDate(record.date)}</td>
        <td>${record.respect}</td>
        <td>${record.teamwork}</td>
        <td>${record.fair_play}</td>
        <td>${record.self_control}</td>
        <td>${record.communication}</td>
      </tr>`;
    });
  }
}

// Load home visits
async function loadVisitsTab() {
  const visits = await fetchData(`/child/${childId}/visits`);

  if (visits && Array.isArray(visits)) {
    const tbody = document.querySelector('#visitsTab table tbody');
    tbody.innerHTML = '';

    visits.forEach(visit => {
      tbody.innerHTML += `<tr>
        <td>${formatDate(visit.date)}</td>
        <td>${visit.location}</td>
        <td>${visit.notes}</td>
      </tr>`;
    });
  }
}

// Load transfers
async function loadTransfersTab() {
  const transfers = await fetchData(`/child/${childId}/transfers`);

  if (transfers && Array.isArray(transfers)) {
    const tbody = document.querySelector('#transferTab table tbody');
    tbody.innerHTML = '';

    transfers.forEach(transfer => {
      tbody.innerHTML += `<tr>
        <td>${formatDate(transfer.date)}</td>
        <td>${transfer.from_community}</td>
        <td>${transfer.to_community}</td>
        <td>${transfer.reason}</td>
      </tr>`;
    });
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
});

// Remove child flow
document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.getElementById('confirmRemoveBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      const reason = document.getElementById('removeReason').value;
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Removing...';
      try {
        const res = await fetchData(`/child/${childId}/remove`, 'POST', { reason });
        if (res && res.status === 'removed') {
          showSuccess('Child removed successfully. Redirecting to list...');
          // close modal
          const modalEl = document.getElementById('removeChildModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
          setTimeout(() => window.location.href = 'children-list.html', 1200);
        } else {
          showError('Failed to remove child');
        }
      } catch (err) {
        showError('Error removing child: ' + (err.message || err));
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Remove';
      }
    });
  }
});
