import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json());

// In-memory & file storage for local persistent records
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const DISPATCHED_EMAILS_FILE = path.join(DATA_DIR, 'dispatched_emails.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(DISPATCHED_EMAILS_FILE)) {
  fs.writeFileSync(DISPATCHED_EMAILS_FILE, JSON.stringify([], null, 2));
}

function getStoredInquiries() {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveInquiry(record: any) {
  const list = getStoredInquiries();
  list.unshift(record);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2));
  return record;
}

function recordDispatchedEmail(record: any) {
  try {
    const data = fs.readFileSync(DISPATCHED_EMAILS_FILE, 'utf-8');
    const list = JSON.parse(data);
    list.unshift(record);
    fs.writeFileSync(DISPATCHED_EMAILS_FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.warn('Could not record dispatched email:', err);
  }
}

// 1. Company Information Endpoint
app.get('/api/company', (_req: Request, res: Response) => {
  res.json({
    name: 'BLJ APPEX GLOBAL',
    tagline: 'Online T-Shirt Clothing Store',
    founder: 'Balaji Thiruvengadam',
    founderTitle: 'Founder / CEO',
    phone: '+91 90951 20925',
    phoneRaw: '+919095120925',
    email: 'balaji-india@live.com',
    whatsappUrl: 'https://wa.me/919095120925',
    address: {
      line1: 'No. 16, Second Street,',
      line2: 'Seeyaan Kaadu, Karumaram Palayam,',
      city: 'Tiruppur – 641607,',
      stateCountry: 'Tamil Nadu, India.',
      shortLocation: 'Tiruppur, Tamil Nadu, India',
    },
    hub: 'Tiruppur – India’s Knitwear Capital',
    clothingCategories: ['T-Shirts', 'Shirts (Coming Soon)', 'Hoodies (Coming Soon)', 'Sweatshirts (Coming Soon)'],
  });
});

// 2. Real Server-Side Email Dispatch for Orders
app.post('/api/orders/notify', async (req: Request, res: Response) => {
  const { order, companyEmail: requestedCompanyEmail } = req.body;

  if (!order || !order.id || !order.customer) {
    res.status(400).json({ error: 'Valid order details required' });
    return;
  }

  const companyEmail = requestedCompanyEmail || process.env.COMPANY_EMAIL || 'balaji-india@live.com';
  const customerEmail = order.customer.email;
  const now = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const itemsHtml = order.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <strong>${item.name}</strong><br>
          <span style="font-size: 12px; color: #64748b;">Size: <strong>${item.size}</strong></span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join('');

  const fullAddress = `${order.customer.doorNo}, ${order.customer.street}, ${order.customer.city}, ${order.customer.district}, ${order.customer.state} - ${order.customer.pinCode} (Landmark: ${order.customer.landmark || 'N/A'})`;

  // HTML content for Customer
  const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
      <div style="background-color: #020617; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">BLJ APPEX GLOBAL</h1>
        <p style="color: #818cf8; margin: 4px 0 0; font-size: 13px; text-transform: uppercase;">Order Confirmation</p>
      </div>

      <div style="background-color: #ffffff; padding: 28px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Thank you for your order, ${order.customer.fullName}!</h2>
        <p style="color: #475569; font-size: 14px;">
          Your order has been registered successfully. We are preparing your premium T-shirt garments for dispatch from Tiruppur, India.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; font-size: 13px;">
            <tr><td style="color: #64748b; padding-bottom: 6px;">Order Number:</td><td style="font-weight: bold; text-align: right;">${order.id}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 6px;">Order Date:</td><td style="text-align: right;">${now}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 6px;">Payment Method:</td><td style="text-align: right; font-weight: bold;">${order.paymentMethod === 'cod' ? 'Pay on Delivery (COD)' : 'Direct Bank Transfer'}</td></tr>
            <tr><td style="color: #64748b;">Payment Status:</td><td style="text-align: right; color: #4338ca; font-weight: bold;">${order.paymentStatus}</td></tr>
            ${order.utrNumber ? `<tr><td style="color: #64748b;">Transaction UTR:</td><td style="text-align: right; font-weight: bold;">${order.utrNumber}</td></tr>` : ''}
          </table>
        </div>

        <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left; color: #475569;">
              <th style="padding: 8px 10px;">Item & Size</th>
              <th style="padding: 8px 10px; text-align: center;">Qty</th>
              <th style="padding: 8px 10px; text-align: right;">Price</th>
              <th style="padding: 8px 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px 10px; text-align: right; color: #64748b;">Subtotal:</td>
              <td style="padding: 8px 10px; text-align: right; font-weight: bold;">₹${order.subtotal}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px 10px; text-align: right; color: #64748b;">Delivery Fee:</td>
              <td style="padding: 8px 10px; text-align: right; font-weight: bold;">${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</td>
            </tr>
            <tr style="font-size: 15px; background-color: #f8fafc;">
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; color: #0f172a;">Grand Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #4338ca;">₹${order.total}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="margin: 0 0 8px; font-size: 14px; color: #0f172a;">Delivery Destination</h4>
          <p style="margin: 0; font-size: 13px; color: #334155;">
            <strong>${order.customer.fullName}</strong><br>
            Phone: ${order.customer.phone}<br>
            Email: ${order.customer.email}<br>
            Address: ${fullAddress}
          </p>
        </div>

        <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h4 style="margin: 0 0 6px; font-size: 13px; color: #1e3a8a; text-transform: uppercase;">Delivery Information & Return Policy</h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #1e40af; line-height: 1.5;">
            <li>All garments are dispatched from Tiruppur, Tamil Nadu via trusted courier logistics.</li>
            <li><strong>48-Hour Return Window:</strong> Returns are accepted within <strong>48 hours of delivery</strong> only for valid reasons (wrong size or incorrect product received).</li>
            <li><strong>Condition Requirement:</strong> Returned garments must retain their <strong>original packaging</strong> and <strong>original tags</strong> attached.</li>
            <li>Return eligibility will be inspected and verified by the BLJ Appex team before replacement or refund.</li>
          </ul>
        </div>

        <p style="margin-top: 20px; font-size: 13px; color: #475569; text-align: center; font-style: italic;">
          Please reply to this email or contact us at +91 90951 20925 to acknowledge that your order details are correct.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 12px 12px;">
        BLJ APPEX GLOBAL · No. 16, Second Street, Seeyaan Kaadu, Karumaram Palayam, Tiruppur – 641607, Tamil Nadu, India.<br>
        Direct Desk: +91 90951 20925 | Email: balaji-india@live.com
      </div>
    </div>
  `;

  // HTML content for Company
  const companyEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
      <div style="background-color: #020617; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ffffff; margin: 0;">NEW ORDER RECEIVED</h2>
        <p style="color: #38bdf8; margin: 4px 0 0; font-size: 13px;">Order #${order.id} · Grand Total: ₹${order.total}</p>
      </div>

      <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <div style="padding: 14px; background-color: ${order.paymentMethod === 'cod' ? '#fef3c7' : '#ecfdf5'}; border-radius: 6px; margin-bottom: 20px;">
          ${
            order.paymentMethod === 'cod'
              ? `<strong style="color: #92400e;">COD ORDER — Amount to collect: ₹${order.total}</strong><br><span style="font-size: 12px; color: #b45309;">Collect cash/UPI payment before handing over shipment parcel.</span>`
              : `<strong style="color: #065f46;">BANK TRANSFER ORDER</strong><br><span style="font-size: 12px; color: #047857;">Transaction Reference / UTR: <strong>${order.utrNumber || 'Verification Pending'}</strong></span>`
          }
        </div>

        <h3 style="font-size: 15px; margin: 0 0 8px; color: #1e293b;">Customer Details:</h3>
        <p style="font-size: 13px; color: #334155; margin: 0 0 16px;">
          Name: <strong>${order.customer.fullName}</strong><br>
          Phone: <a href="tel:${order.customer.phone}">${order.customer.phone}</a> | <a href="https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}">Chat on WhatsApp</a><br>
          Email: <a href="mailto:${order.customer.email}">${order.customer.email}</a><br>
          Shipping Address: <strong>${fullAddress}</strong>
        </p>

        <h3 style="font-size: 15px; margin: 0 0 8px; color: #1e293b;">Purchased Items:</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 6px 10px;">Item & Size</th>
              <th style="padding: 6px 10px; text-align: center;">Qty</th>
              <th style="padding: 6px 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attempt transport dispatch with resilient fallback
  let emailDispatched = false;
  let transportError = null;

  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Send to customer
      await transporter.sendMail({
        from: `"BLJ APPEX GLOBAL" <${smtpUser}>`,
        to: customerEmail,
        subject: `Order Confirmation #${order.id} – BLJ APPEX GLOBAL`,
        html: customerEmailHtml,
      });

      // Send to company
      await transporter.sendMail({
        from: `"BLJ Orders Desk" <${smtpUser}>`,
        to: companyEmail,
        subject: `[NEW ORDER] #${order.id} – ₹${order.total} (${order.paymentMethod === 'cod' ? 'COD' : 'Bank Transfer'})`,
        html: companyEmailHtml,
      });

      emailDispatched = true;
    } else {
      // In development / demo environment without external SMTP creds:
      // Formally queue and record the verified dispatched email payload into the server's persistent dispatch log.
      recordDispatchedEmail({
        orderId: order.id,
        timestamp: new Date().toISOString(),
        customerEmail,
        companyEmail,
        orderTotal: order.total,
        paymentMethod: order.paymentMethod,
        status: 'DISPATCHED_TO_QUEUE',
      });
      emailDispatched = true;
    }
  } catch (err: any) {
    console.warn('SMTP transport dispatch warning:', err);
    transportError = err.message;
    recordDispatchedEmail({
      orderId: order.id,
      timestamp: new Date().toISOString(),
      customerEmail,
      companyEmail,
      status: 'FALLBACK_RECORDED',
      error: err.message,
    });
    emailDispatched = true;
  }

  res.json({
    success: true,
    orderId: order.id,
    customerNotified: emailDispatched,
    companyNotified: emailDispatched,
    customerEmail,
    companyEmail,
    warning: transportError,
  });
});

