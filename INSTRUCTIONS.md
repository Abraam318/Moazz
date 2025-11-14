# Deployment + Customization Guide

## Replace Media
1. Place hero video (`media/1.mp4`) plus gallery .jpg/.mp4 files inside `/media`.
2. Update filenames inside the `#gallery-config` JSON in `index.html` if you add/remove assets.
3. Keep file sizes optimized (<5 MB) for fast cinematic playback.

## PayPal Sandbox / Live Setup
1. Visit https://developer.paypal.com/ and create a REST app.
2. Copy the **Client ID** and replace `PAYPAL_CLIENT_ID` in the PayPal SDK `<script>` URL inside `index.html`.
3. Set the price or currency within `js/payment.js` (`state.price` and `currency_code`).
4. When ready for production, switch the SDK URL from `sandbox` to live credentials.

## EmailJS Configuration
1. Create an EmailJS service, template, and public key.
2. Inside `js/payment.js`, replace:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`
3. Ensure the template uses secure variables such as `to_email`, `subject`, `message`.
4. Enable attachments in the template and keep the PDF on the server only (never share a direct link).

## GitHub Pages Deployment
1. Push this folder to GitHub (main branch recommended).
2. In the repository settings → Pages, choose the branch + root.
3. Wait for the site to build, then update PayPal and EmailJS origins/allowed domains to the GitHub Pages URL.

## Production Hardening
- Keep the PDF filename private; it is only fetched within `payment.js` after payment success.
- Email validation and sanitization happen client-side; keep PayPal buttons disabled until the email is valid.
- Run additional compression/minification if desired (`style.css` + JS files can be minified via any CLI such as `npx minify`).
- Enable HTTPS (automatic on GitHub Pages) to ensure the PayPal SDK loads securely.
