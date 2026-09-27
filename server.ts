import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json());

// In-memory & file storage for inquiries
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
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

// 1. Company Information Endpoint
app.get('/api/company', (_req: Request, res: Response) => {
  res.json({
    name: 'BLJ APPEX GLOBAL',
    tagline: 'International Sourcing Experts',
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
    sourcingCapabilities: [
      'Plain T-Shirt Procurement from Tiruppur Knitters',
      'Job-Work Printing (Screen, DTF, Puff, Embroidery)',
      'Quality Check, Steam Pressing & Protective Packaging',
      'Courier Supply with Pay on Delivery Arrangements',
    ],
  });
});

// 2. Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  const inquiries = getStoredInquiries();
  res.json({
    status: 'online',
    company: 'BLJ APPEX GLOBAL',
    hub: 'Tiruppur, India',
    activeInquiriesCount: inquiries.length,
    timestamp: new Date().toISOString(),
  });
});

// 3. Submit Sourcing Inquiry (from QuickInquiry widget or catalog)
app.post('/api/inquiries', (req: Request, res: Response) => {
  const {
    garmentType,
    isPrinted,
    printMethod,
    quantity,
    deliveryType,
    customerName,
    customerPhone,
    customerNote,
  } = req.body;

  if (!garmentType) {
    res.status(400).json({ error: 'Garment type is required' });
    return;
  }

  const referenceId = `BLJ-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const record = {
    id: referenceId,
    timestamp: new Date().toISOString(),
    garmentType: garmentType || 'Round Neck T-Shirt',
    style: isPrinted === 'printed' ? `Custom Printed (${printMethod || 'Screen Print'})` : 'Plain Blanks (No Print)',
    printMethod: isPrinted === 'printed' ? printMethod : 'None (Plain Garment)',
    quantity: quantity || '100 - 250 pcs',
    deliveryType: deliveryType || 'Courier with Pay on Delivery',
    customerName: customerName || 'Prospective Buyer',
    customerPhone: customerPhone || 'Not provided',
    customerNote: customerNote || '',
    status: 'received',
  };

  saveInquiry(record);

  // Pre-format WhatsApp link with Reference ID
  const waMessage = encodeURIComponent(
    `Hello Balaji / BLJ APPEX GLOBAL,
I submitted inquiry ref: ${referenceId}
• Garment: ${record.garmentType}
• Style: ${record.style}
• Quantity: ${record.quantity}
• Delivery: ${record.deliveryType}
• Contact: ${record.customerName} (${record.customerPhone})
${record.customerNote ? `• Notes: ${record.customerNote}` : ''}`
  );

  const whatsappDirectUrl = `https://wa.me/919095120925?text=${waMessage}`;

  res.status(201).json({
    success: true,
    message: 'Inquiry registered successfully with BLJ APPEX GLOBAL sourcing desk.',
    referenceId,
    record,
    whatsappDirectUrl,
    deskContact: {
      phone: '+91 90951 20925',
      email: 'balaji-india@live.com',
      location: 'Tiruppur – 641607, Tamil Nadu, India',
    },
  });
});

// 4. Submit General Contact Message
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

  res.status(201).json({
    success: true,
    message: 'Your message has been registered directly for Balaji Thiruvengadam.',
    ticketId,
  });
});

// 5. Get recent inquiries list
app.get('/api/inquiries', (_req: Request, res: Response) => {
  const inquiries = getStoredInquiries();
  res.json({
    total: inquiries.length,
    inquiries,
  });
});

// Start Express server and mount Vite
async function startServer() {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.K_SERVICE) ||
    process.env.npm_lifecycle_event === 'start';

  if (isProduction) {
    // Serve static files from dist in production
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BLJ APPEX GLOBAL Server running on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
