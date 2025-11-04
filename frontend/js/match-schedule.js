// ========================================
// Match Schedule JavaScript
// ========================================

let calendar;

// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    events: fetchMatchEvents,
    eventClick: handleEventClick,
    eventColor: '#77BFA3',
    height: 'auto'
  });

  calendar.render();
  loadUpcomingMatches();
});

// Fetch match events for calendar
async function fetchMatchEvents(info, successCallback, failureCallback) {
  try {
    const matches = await fetchData(`/matches?start=${info.startStr}&end=${info.endStr}`);

    if (matches && Array.isArray(matches)) {
      const events = matches.map(match => ({
        id: match.id,
        title: `${match.team1} vs ${match.team2}`,
        start: match.date + 'T' + match.time,
        extendedProps: match
      }));
      successCallback(events);
    } else {
      successCallback([]);
    }
  } catch (error) {
    console.error('Error fetching matches:', error);
    failureCallback(error);
  }
}

// Load upcoming matches
async function loadUpcomingMatches() {
  const matches = await fetchData('/matches/upcoming?limit=6');

  if (matches && Array.isArray(matches)) {
    const container = document.getElementById('upcomingMatches');
    container.innerHTML = '';

    matches.forEach(match => {
      const matchCard = `
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm h-100 match-card" onclick="showMatchDetails(${match.id})">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-primary">${match.tournament}</span>
                <small class="text-muted">${formatDate(match.date)}</small>
              </div>
              <h5 class="card-title text-center mb-3">
                <strong>${match.team1}</strong>
                <div class="my-2"><i class="bi bi-shield-shaded"></i> VS <i class="bi bi-shield-shaded"></i></div>
                <strong>${match.team2}</strong>
              </h5>
              <div class="text-center">
                <i class="bi bi-clock me-1"></i> ${match.time}
                <br>
                <i class="bi bi-geo-alt me-1"></i> ${match.venue}
              </div>
            </div>
            <div class="card-footer text-center">
              <small class="text-muted">Click for more details</small>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += matchCard;
    });
  }
}

// Handle event click on calendar
function handleEventClick(info) {
  const match = info.event.extendedProps;
  showMatchDetails(match.id);
}

// Show match details in modal
window.showMatchDetails = async function(matchId) {
  const match = await fetchData(`/matches/${matchId}`);

  if (match) {
    const modal = new bootstrap.Modal(document.getElementById('matchModal'));
    document.getElementById('matchModalTitle').textContent = `${match.team1} vs ${match.team2}`;

    const modalBody = document.getElementById('matchModalBody');
    modalBody.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <h6>Team 1</h6>
          <p><strong>${match.team1}</strong></p>
          <ul>
            ${match.team1_players ? match.team1_players.map(p => `<li>${p}</li>`).join('') : '<li>Players TBA</li>'}
          </ul>
        </div>
        <div class="col-md-6">
          <h6>Team 2</h6>
          <p><strong>${match.team2}</strong></p>
          <ul>
            ${match.team2_players ? match.team2_players.map(p => `<li>${p}</li>`).join('') : '<li>Players TBA</li>'}
          </ul>
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
      ${match.description ? `<hr><p><strong>Description:</strong><br>${match.description}</p>` : ''}
    `;

    modal.show();
  }
};

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  .match-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 4px solid var(--color-deep-green);
  }
  .match-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(45, 89, 64, 0.2);
  }
  .fc-event {
    cursor: pointer;
  }
`;
document.head.appendChild(style);
