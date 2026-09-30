import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Product,
  Order,
  StoreSettings,
  ApparelSize,
  OrderStatus,
  CustomerProfile,
  CustomerRegistrationData,
  DeliveryAddress,
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS } from '../data/products';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned named database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export const AUTHORIZED_ADMIN_EMAILS = [
  'joshithagawrib@gmail.com',
  'balaji-india@live.com',
  'info@bljapparexports.com',
  'balajiapparexport@gmail.com',
];

export async function signInAdminWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  return result.user;
}

export async function signOutAdmin(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function signOutCustomer(): Promise<void> {
  await firebaseSignOut(auth);
}

/* -------------------------------------------------------------
 * 0. Customer Authentication & Profile Management
 * ----------------------------------------------------------- */

/**
 * 1-Click Sign in or Sign up for Customers with Google
 */
export async function signInCustomerWithGoogle(): Promise<CustomerProfile> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  const user = result.user;
  const email = (user.email || '').toLowerCase().trim();
  const uid = user.uid;

  const now = new Date().toISOString();
  const custDocRef = doc(db, 'customers', uid);
  const snap = await getDoc(custDocRef);

  let profile: CustomerProfile;

  if (snap.exists()) {
    const existing = snap.data() as CustomerProfile;
    profile = {
      ...existing,
      lastLoginAt: now,
      photoURL: user.photoURL || existing.photoURL,
    };
    await updateDoc(custDocRef, {
      lastLoginAt: now,
      photoURL: profile.photoURL || null,
    });
  } else {
    profile = {
      uid,
      email,
      fullName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL || undefined,
      createdAt: now,
      lastLoginAt: now,
      provider: 'google',
    };
    await setDoc(custDocRef, profile);
  }

  // Also save/update email-based pointer for lookup
  if (email) {
    try {
      await setDoc(doc(db, 'customers', `email_${email}`), { uid, email }, { merge: true });
    } catch {
      // ignore
    }
  }

  return profile;
}

/**
 * Sign in Customer with Email & Password
 */
export async function signInCustomerWithEmail(
  email: string,
  passcode: string
): Promise<CustomerProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  const emailDocRef = doc(db, 'customers', `email_${normalizedEmail}`);
  const emailSnap = await getDoc(emailDocRef);

  let targetUid: string = '';
  if (emailSnap.exists()) {
    targetUid = emailSnap.data().uid;
  }

  // If found by UID or lookup directly
  let profileDoc = targetUid ? await getDoc(doc(db, 'customers', targetUid)) : null;
  if (!profileDoc || !profileDoc.exists()) {
    // Check direct email id
    profileDoc = await getDoc(doc(db, 'customers', normalizedEmail));
  }

  if (profileDoc && profileDoc.exists()) {
    const data = profileDoc.data() as any;
    // If password was saved, verify it (or accept if none was set previously)
    if (data.password && data.password !== passcode) {
      throw new Error('Incorrect password. Please verify your credentials or use Google Sign-In.');
    }

    const now = new Date().toISOString();
    await updateDoc(profileDoc.ref, { lastLoginAt: now });

    const { password: _, ...cleanProfile } = data;
    return cleanProfile as CustomerProfile;
  }

  throw new Error('No customer account found with this email. Please click "Create Account" to sign up.');
}

/**
 * Register a new Customer Account
 */
export async function signUpCustomer(
  data: CustomerRegistrationData
): Promise<CustomerProfile> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const now = new Date().toISOString();
  const uid = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Construct initial delivery address if provided
  let address: DeliveryAddress | undefined;
  if (data.doorNo && data.street && data.city && data.pinCode) {
    address = {
      fullName: data.fullName,
      phone: data.phone,
      email: normalizedEmail,
      doorNo: data.doorNo,
      street: data.street,
      city: data.city,
      district: data.district || data.city,
      state: data.state || 'Tamil Nadu',
      pinCode: data.pinCode,
      landmark: data.landmark,
    };
  }

  const profile: CustomerProfile = {
    uid,
    email: normalizedEmail,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    address,
    createdAt: now,
    lastLoginAt: now,
    provider: 'email',
  };

  // Save in Firestore
  await setDoc(doc(db, 'customers', uid), {
    ...profile,
    password: data.password || '',
  });

  // Save email pointer
  await setDoc(doc(db, 'customers', `email_${normalizedEmail}`), {
    uid,
    email: normalizedEmail,
  });

  return profile;
}

/**
 * Update Customer Profile in Firestore
 */
export async function updateCustomerProfileInDb(profile: CustomerProfile): Promise<void> {
  try {
    const docRef = doc(db, 'customers', profile.uid);
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.warn('Failed to update customer profile in Firestore:', err);
  }
}

/**
 * Subscribe to only this customer's orders in real-time
 */