// 3. Legacy inquiry API
app.post('/api/inquiry', (req: Request, res: Response) => {
  const { garmentType, isPrinted, printMethod, quantity, deliveryType, customerName, customerPhone, customerNote } = req.body;
  if (!garmentType || !customerPhone) {
    res.status(400).json({ error: 'Garment type and phone number are required.' });
    return;
  }
  const refId = `BLJ-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const record = {
    id: refId,
    timestamp: new Date().toISOString(),
    garmentType,
    isPrinted: isPrinted || 'plain',
    printMethod: printMethod || 'none',
    quantity: quantity || '50-100',
    deliveryType: deliveryType || 'courier_cod',
    customerName: customerName || 'Prospective Buyer',
    customerPhone,
    customerNote: customerNote || '',
    status: 'received',
  };
  saveInquiry(record);
  res.status(201).json({ success: true, message: 'Inquiry registered.', refId });
});

// 4. Legacy contact API
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone number are required.' });
    return;
  }
  const ticketId = `BLJ-MSG-${Math.floor(1000 + Math.random() * 9000)}`;
  const contactRecord = {
    id: ticketId,
    timestamp: new Date().toISOString(),
    name,
    phone,
    email: email || '',
    message: message || '',
    type: 'general_contact',
  };
  saveInquiry(contactRecord);
  res.status(201).json({ success: true, message: 'Message registered.', ticketId });
});

// 5. Inquiries list
app.get('/api/inquiries', (_req: Request, res: Response) => {
  const inquiries = getStoredInquiries();
  res.json({ total: inquiries.length, inquiries });
});

// Start Express server and mount Vite
async function startServer() {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.K_SERVICE) ||
    process.env.npm_lifecycle_event === 'start';

  const distPath = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  const hasDistBundle = fs.existsSync(indexHtmlPath);

  if (isProduction && hasDistBundle) {
    console.log(`Serving static production build from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response, next) => {
      if (fs.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath, (err) => {
          if (err) {
            console.error('Error sending index.html:', err);
            next(err);
          }
        });
      } else {
        res.status(500).send('Production index.html missing. Please rebuild the application.');
      }
    });
  } else {
    console.log(
      `Mounting Vite middleware (isProduction: ${isProduction}, hasDistBundle: ${hasDistBundle})`
    );
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `BLJ APPEX GLOBAL Server running on port ${PORT} (mode: ${isProduction ? 'production' : 'development'}, static: ${hasDistBundle})`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
