// ========================================
// Children List JavaScript
// ========================================

let allChildren = [];

// Load children list
async function loadChildrenList(filters = {}) {
  const query = new URLSearchParams({
    coach_id: COACH_ID,
    program: filters.program || '',
    community: filters.community || '',
    search: filters.search || ''
  }).toString();

  const children = await fetchData(`/coach/children?${query}`);

  if (children && Array.isArray(children)) {
    allChildren = children;
    renderChildrenTable(children);
  }
}

// Render children in table
function renderChildrenTable(children) {
  const tbody = document.getElementById('childrenTable');
  tbody.innerHTML = '';

  children.forEach(child => {
    const badgeColor = child.program === 'Foundation' ? 'success' :
                       child.program === 'Intermediate' ? 'info' : 'warning';

    tbody.innerHTML += `<tr>
      <td><strong>${child.name}</strong></td>
      <td>${child.gender}</td>
      <td>${child.age || '--'}</td>
      <td>${child.school}</td>
      <td><span class="badge bg-${badgeColor}">${child.program}</span></td>
      <td>${child.attendance}%</td>
      <td>
        <a href="child-profile.html?id=${child.id}" class="btn btn-sm btn-primary">
          <i class="bi bi-eye"></i> View
        </a>
      </td>
    </tr>`;
  });
}

// Search functionality
document.getElementById('childSearch')?.addEventListener('keyup', (e) => {
  const search = e.target.value.toLowerCase();
  const filtered = allChildren.filter(child => 
    child.name.toLowerCase().includes(search)
  );
  renderChildrenTable(filtered);
});

// Program filter
document.getElementById('programFilter')?.addEventListener('change', () => {
  loadChildrenList({
    program: document.getElementById('programFilter').value,
    community: document.getElementById('communityFilter').value
  });
});

// Community filter
document.getElementById('communityFilter')?.addEventListener('change', () => {
  loadChildrenList({
    program: document.getElementById('programFilter').value,
    community: document.getElementById('communityFilter').value
  });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadChildrenList();
  // Export handlers
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => exportChildren('csv'));
  document.getElementById('exportPdfBtn')?.addEventListener('click', () => exportChildren('pdf'));
});

// Export children list (downloads CSV or PDF)
async function exportChildren(format = 'csv') {
  try {
    const url = `/coach/children/export?format=${encodeURIComponent(format)}`;
    const res = await fetchData(url, 'GET', null, true); // raw

    if (!res) {
      showError('Export failed');
      return;
    }

    const blob = await res.blob();
    const filename = `children_export.${format === 'pdf' ? 'pdf' : 'csv'}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showSuccess(`Downloaded ${filename}`);
  } catch (err) {
    showError('Export failed: ' + (err.message || err));
  }
}