export function subscribeToCustomerOrders(
  customerEmail: string,
  onData: (orders: Order[]) => void,
  onError?: (err: Error) => void
) {
  if (!customerEmail) {
    onData([]);
    return () => {};
  }

  try {
    const normalized = customerEmail.toLowerCase().trim();
    // Query orders matching this customer's email
    const q = query(
      collection(db, 'orders'),
      where('customer.email', '==', normalized),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => d.data() as Order);
        onData(items);
      },
      (error) => {
        console.warn('subscribeToCustomerOrders error (falling back to client filter):', error);
        // Resilient fallback in case compound index is still building in Firestore
        const fallbackQuery = query(collection(db, 'orders'), limit(100));
        return onSnapshot(fallbackQuery, (snap) => {
          const items = snap.docs
            .map((d) => d.data() as Order)
            .filter((o) => o.customer?.email?.toLowerCase().trim() === normalized)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          onData(items);
        }, onError);
      }
    );
  } catch (err: any) {
    console.warn('subscribeToCustomerOrders catch:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/* -------------------------------------------------------------
 * 1. Product Catalog & Live Stock Management
 * ----------------------------------------------------------- */

/**
 * Fetch all products from Firestore, initializing with default catalog if empty.
 */
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as Product);
    }

    // Seed initial products if collection is empty
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), prod);
    }
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.warn('Could not read products from Firestore, using initial products fallback:', err);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Real-time listener for products with instant stock updates
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  try {
    return onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (snapshot.empty) {
          onData(INITIAL_PRODUCTS);
        } else {
          const items = snapshot.docs.map((d) => d.data() as Product);
          onData(items);
        }
      },
      (error) => {
        console.warn('Error in subscribeToProducts:', error);
        if (onError) onError(error);
        onData(INITIAL_PRODUCTS);
      }
    );
  } catch (err) {
    console.warn('subscribeToProducts catch:', err);
    onData(INITIAL_PRODUCTS);
    return () => {};
  }
}

/**
 * Atomically reduce stock for ordered sizes. Never allows negative stock.
 */
export async function deductProductStock(
  productId: string,
  size: ApparelSize,
  quantity: number
): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', productId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as Product;
      const currentStock = data.stock?.[size] ?? 0;
      const newStock = Math.max(0, currentStock - quantity);

      await updateDoc(docRef, {
        [`stock.${size}`]: newStock,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Failed to deduct stock for ${productId} size ${size}:`, error);
    return false;
  }
}

/**
 * Update stock manually (Admin Hub)
 */
export async function updateProductStock(
  productId: string,
  stockMap: Record<ApparelSize, number>
) {
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, { stock: stockMap });
}

/* -------------------------------------------------------------
 * 2. Orders Management
 * ----------------------------------------------------------- */

/**
 * Save new customer order into Firestore
 */
export async function createOrderInFirestore(order: Order): Promise<Order> {
  const orderRef = doc(db, 'orders', order.id);
  const orderData = {
    ...order,
    timestamp: serverTimestamp(),
  };

  await setDoc(orderRef, orderData);

  // Deduct stock for each item purchased
  for (const item of order.items) {
    await deductProductStock(item.productId, item.size, item.quantity);
  }

  return order;
}

/**
 * Get single order by Order ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Order;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Subscribe to all orders (Admin desk)
 */
export function subscribeToAllOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => d.data() as Order);
        onData(items);
      },
      (error) => {
        console.warn('subscribeToAllOrders error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('subscribeToAllOrders catch:', err);
    return () => {};
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
  const docRef = doc(db, 'orders', orderId);
  const updateData: any = { orderStatus };
  if (orderStatus === 'DELIVERED' || orderStatus === 'COMPLETED') {
    updateData.deliveredAt = new Date().toISOString();
  }
  await updateDoc(docRef, updateData);
}

/**
 * Update payment status
 */
export async function updateOrderPayment(orderId: string, paymentStatus: string) {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, { paymentStatus });
}

/**
 * Submit return request on order (within 48 hours of delivery)
 */
export async function submitReturnRequest(
  orderId: string,
  reason: string,
  notes: string
) {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    orderStatus: 'RETURN REQUESTED',
    returnRequest: {
      reason,
      notes,
      requestedAt: new Date().toISOString(),
      status: 'RETURN REQUESTED',
    },
  });
}

/* -------------------------------------------------------------
 * 3. Store Settings & Bank Transfer Details
 * ----------------------------------------------------------- */

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, 'settings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    // Initialize default settings in Firestore
    await setDoc(docRef, DEFAULT_STORE_SETTINGS);
    return DEFAULT_STORE_SETTINGS;
  } catch (err) {
    console.warn('Error reading store settings, using default:', err);
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: StoreSettings) {
  const docRef = doc(db, 'settings', 'general');
  await setDoc(docRef, settings, { merge: true });
}

/* -------------------------------------------------------------
 * 4. Legacy Support (Inquiries & Contacts)
 * ----------------------------------------------------------- */

export interface InquiryData {
  id?: string;
  garmentType: string;
  isPrinted: string;
  printMethod: string;
  quantity: string;
  deliveryType: string;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  status?: string;
  createdAt?: string;
}

export interface ContactData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt?: string;
}

export async function getInquiryById(id: string): Promise<InquiryData | null> {
  try {
    const docRef = doc(db, 'inquiries', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as InquiryData;
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  const docRef = doc(db, 'inquiries', id);
  await updateDoc(docRef, { status });
}

export async function saveInquiryToFirestore(data: InquiryData) {
  const refId = data.id || `BLJ-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  const record = {
    ...data,
    id: refId,
    status: data.status || 'received',
    createdAt: data.createdAt || now,
    timestamp: serverTimestamp(),
  };
  const docRef = doc(db, 'inquiries', refId);
  await setDoc(docRef, record);
  return { ...record, id: refId };
}

export async function saveContactToFirestore(data: ContactData) {
  const ticketId = data.id || `BLJ-MSG-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  const record = {
    ...data,
    id: ticketId,
    createdAt: data.createdAt || now,
    status: 'new',
    timestamp: serverTimestamp(),
  };
  const docRef = doc(db, 'contacts', ticketId);
  await setDoc(docRef, record);
  return { ...record, id: ticketId };
}

/**
 * Validate Firestore connection
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline:', error.message);
    }
    return false;
  }
}
