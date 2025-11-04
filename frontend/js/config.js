// ========================================
// API Configuration & Helper Functions
// ========================================

// Update this URL to your FastAPI backend
const API_BASE = "http://localhost:8000/api";
const COACH_ID = localStorage.getItem('coachId') || '1'; // Get from login or session

// ========================================
// Helper Functions
// ========================================

// Generic fetch wrapper with error handling
async function fetchData(endpoint, method = 'GET', data = null, raw = false) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        // Add your auth token if needed:
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    if (raw) return response;

    // Attempt to parse JSON, otherwise return text
    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await response.json();
    return await response.text();
  } catch (error) {
    console.error('Fetch error:', error);
    showError(error.message);
    return null;
  }
}

// Show error toast/alert
function showError(message) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.prepend(alert);
  setTimeout(() => alert.remove(), 5000);
}

// Show success toast
function showSuccess(message) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.prepend(alert);
  setTimeout(() => alert.remove(), 3000);
}

// Get URL parameter
function getURLParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Format date
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// Format percentage
function formatPercent(value) {
  return parseFloat(value).toFixed(1) + '%';
}
