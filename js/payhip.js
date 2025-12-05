(() => {
  const payhipButton = document.getElementById('payhip-button');
  const statusEl = document.getElementById('payment-status');
  const successMessage = document.getElementById('success-message');

  if (!payhipButton) return;

  const showSuccessMessage = () => {
    if (successMessage) {
      successMessage.setAttribute('aria-hidden', 'false');
      successMessage.style.display = 'block';
      successMessage.classList.add('active');
    }
    if (statusEl) {
      statusEl.textContent = 'Payment successful!';
      statusEl.dataset.state = 'success';
    }
  };

  const initPayhip = () => {
    // Payhip automatically opens in a popup/overlay when button has data-payhip-button="true"
    // The Payhip script handles the popup functionality automatically
    
    // Listen for payment success events via postMessage
    window.addEventListener('message', (event) => {
      // Payhip sends postMessage events on payment completion
      if (event.data) {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && (data.type === 'payhip-payment-success' || data.payhip === 'success')) {
            showSuccessMessage();
          }
        } catch (e) {
          // If event.data is not JSON, check if it's a string indicating success
          if (typeof event.data === 'string' && event.data.includes('payhip') && event.data.includes('success')) {
            showSuccessMessage();
          }
        }
      }
    });

    // Prevent default link behavior to ensure popup (Payhip script should handle this, but just in case)
    if (payhipButton) {
      payhipButton.addEventListener('click', (e) => {
        // Payhip script with data-payhip-button="true" should handle popup automatically
        // We don't prevent default to let Payhip handle it
        if (statusEl) {
          statusEl.textContent = 'Opening checkout...';
          statusEl.dataset.state = 'loading';
        }
      });

      // Check for success in URL parameters (in case Payhip redirects back)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payhip') === 'success' || urlParams.get('payment') === 'success') {
        showSuccessMessage();
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };

  // Initialize Payhip after DOM and script are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initPayhip, 500);
    }, { once: true });
  } else {
    setTimeout(initPayhip, 500);
  }
})();
