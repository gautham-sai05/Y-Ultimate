// ========================================
// Notifications JavaScript
// ========================================

// Load all notifications
async function loadAllNotifications() {
  const notifications = await fetchData(`/coach/notifications?coach_id=${COACH_ID}&all=true`);

  if (notifications && Array.isArray(notifications)) {
    renderNotifications(notifications);
  }
}

// Render notifications list
function renderNotifications(notifications) {
  const container = document.getElementById('notificationsList') || document.querySelector('.list-group');
  container.innerHTML = '';

  notifications.forEach(notif => {
    const bgColor = notif.read ? '' : 'style="background-color: #f0f8f5;"';
    const icon = notif.type === 'assessment' ? 'clipboard2-check-fill text-success' :
                 notif.type === 'attendance' ? 'exclamation-circle-fill text-warning' :
                 notif.type === 'visit' ? 'house-heart-fill text-info' :
                 notif.type === 'session' ? 'calendar-check-fill text-primary' : 'bell-fill text-primary';

    const readStatus = notif.read ? 
      `<small class="text-muted" aria-hidden="true"><i class="bi bi-check-circle me-1"></i> Read</small>` :
      `<button class="btn btn-sm btn-outline-success" onclick="markAsRead(${notif.id})" aria-label="Mark notification ${notif.id} as read">
        <i class="bi bi-check-circle me-1" aria-hidden="true"></i> Mark as read
       </button>`;

    container.innerHTML += `
      <div class="list-group-item list-group-item-action" ${bgColor}>
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">
            <i class="bi bi-${icon} me-2"></i>
            <strong>${notif.title}</strong>
          </h6>
          <small class="text-muted">${notif.time_ago}</small>
        </div>
        <p class="mb-1">${notif.message}</p>
        <div class="d-flex gap-2">
          ${readStatus}
          ${notif.action_url ? `<a href="${notif.action_url}" class="btn btn-sm btn-outline-primary">
            <i class="bi bi-arrow-right me-1"></i> ${notif.action_label}
          </a>` : ''}
        </div>
      </div>
    `;
  });
}

// Mark notification as read
window.markAsRead = async function(notifId) {
  const result = await fetchData(`/notifications/${notifId}/read`, 'PUT', {});
  if (result) {
    loadAllNotifications();
  }
};

// Mark all as read
window.markAllAsRead = async function() {
  const result = await fetchData(`/coach/notifications/mark-all-read?coach_id=${COACH_ID}`, 'PUT', {});
  if (result) {
    showSuccess('All notifications marked as read!');
    loadAllNotifications();
  }
};

// Filter by status
document.getElementById('allNotif')?.addEventListener('change', () => {
  loadAllNotifications();
});

document.getElementById('unreadNotif')?.addEventListener('change', async () => {
  const notifications = await fetchData(`/coach/notifications?coach_id=${COACH_ID}&status=unread`);
  if (notifications) renderNotifications(notifications);
});

document.getElementById('readNotif')?.addEventListener('change', async () => {
  const notifications = await fetchData(`/coach/notifications?coach_id=${COACH_ID}&status=read`);
  if (notifications) renderNotifications(notifications);
});

// Load dropdown notifications for navbar
// The navbar preview and badge are handled centrally by `main.js` (refreshNotifications()).
// This file is responsible for the full notifications page rendering only.

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // On notifications.html
  if (document.querySelector('.list-group')) {
    loadAllNotifications();
  }

  // On any page with navbar, let the central refresher handle the preview
  if (typeof refreshNotifications === 'function') {
    refreshNotifications();
    setInterval(refreshNotifications, 30000);
  }
});
