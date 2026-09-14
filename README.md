# Vedant Paste Portfolio

Personal portfolio showcasing projects, certifications, achievements, and technical learning.

## Contact form backend

The portfolio now includes a small Node.js/Express backend for the contact form. Visitors submit their name, email, and message through the site; the backend sends the message to **vedantpaste17@gmail.com** using SMTP. The visitor does not need to open an email client.

### Local setup

1. Install Node.js (LTS recommended).
2. In the project root, install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`.
4. Configure the SMTP credentials. For Gmail, use a **Google App Password** rather than your normal Gmail password.
5. Start the portfolio:

```bash
npm start
```

6. Open `http://localhost:3000`.

### Environment variables

- `SMTP_SERVICE=gmail`
- `SMTP_USER=vedantpaste17@gmail.com`
- `SMTP_PASS=your_google_app_password`
- `CONTACT_TO=vedantpaste17@gmail.com`
- `PORT=3000`

Never commit `.env` or SMTP credentials to GitHub.

### Production deployment

Deploy the project as a Node.js web service so the frontend and `/api/contact` endpoint are served by the same application. Configure the SMTP variables in the hosting provider's secret/environment-variable settings.
