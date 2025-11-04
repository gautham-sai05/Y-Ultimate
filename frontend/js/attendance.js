// ========================================
// Attendance page JavaScript
// ========================================

// Mark all present
window.markAllPresent = function() {
  document.querySelectorAll('input[value="present"]').forEach(input => {
    input.checked = true;
  });
};

// Clear all selections
window.clearAll = function() {
  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = false;
  });
};

// Submit attendance (placeholder for API integration)
window.submitAttendance = async function() {
  const sessionDate = document.getElementById('sessionDate').value;
  const sessionTime = document.getElementById('sessionTime').value;
  const community = document.getElementById('communitySelect').value;

  if (!sessionDate || !sessionTime || !community) {
    showError('Please fill in all session details before submitting!');
    return;
  }

  const attendanceData = [];
  document.querySelectorAll('#attendanceTable tr').forEach((row) => {
    const selected = row.querySelector('input[type="radio"]:checked');
    if (selected) {
      attendanceData.push({
        childName: row.cells[1].textContent.trim(),
        status: selected.value
      });
    }
  });

  // TODO: Send to backend API using fetchData when FastAPI is ready
  console.log('Attendance Data:', {
    date: sessionDate,
    time: sessionTime,
    community: community,
    attendance: attendanceData
  });

  showSuccess('Attendance submitted successfully! (local only)');
};

// Initialize default values
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const el = document.getElementById('sessionDate');
  if (el && !el.value) el.value = today;
});
