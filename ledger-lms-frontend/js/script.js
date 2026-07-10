// Ledger — shared front-end behaviors (no backend wiring; static prototype)

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle: show/hide the .nav-links list on small screens
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '68px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'var(--ink)';
      links.style.padding = '10px';
    });
  }

  // "Mark as completed" buttons: simple visual feedback only
  document.querySelectorAll('button.btn-gold, button.btn-primary').forEach((btn) => {
    if (btn.textContent.toLowerCase().includes('mark')) {
      btn.addEventListener('click', () => {
        btn.textContent = 'Completed ✓';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      });
    }
  });

  // "Mark all as read" on notifications page
  const markAll = document.querySelector('.page-hero button.btn-outline');
  if (markAll && markAll.textContent.includes('Mark all')) {
    markAll.addEventListener('click', () => {
      document.querySelectorAll('.notif-item.unread').forEach((item) => item.classList.remove('unread'));
      markAll.textContent = 'All caught up';
      markAll.disabled = true;
    });
  }

});
