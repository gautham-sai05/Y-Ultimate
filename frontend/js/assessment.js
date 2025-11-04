// ========================================
// Assessment (LSAS) JavaScript
// ========================================

// Load children for assessment
async function loadAssessmentChildren() {
  const children = await fetchData(`/coach/children?coach_id=${COACH_ID}`);

  if (children && Array.isArray(children)) {
    const select = document.getElementById('childSelect');
    children.forEach(child => {
      const option = document.createElement('option');
      option.value = child.id;
      option.textContent = child.name;
      select.appendChild(option);
    });
  }
}

// Load previous assessments
async function loadPreviousAssessments() {
  const assessments = await fetchData(`/coach/assessments?coach_id=${COACH_ID}&limit=10`);

  if (assessments && Array.isArray(assessments)) {
    const tbody = document.querySelector('#lsasHistoryTable table tbody') || createAssessmentTable();
    tbody.innerHTML = '';

    assessments.forEach(assess => {
      const avg = ((parseFloat(assess.respect) + parseFloat(assess.teamwork) + parseFloat(assess.fair_play) + 
                    parseFloat(assess.self_control) + parseFloat(assess.communication)) / 5).toFixed(1);

      tbody.innerHTML += `<tr>
        <td>${formatDate(assess.date)}</td>
        <td>${assess.child_name}</td>
        <td>${assess.respect}</td>
        <td>${assess.teamwork}</td>
        <td>${assess.fair_play}</td>
        <td>${assess.self_control}</td>
        <td>${assess.communication}</td>
        <td><strong>${avg}</strong></td>
      </tr>`;
    });
  }
}

// Create assessment history table if it doesn't exist
function createAssessmentTable() {
  const container = document.getElementById('lsasHistoryTable');
  const table = document.createElement('div');
  table.className = 'table-responsive';
  table.innerHTML = `<table class="table table-hover">
    <thead>
      <tr>
        <th>Date</th><th>Child</th><th>Respect</th><th>Teamwork</th><th>Fair Play</th>
        <th>Self-Control</th><th>Communication</th><th>Avg</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>`;
  container.appendChild(table);
  return table.querySelector('tbody');
}

// Update value display for sliders
window.updateValue = function(skill) {
  const slider = document.getElementById(skill + 'Slider');
  const badge = document.getElementById(skill + 'Value');
  if (badge) badge.textContent = slider.value;
};

// Submit assessment
window.submitAssessment = async function() {
  const childId = document.getElementById('childSelect').value;
  const assessDate = document.getElementById('assessmentDate').value;

  if (!childId || !assessDate) {
    showError('Please select a child and date!');
    return;
  }

  const payload = {
    coach_id: COACH_ID,
    child_id: childId,
    date: assessDate,
    session_type: document.getElementById('sessionType').value,
    respect: parseInt(document.getElementById('respectSlider').value),
    teamwork: parseInt(document.getElementById('teamworkSlider').value),
    fair_play: parseInt(document.getElementById('fairplaySlider').value),
    self_control: parseInt(document.getElementById('selfcontrolSlider').value),
    communication: parseInt(document.getElementById('communicationSlider').value),
    notes: document.getElementById('assessmentNotes').value
  };

  const result = await fetchData('/lsas', 'POST', payload);

  if (result) {
    showSuccess('Assessment submitted successfully!');

    // Reset form
    document.getElementById('assessmentNotes').value = '';
    document.querySelectorAll('.form-range').forEach(slider => {
      slider.value = 0;
      updateValue(slider.id.replace('Slider', ''));
    });

    // Reload assessments table
    loadPreviousAssessments();
  }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadAssessmentChildren();
  loadPreviousAssessments();

  // Set today's date by default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('assessmentDate').value = today;

  // Add change listeners to all sliders
  ['respect', 'teamwork', 'fairplay', 'selfcontrol', 'communication'].forEach(skill => {
    const slider = document.getElementById(skill + 'Slider');
    if (slider) {
      slider.addEventListener('input', () => updateValue(skill));
    }
  });
});
