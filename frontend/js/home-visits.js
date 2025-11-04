// ========================================
// Home Visits JavaScript
// ========================================

// Load children for visit selection
async function loadVisitChildren() {
  const children = await fetchData(`/coach/children?coach_id=${COACH_ID}`);

  if (children && Array.isArray(children)) {
    const select = document.getElementById('childVisitSelect');
    children.forEach(child => {
      const option = document.createElement('option');
      option.value = child.id;
      option.textContent = child.name;
      select.appendChild(option);
    });
  }
}

// Load visit history
async function loadVisits() {
  const visits = await fetchData(`/visits?coach_id=${COACH_ID}`);

  if (visits && Array.isArray(visits)) {
    const tbody = document.getElementById('visitTable');
    tbody.innerHTML = '';

    visits.forEach(visit => {
      tbody.innerHTML += `<tr>
        <td>${formatDate(visit.date)}</td>
        <td>${visit.child_name}</td>
        <td>${visit.location}</td>
        <td><span class="badge bg-info">${visit.purpose}</span></td>
        <td>${visit.duration || '--'} min</td>
        <td>${visit.notes}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="viewVisit(${visit.id})">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      </tr>`;
    });
  }
}

// Submit visit
window.submitVisit = async function() {
  const visitDate = document.getElementById('visitDate').value;
  const childId = document.getElementById('childVisitSelect').value;
  const location = document.getElementById('visitLocation').value;
  const notes = document.getElementById('visitNotes').value;

  if (!visitDate || !childId || !location || !notes) {
    showError('Please fill in all required fields!');
    return;
  }

  // Collect family members
  const familyPresent = {
    mother: document.getElementById('parentMother').checked,
    father: document.getElementById('parentFather').checked,
    guardian: document.getElementById('parentGuardian').checked,
    sibling: document.getElementById('parentSibling').checked
  };

  const payload = {
    coach_id: COACH_ID,
    child_id: childId,
    date: visitDate,
    location: location,
    purpose: document.getElementById('visitPurpose').value,
    duration: document.getElementById('visitDuration').value,
    notes: notes,
    family_present: familyPresent
  };

  const result = await fetchData('/visits', 'POST', payload);

  if (result) {
    showSuccess('Home visit logged successfully!');

    // Reset form
    document.getElementById('visitForm').reset();
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Reload visits
    loadVisits();
  }
};

// View visit details (optional modal)
window.viewVisit = function(visitId) {
  console.log('View visit:', visitId);
  // You can implement a modal to show full visit details
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadVisitChildren();
  loadVisits();

  // Set today's date by default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('visitDate').value = today;
});
