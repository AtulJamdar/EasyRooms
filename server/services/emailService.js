const fetch = require('node-fetch');

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

/**
 * Send an email using EmailJS.
 *
 * Requires the following env vars:
 * - EMAILJS_SERVICE_ID
 * - EMAILJS_TEMPLATE_ID
 * - EMAILJS_PUBLIC_KEY
 */
async function sendEmail({ to_name, to_email, message, subject }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS configuration is missing. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY');
  }

  const body = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_name,
      to_email,
      subject,
      message,
    },
  };

  const res = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS request failed (${res.status}): ${text}`);
  }

  return res.json();
}

module.exports = { sendEmail };
