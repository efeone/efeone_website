
(function () {
  'use strict';

  var CONFIG = {
    API_URL: 'https://jalebi.efeone.com/api/resource/Lead',

    AUTH_TOKEN: 'token ffceb203fabe2fc:773041385edd49a',
    SUBJECT: 'efeone Website Enquiry'
  };

  var form = document.querySelector('[data-lead-form], [data-enquiry-form]');
  if (!form) return;

  var statusEl = form.querySelector('.ct-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var btnLabel = submitBtn ? submitBtn.innerHTML : '';

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = type === 'error' ? '#ff9b9b' : type === 'ok' ? '#9be3a6' : '';
  }

  function setBusy(busy) {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.innerHTML = busy ? 'Sending...' : btnLabel;
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  // Capture phase + stopImmediatePropagation so site.js's old handler never runs
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var name = val('name');
    var email = val('email');
    var industry = val('industry');
    var message = val('message');

    if (!name || !email) {
      setStatus('Please enter your name and email.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      return;
    }

    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (CONFIG.AUTH_TOKEN) headers['Authorization'] = CONFIG.AUTH_TOKEN;

    var payload = {
      first_name: name,
      email_id: email,
      mobile_no: val('phone'),
      company_name: val('company'),
      custom_subject: CONFIG.SUBJECT,
      custom_message: (industry ? 'Industry: ' + industry + '\n\n' : '') + message
    };

    setBusy(true);
    setStatus('', '');

    fetch(CONFIG.API_URL, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (body) {
            console.error('Lead API error', res.status, body);
            var err = new Error('Request failed with status ' + res.status);
            err.status = res.status;
            throw err;
          });
        }
        return res.json();
      })
      .then(function () {
        form.reset();
        setBusy(false);
        setStatus('Thank you. We have your enquiry and will reply within one working day.', 'ok');
      })
      .catch(function (err) {
        console.error('Enquiry error:', err);
        setBusy(false);
        setStatus(
          err.status
            ? 'Sorry, we could not send your enquiry (error ' + err.status + '). Please email info@efeone.com.'
            : 'Could not reach the server. Please try again or email info@efeone.com.',
          'error'
        );
      });
  }, true);
})();