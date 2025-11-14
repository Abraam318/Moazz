(() => {
  const form = document.getElementById('pdf-shop-form');
  const emailInput = document.getElementById('client-email');
  const paypalContainer = document.getElementById('paypal-button-container');
  const statusEl = document.getElementById('payment-status');

  if (!form || !emailInput || !paypalContainer) return;

  const state = {
    email: '',
    paypalActions: null,
    busy: false,
    price: '79.00',
  };

  const emailJsConfig = {
    serviceId: 'EMAILJS_SERVICE_ID',
    templateId: 'EMAILJS_TEMPLATE_ID',
    publicKey: 'EMAILJS_PUBLIC_KEY',
  };

  const encodedPdfPath = 'L21lZGlhL0kgYW0gc2hhcmluZyAnRG9jdW1lbnQgKDMwKScgd2l0aCB5b3UucGRm';

  const setStatus = (message, stateType = 'neutral') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.state = stateType;
  };

  const toggleButtonGuard = (enabled) => {
    paypalContainer.classList.toggle('disabled', !enabled);
    if (state.paypalActions) {
      if (enabled) {
        state.paypalActions.enable();
      } else {
        state.paypalActions.disable();
      }
    }
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File conversion failed.'));
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result.split(',')[1]);
        } else {
          reject(new Error('Unable to parse file.'));
        }
      };
      reader.readAsDataURL(blob);
    });

  const fetchPdfBase64 = async () => {
    const response = await fetch(atob(encodedPdfPath), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to access secure asset.');
    }
    const blob = await response.blob();
    return blobToBase64(blob);
  };

  const sendEmail = async (attachmentBase64) => {
    const payload = {
      service_id: emailJsConfig.serviceId,
      template_id: emailJsConfig.templateId,
      user_id: emailJsConfig.publicKey,
      template_params: {
        to_email: state.email,
        subject: 'Moaz Morgan Digital Dossier',
        message: 'Your exclusive PDF is enclosed. Welcome to the inner circle.',
      },
      attachments: [
        {
          name: 'Moaz-Morgan-Dossier.pdf',
          data: attachmentBase64,
        },
      ],
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Email delivery failed.');
    }
  };

  const deliverPdf = async () => {
    try {
      setStatus('Preparing your dossier…', 'loading');
      const base64 = await fetchPdfBase64();
      await sendEmail(base64);
      setStatus('Payment confirmed. PDF sent to your inbox.', 'success');
    } catch (error) {
      console.error(error);
      setStatus('Delivery failed. Please contact support.', 'error');
    } finally {
      state.busy = false;
    }
  };

  const initPayPal = () => {
    if (!window.paypal) {
      console.warn('PayPal SDK missing.');
      return;
    }

    window.paypal
      .Buttons({
        style: {
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          layout: 'vertical',
        },
        onInit: (_, actions) => {
          state.paypalActions = actions;
          actions.disable();
        },
        onClick: () => {
          if (!state.email || state.busy) {
            setStatus('Enter a valid email to continue.', 'error');
            state.paypalActions?.disable();
            return false;
          }
          setStatus('Processing payment…', 'loading');
          return true;
        },
        createOrder: (_, actions) =>
          actions.order.create({
            purchase_units: [
              {
                description: 'Moaz Morgan Luxury PDF',
                amount: {
                  currency_code: 'EUR',
                  value: state.price,
                },
              },
            ],
          }),
        onApprove: (_, actions) => {
          state.busy = true;
          setStatus('Capturing payment…', 'loading');
          return actions.order
            .capture()
            .then(deliverPdf)
            .catch((error) => {
              console.error(error);
              setStatus('Payment capture failed. Please retry.', 'error');
              state.busy = false;
            });
        },
        onError: (error) => {
          console.error(error);
          setStatus('Payment error. Please try again.', 'error');
          state.busy = false;
        },
      })
      .render('#paypal-button-container');
  };

  emailInput.addEventListener('input', (event) => {
    const sanitized = window.LuxUtils?.sanitizeInput(event.target.value) ?? event.target.value.trim();
    event.target.value = sanitized;
    const isValid = window.LuxUtils?.isValidEmail?.(sanitized) ?? false;
    state.email = isValid ? sanitized : '';
    toggleButtonGuard(isValid);
    if (!isValid && sanitized.length > 4) {
      setStatus('Please enter a valid email.', 'error');
    } else if (isValid) {
      setStatus('Email secured. Continue to payment.', 'success');
    } else {
      setStatus('', 'neutral');
    }
  });

  form.addEventListener('submit', (event) => event.preventDefault());
  toggleButtonGuard(false);

  document.addEventListener('DOMContentLoaded', initPayPal, { once: true });
})();
