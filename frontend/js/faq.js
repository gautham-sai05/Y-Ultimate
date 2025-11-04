// ========================================
// FAQ JavaScript
// ========================================

// Search functionality
document.getElementById('faqSearch')?.addEventListener('keyup', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.accordion-button').textContent.toLowerCase();
    const answer = item.querySelector('.accordion-body').textContent.toLowerCase();

    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.style.display = 'block';

      // Highlight matching text if search term exists
      if (searchTerm.length > 2) {
        item.classList.add('highlight');
      } else {
        item.classList.remove('highlight');
      }
    } else {
      item.style.display = 'none';
    }
  });
});

// Category filtering
document.querySelectorAll('.faq-filter').forEach(button => {
  button.addEventListener('click', function() {
    const category = this.getAttribute('data-category');
    const faqItems = document.querySelectorAll('.faq-item');

    // Update active button
    document.querySelectorAll('.faq-filter').forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-primary');
    });
    this.classList.remove('btn-outline-primary');
    this.classList.add('btn-primary');

    // Filter items
    faqItems.forEach(item => {
      if (category === 'all' || item.getAttribute('data-category') === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Load FAQ from backend (optional - if you want dynamic FAQ)
async function loadDynamicFAQ() {
  try {
    const response = await fetch('/api/faq');
    const faqs = await response.json();

    if (faqs && Array.isArray(faqs)) {
      renderFAQ(faqs);
    }
  } catch (error) {
    console.log('Using static FAQ');
  }
}

// Render FAQ dynamically (optional)
function renderFAQ(faqs) {
  const accordion = document.getElementById('faqAccordion');
  // Add logic to render FAQ items dynamically if needed
}

// Analytics - Track which questions are viewed
document.querySelectorAll('.accordion-button').forEach(button => {
  button.addEventListener('click', function() {
    const question = this.textContent.trim();
    console.log('FAQ viewed:', question);

    // Optional: Send analytics to backend
    // fetch('/api/analytics/faq', {
    //   method: 'POST',
    //   body: JSON.stringify({ question: question })
    // });
  });
});

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  .faq-item.highlight {
    border-left: 4px solid var(--color-deep-green);
    background-color: rgba(119, 191, 163, 0.05);
  }

  .accordion-button:not(.collapsed) {
    background-color: var(--color-soft-green);
    color: var(--color-dark-text);
  }

  .accordion-button:focus {
    box-shadow: 0 0 0 0.25rem rgba(119, 191, 163, 0.25);
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set 'All Questions' as active by default
  document.querySelector('.faq-filter[data-category="all"]')?.classList.add('btn-primary');
  document.querySelector('.faq-filter[data-category="all"]')?.classList.remove('btn-outline-primary');
});
