(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const sanitizeInput = (value = '') => value.replace(/[^a-zA-Z0-9@._%+-]/g, '').trim();

  const formatStatus = (message, type = 'neutral') => {
    const el = document.getElementById('payment-status');
    if (!el) return;
    el.textContent = message;
    el.dataset.state = type;
  };

  const init = () => {
    document.body.classList.add('page-ready');
  };

  document.addEventListener('DOMContentLoaded', init, { once: true });

  window.LuxUtils = {
    sanitizeInput,
    isValidEmail: (value) => emailRegex.test(value),
    formatStatus,
  };
})();
