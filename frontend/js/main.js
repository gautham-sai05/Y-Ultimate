// Placeholder main.js for Y-Ultimate-Platform
console.log('Y-Ultimate-Platform: main.js loaded');

// Sidebar toggle for collapsed view
document.addEventListener('DOMContentLoaded', function () {
	var toggle = document.getElementById('sidebarToggle');
	if (!toggle) return;
	toggle.addEventListener('click', function () {
		document.body.classList.toggle('collapsed');
	});
});

// Populate coach name and sign-out
document.addEventListener('DOMContentLoaded', function () {
	const nameEl = document.getElementById('coachNameDisplay');
	const storedName = localStorage.getItem('coachName');
	if (nameEl) {
		nameEl.textContent = storedName || 'Coach';
	}

	// If no coach name in localStorage, try fetching profile from API
	if (!storedName && typeof fetchData === 'function') {
		(async () => {
			try {
				const profile = await fetchData(`/coach/profile?coach_id=${localStorage.getItem('coachId') || ''}`);
				if (profile && profile.name) {
					localStorage.setItem('coachName', profile.name);
					if (nameEl) nameEl.textContent = profile.name;

					// populate sub display (email or role) if present
					const subEl = document.getElementById('coachSubDisplay');
					if (subEl) subEl.textContent = profile.email ? profile.email : (profile.role ? profile.role : 'Coach');
				}
			} catch (e) {
				// ignore; keep default name
				console.warn('Failed to fetch coach profile', e);
			}
		})();
	}

	// Attach signOut on global so buttons can call it
	window.signOut = function() {
		// Clear common auth/display keys
		localStorage.removeItem('coachId');
		localStorage.removeItem('coachName');
		localStorage.removeItem('parentName');
		localStorage.removeItem('sponsorName');
		localStorage.removeItem('volunteerName');
		localStorage.removeItem('displayName');
		localStorage.removeItem('authToken');
		localStorage.removeItem('authEmail');
		showSuccess('Signed out');
		// refresh UI immediately so Sign Out button is hidden
		if (typeof updateSignInState === 'function') updateSignInState();
		// redirect to login page (project login page)
		// Redirect back to the homepage (relative to pages/* files this should resolve to the project home page)
		setTimeout(() => { window.location.href = 'index.html'; }, 600);
	};

	// Attach click handler for any logout anchors/buttons that use id "logoutBtn"
	document.addEventListener('DOMContentLoaded', () => {
		const logoutEl = document.getElementById('logoutBtn');
		if (logoutEl) {
			logoutEl.addEventListener('click', (e) => {
				e.preventDefault();
				window.signOut();
			});
		}
	});

	// Show/hide Sign Out button and populate display names for signed-in users
	function updateSignInState() {
		const signedIn = !!(localStorage.getItem('authToken') || localStorage.getItem('displayName') || localStorage.getItem('coachName') || localStorage.getItem('parentName') || localStorage.getItem('sponsorName') || localStorage.getItem('volunteerName'));

		// Toggle any signOutBtn elements (some pages may have one)
		const signOutBtn = document.getElementById('signOutBtn');
		if (signOutBtn) {
			if (signedIn) signOutBtn.classList.remove('d-none'); else signOutBtn.classList.add('d-none');
		}

		// Populate role-specific name displays if present
		const mappings = [
			{ id: 'coachNameDisplay', key: 'coachName' },
			{ id: 'parentName', key: 'parentName' },
			{ id: 'sponsorName', key: 'sponsorName' },
			{ id: 'volunteerName', key: 'volunteerName' }
		];

		mappings.forEach(m => {
			const el = document.getElementById(m.id);
			if (!el) return;
			const val = localStorage.getItem(m.key) || localStorage.getItem('displayName');
			if (val) el.textContent = val;
		});
	}

	// run once on load
	updateSignInState();

	// expose update for other scripts that may change auth state
	window.updateSignInState = updateSignInState;
});

// Shared notification preview + badge refresher used by all pages.
async function refreshNotifications(previewLimit = 3) {
	if (typeof fetchData !== 'function') return;
	try {
		// Preview items for dropdown
		const preview = await fetchData(`/coach/notifications?coach_id=${localStorage.getItem('coachId') || ''}&limit=${previewLimit}`) || [];

		// Full list (used for unread count when available)
		const all = await fetchData(`/coach/notifications?coach_id=${localStorage.getItem('coachId') || ''}&all=true`) || [];

		// Compute unread count (prefer explicit 'read' flag, fallback to total length)
		let unread = 0;
		if (Array.isArray(all)) {
			if (all.length > 0 && typeof all[0].read !== 'undefined') {
				unread = all.filter(n => !n.read).length;
			} else {
				unread = all.length;
			}
		}

			// Update badge
			const badge = document.getElementById('notifCount');
			if (badge) {
				badge.textContent = unread > 0 ? String(unread) : '';
				if (unread > 0) badge.classList.remove('d-none'); else badge.classList.add('d-none');
				// accessibility: announce number of unread notifications
				badge.setAttribute('aria-label', unread > 0 ? `${unread} unread notifications` : 'No unread notifications');
				badge.setAttribute('aria-live', 'polite');
			}

		// Populate the dropdown menu associated with the notification button (if present)
		const dropdown = document.querySelector('ul.dropdown-menu[aria-labelledby="notificationDropdown"]');
		if (dropdown) {
			let html = '<li class="dropdown-header fw-bold">Notifications</li>';
							(Array.isArray(preview) ? preview : []).forEach(notif => {
								const icon = notif.type === 'assessment' ? 'clipboard2-check-fill text-success' :
														 notif.type === 'attendance' ? 'exclamation-circle-fill text-warning' :
														 notif.type === 'visit' ? 'house-heart-fill text-info' : 'bell-fill text-primary';

								// Use action_url if provided so clicking a notification navigates to the related page
								// Use a relative path that resolves correctly from the current page
								const href = notif.action_url ? notif.action_url : './notifications.html';

								html += `<li>
									<a class="dropdown-item small notif-item" href="${href}">
										<i class="bi bi-${icon} fs-5 me-2" aria-hidden="true"></i>
										<div class="notif-message">
											${notif.message || ''}
											<span class="notif-time">${notif.time || ''}</span>
										</div>
									</a>
								</li>`;
							});
			html += '<li><hr class="dropdown-divider"></li>';
			// Use a relative link so navigation works from the current page location
			html += '<li><a class="dropdown-item text-center fw-semibold" href="./notifications.html">See all notifications</a></li>';
			dropdown.innerHTML = html;
		}
	} catch (e) {
		console.warn('Failed to refresh notifications', e);
	}
}

// Start periodic refresh of notifications (badge + preview)
document.addEventListener('DOMContentLoaded', () => {
	refreshNotifications();
	// refresh every 30s
	setInterval(refreshNotifications, 30000);
});
