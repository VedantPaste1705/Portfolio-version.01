// const express = require('express');
// const path = require('path');
// const nodemailer = require('nodemailer');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// const HOST = process.env.HOST || '0.0.0.0';
// const recipient = process.env.CONTACT_TO || 'vedantpaste17@gmail.com';

// app.use(express.json({ limit: '20kb' }));
// app.use(express.urlencoded({ extended: false, limit: '20kb' }));

// const contactLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many contact attempts. Please try again later.' }
// });

// function createTransporter() {
//   if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
//     throw new Error('SMTP_USER and SMTP_PASS are not configured.');
//   }

//   return nodemailer.createTransport({
//     service: process.env.SMTP_SERVICE || 'gmail',
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });
// }

// app.get('/api/health', (_req, res) => {
//   res.json({ ok: true });
// });

// app.post('/api/contact', contactLimiter, async (req, res) => {
//   try {
//     const name = String(req.body.name || '').trim();
//     const email = String(req.body.email || '').trim();
//     const message = String(req.body.message || '').trim();
//     const website = String(req.body.website || '').trim(); // honeypot

//     if (website) {
//       return res.json({ success: true, message: 'Message sent successfully.' });
//     }

//     if (!name || !email || !message) {
//       return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
//     }

//     if (name.length > 100 || email.length > 254 || message.length > 5000) {
//       return res.status(400).json({ success: false, message: 'One or more fields are too long.' });
//     }

//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//       return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
//     }

//     const transporter = createTransporter();
//     await transporter.sendMail({
//       from: `Portfolio Contact <${process.env.SMTP_USER}>`,
//       to: recipient,
//       replyTo: email,
//       subject: `Portfolio contact from ${name}`,
//       text: [
//         'New message from the portfolio contact form',
//         '',
//         `Name: ${name}`,
//         `Email: ${email}`,
//         '',
//         'Message:',
//         message,
//       ].join('\n'),
//       html: `
//         <h2>New Portfolio Contact</h2>
//         <p><strong>Name:</strong> ${escapeHtml(name)}</p>
//         <p><strong>Email:</strong> ${escapeHtml(email)}</p>
//         <hr>
//         <p><strong>Message:</strong></p>
//         <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
//       `,
//     });

//     res.json({ success: true, message: 'Message sent successfully.' });
//   } catch (error) {
//     console.error('Contact form error:', error.message);
//     res.status(500).json({ success: false, message: 'Unable to send the message right now. Please try again later.' });
//   }
// });

// function escapeHtml(value) {
//   return value
//     .replaceAll('&', '&amp;')
//     .replaceAll('<', '&lt;')
//     .replaceAll('>', '&gt;')
//     .replaceAll('"', '&quot;')
//     .replaceAll("'", '&#039;');
// }

// app.use(express.static(path.join(__dirname, '..')));

// app.get('*', (req, res, next) => {
//   if (req.path.startsWith('/api/')) return next();
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// app.listen(PORT, HOST, () => {
//   console.log(`Portfolio running at http://localhost:${PORT}`);
// });
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors'); // 👈 ADDED: Required for Cross-Origin Resource Sharing
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const recipient = process.env.CONTACT_TO || 'vedantpaste1705@gmail.com';

// 👈 ADDED: Allow requests ONLY from your live GitHub Pages frontend or localhost
const allowedOrigins = [
  'https://github.io',
  'http://localhost:3000',
  'http://localhost:5500' // If you test frontend via Live Server
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many contact attempts. Please try again later.' }
});

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS are not configured.');
  }

  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const message = String(req.body.message || '').trim();
    const website = String(req.body.website || '').trim(); // honeypot

    if (website) {
      return res.json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return res.status(400).json({ success: false, message: 'One or more fields are too long.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: [
        'New message from the portfolio contact form',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to send the message right now. Please try again later.' });
  }
});

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// 👈 CHANGED: Cleaned up static routing because frontend is hosted natively on GitHub Pages.
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, HOST, () => {
  console.log(`Backend API running on port ${PORT}`);
});
